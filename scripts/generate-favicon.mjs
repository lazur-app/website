import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = path.join(root, "public/logo.png");
const tmp32 = path.join(root, ".tmp-favicon-32.png");
const appDir = path.join(root, "src/app");

const logo = fs.readFileSync(logoPath);
const b64 = logo.toString("base64");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#f4f3f0"/>
  <image href="data:image/png;base64,${b64}" x="2" y="2" width="28" height="28" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

fs.writeFileSync(path.join(appDir, "icon.svg"), svg);
fs.copyFileSync(logoPath, path.join(appDir, "icon.png"));
fs.copyFileSync(logoPath, path.join(appDir, "apple-icon.png"));

execSync(`sips -z 32 32 "${logoPath}" --out "${tmp32}"`, { stdio: "ignore" });
const png32 = fs.readFileSync(tmp32);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry[0] = 32;
entry[1] = 32;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png32.length, 8);
entry.writeUInt32LE(22, 12);

fs.writeFileSync(path.join(appDir, "favicon.ico"), Buffer.concat([header, entry, png32]));
fs.unlinkSync(tmp32);

console.log("Favicon assets updated");
