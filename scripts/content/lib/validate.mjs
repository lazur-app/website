// @ts-check
/**
 * A small JSON Schema validator covering what our schemas use: type, properties, required,
 * additionalProperties:false, items, enum, minItems, maxItems, minLength, maxLength, pattern,
 * minimum, maximum, const, anyOf. No dependency, so it runs anywhere the pipeline runs.
 */

/**
 * @param {any} schema
 * @param {unknown} value
 * @param {string} [at]
 * @returns {string[]}
 */
export function validate(schema, value, at = "$") {
  /** @type {string[]} */
  const errs = [];
  if (!schema || typeof schema !== "object") return errs;
  if (schema.anyOf) {
    const ok = schema.anyOf.some((/** @type {any} */ s) => validate(s, value, at).length === 0);
    if (!ok) errs.push(`${at}: does not match any allowed shape`);
    return errs;
  }
  if (schema.const !== undefined && value !== schema.const) errs.push(`${at}: must be ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) errs.push(`${at}: must be one of ${schema.enum.join(", ")}`);
  const t = schema.type;
  if (t) {
    const types = Array.isArray(t) ? t : [t];
    const actual = Array.isArray(value) ? "array" : value === null ? "null" : Number.isInteger(value) ? "integer" : typeof value;
    const ok = types.some((/** @type {string} */ x) => x === actual || (x === "number" && actual === "integer"));
    if (!ok) {
      errs.push(`${at}: expected ${types.join("|")}, got ${actual}`);
      return errs;
    }
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) errs.push(`${at}: shorter than ${schema.minLength} chars`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errs.push(`${at}: longer than ${schema.maxLength} chars`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errs.push(`${at}: does not match ${schema.pattern}`);
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) errs.push(`${at}: below ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errs.push(`${at}: above ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errs.push(`${at}: needs at least ${schema.minItems} items`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errs.push(`${at}: at most ${schema.maxItems} items`);
    if (schema.items) value.forEach((v, i) => errs.push(...validate(schema.items, v, `${at}[${i}]`)));
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = /** @type {Record<string, unknown>} */ (value);
    for (const key of schema.required ?? []) if (!(key in obj)) errs.push(`${at}.${key}: required`);
    for (const [key, v] of Object.entries(obj)) {
      if (schema.properties?.[key]) errs.push(...validate(schema.properties[key], v, `${at}.${key}`));
      else if (schema.additionalProperties === false) errs.push(`${at}.${key}: not allowed`);
    }
  }
  return errs;
}
