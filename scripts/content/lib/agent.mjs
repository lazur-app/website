// @ts-check
/**
 * Model calls for the content pipeline, through headless Claude Code (`claude -p`) on a Claude Code
 * seat (CLAUDE_CODE_OAUTH_TOKEN). Port of SRCo's agent-content pattern:
 *
 *   research(): Haiku with WebSearch + WebFetch only, returns sourced notes as JSON.
 *   write():    Haiku with no tools, turns the notes into the page JSON.
 *   Both are validated against a JSON Schema; on failure the errors go back once for a correction.
 *   Every call appends a line to <runDir>/usage.jsonl (cost, tokens, duration).
 *
 * CONTENT_AGENT_FAKE=1 swaps the model for fixtures (scripts/content/fixtures/) so the whole
 * pipeline can be tested without a seat or spending anything.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { validate } from "./validate.mjs";

export const MODELS = {
  research: process.env.CONTENT_RESEARCH_MODEL || "haiku",
  write: process.env.CONTENT_WRITE_MODEL || "haiku",
};

const TIMEOUT_MS = Number(process.env.CONTENT_AGENT_TIMEOUT_MS || 6 * 60 * 1000);

/**
 * @param {string[]} args
 * @param {string} input
 * @returns {Promise<{ stdout: string, stderr: string, code: number | null }>}
 */
function run(args, input) {
  return new Promise((resolve) => {
    const child = spawn(process.env.CLAUDE_BIN || "claude", args, {
      env: { ...process.env, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1" },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGKILL"), TIMEOUT_MS);
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code });
    });
    child.stdin.end(input);
  });
}

/**
 * Pull a JSON value out of the CLI's result envelope. --json-schema answers land in
 * `structured_output`; otherwise parse the last fenced or bare JSON object in `result`.
 * @param {any} envelope
 */
export function extractJson(envelope) {
  if (envelope && envelope.structured_output !== undefined) return envelope.structured_output;
  const text = String(envelope?.result ?? "");
  const fence = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].at(-1);
  const candidate = fence ? fence[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(candidate);
}

/**
 * @param {string} runDir
 * @param {Record<string, unknown>} row
 */
function logUsage(runDir, row) {
  if (!runDir) return;
  fs.mkdirSync(runDir, { recursive: true });
  fs.appendFileSync(path.join(runDir, "usage.jsonl"), JSON.stringify({ at: new Date().toISOString(), ...row }) + "\n");
}

/**
 * One model call that must return JSON matching `schema`.
 * @param {{ prompt: string, schema: object, model: string, tools: string[], label: string, runDir: string, maxTurns?: number, fake?: () => unknown }} opts
 * @returns {Promise<any>}
 */
export async function callJson({ prompt, schema, model, tools, label, runDir, maxTurns = 20, fake }) {
  if (process.env.CONTENT_AGENT_FAKE === "1") {
    if (!fake) throw new Error(`no fixture for ${label}`);
    const value = fake();
    logUsage(runDir, { label, model: "fake", cost_usd: 0, ok: true });
    return value;
  }

  let attempt = 0;
  let currentPrompt = prompt;
  let lastErrors = "";
  while (attempt < 2) {
    attempt++;
    const args = [
      "-p",
      "--output-format",
      "json",
      "--model",
      model,
      "--max-turns",
      String(maxTurns),
      "--json-schema",
      JSON.stringify(schema),
      "--permission-mode",
      "dontAsk",
      "--max-budget-usd",
      String(process.env.CONTENT_MAX_USD_PER_CALL || "0.75"),
    ];
    if (tools.length > 0) args.push("--allowedTools", tools.join(","), "--tools", tools.join(","));
    else args.push("--tools", "");
    const started = Date.now();
    const { stdout, stderr, code } = await run(args, currentPrompt);
    /** @type {any} */
    let envelope = null;
    try {
      envelope = JSON.parse(stdout);
    } catch {
      envelope = null;
    }
    logUsage(runDir, {
      label,
      model,
      attempt,
      exit: code,
      ms: Date.now() - started,
      cost_usd: envelope?.total_cost_usd ?? null,
      usage: envelope?.usage ?? null,
      turns: envelope?.num_turns ?? null,
      ok: Boolean(envelope && !envelope.is_error),
    });
    if (!envelope || envelope.is_error) {
      lastErrors = `CLI failed (exit ${code}): ${(envelope?.result || stderr || stdout).slice(0, 400)}`;
      continue;
    }
    let value;
    try {
      value = extractJson(envelope);
    } catch (e) {
      lastErrors = `Answer was not valid JSON: ${/** @type {Error} */ (e).message}`;
      currentPrompt = `${prompt}\n\nYour previous answer was not valid JSON. Return only the JSON object.`;
      continue;
    }
    const errors = validate(schema, value);
    if (errors.length === 0) return value;
    lastErrors = errors.slice(0, 20).join("\n");
    currentPrompt = `${prompt}\n\nYOUR PREVIOUS ANSWER:\n${JSON.stringify(value)}\n\nIT FAILED SCHEMA VALIDATION:\n${lastErrors}\n\nReturn the corrected JSON object only.`;
  }
  throw new Error(`${label}: ${lastErrors}`);
}

/**
 * Research step: web search allowed, returns { facts[], sources[] , ... } per the given schema.
 * @param {{ prompt: string, schema: object, label: string, runDir: string, fake?: () => unknown }} o
 */
export function research(o) {
  return callJson({ ...o, model: MODELS.research, tools: ["WebSearch", "WebFetch"], maxTurns: 30 });
}

/**
 * Write step: no tools, turns research into page JSON.
 * @param {{ prompt: string, schema: object, label: string, runDir: string, fake?: () => unknown }} o
 */
export function write(o) {
  return callJson({ ...o, model: MODELS.write, tools: [], maxTurns: 4 });
}
