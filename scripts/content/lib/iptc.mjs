// @ts-check
/**
 * IPTC-IIM keywords in a JPEG (APP13 "Photoshop 3.0" segment, resource 0x0404). sharp writes EXIF
 * and XMP but not IPTC, and some image search crawlers and DAMs still read IPTC first, so we write
 * all three. Small, dependency-free, with a reader so tests can check the round trip.
 */

const PS_HEADER = Buffer.from("Photoshop 3.0\0", "latin1");

/**
 * @param {number} record
 * @param {number} dataset
 * @param {Buffer} data
 */
function dataset(record, dataset, data) {
  const head = Buffer.alloc(5);
  head[0] = 0x1c;
  head[1] = record;
  head[2] = dataset;
  head.writeUInt16BE(data.length, 3);
  return Buffer.concat([head, data]);
}

/** @param {string} s @param {number} max */
const utf8 = (s, max) => {
  let b = Buffer.from(s, "utf8");
  while (b.length > max) {
    s = s.slice(0, -1);
    b = Buffer.from(s, "utf8");
  }
  return b;
};

/**
 * @param {{ keywords: string[], caption?: string, title?: string, byline?: string, credit?: string, source?: string, copyright?: string }} meta
 */
export function buildIptc(meta) {
  const parts = [
    dataset(1, 90, Buffer.from([0x1b, 0x25, 0x47])), // coded character set: UTF-8
    dataset(2, 0, Buffer.from([0x00, 0x04])), // record version
  ];
  if (meta.title) parts.push(dataset(2, 5, utf8(meta.title, 64)));
  for (const k of meta.keywords.slice(0, 30)) parts.push(dataset(2, 25, utf8(k, 64)));
  if (meta.byline) parts.push(dataset(2, 80, utf8(meta.byline, 32)));
  if (meta.credit) parts.push(dataset(2, 110, utf8(meta.credit, 32)));
  if (meta.source) parts.push(dataset(2, 115, utf8(meta.source, 32)));
  if (meta.copyright) parts.push(dataset(2, 116, utf8(meta.copyright, 128)));
  if (meta.caption) parts.push(dataset(2, 120, utf8(meta.caption, 2000)));
  let iptc = Buffer.concat(parts);
  if (iptc.length % 2) iptc = Buffer.concat([iptc, Buffer.from([0])]);

  const res = Buffer.alloc(4 + 2 + 2 + 4);
  res.write("8BIM", 0, "latin1");
  res.writeUInt16BE(0x0404, 4);
  res.writeUInt16BE(0x0000, 6); // empty pascal name, padded
  res.writeUInt32BE(iptc.length, 8);
  const payload = Buffer.concat([PS_HEADER, res, iptc]);
  const seg = Buffer.alloc(4);
  seg[0] = 0xff;
  seg[1] = 0xed;
  seg.writeUInt16BE(payload.length + 2, 2);
  return Buffer.concat([seg, payload]);
}

/**
 * Insert (or replace) the APP13 segment after the JPEG's APP0/APP1 segments.
 * @param {Buffer} jpeg
 * @param {Buffer} app13
 */
export function injectIptc(jpeg, app13) {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) throw new Error("not a JPEG");
  let pos = 2;
  /** @type {Buffer[]} */
  const kept = [jpeg.subarray(0, 2)];
  let inserted = false;
  while (pos < jpeg.length) {
    if (jpeg[pos] !== 0xff) break;
    const marker = jpeg[pos + 1];
    if (marker === 0xda || marker === 0xd9) break; // start of scan / end
    const len = jpeg.readUInt16BE(pos + 2);
    const segment = jpeg.subarray(pos, pos + 2 + len);
    const isApp01 = marker === 0xe0 || marker === 0xe1;
    if (!isApp01 && !inserted) {
      kept.push(app13);
      inserted = true;
    }
    if (marker !== 0xed) kept.push(segment); // drop any old APP13
    pos += 2 + len;
  }
  if (!inserted) kept.push(app13);
  kept.push(jpeg.subarray(pos));
  return Buffer.concat(kept);
}

/**
 * Read IPTC datasets back (for tests and seo-lint).
 * @param {Buffer} jpeg
 * @returns {{ keywords: string[], caption?: string, byline?: string, title?: string, copyright?: string } | null}
 */
export function readIptc(jpeg) {
  let pos = 2;
  while (pos < jpeg.length && jpeg[pos] === 0xff) {
    const marker = jpeg[pos + 1];
    if (marker === 0xda) break;
    const len = jpeg.readUInt16BE(pos + 2);
    if (marker === 0xed) {
      const body = jpeg.subarray(pos + 4, pos + 2 + len);
      const start = body.indexOf(Buffer.from("8BIM\x04\x04", "latin1"));
      if (start < 0) return null;
      const size = body.readUInt32BE(start + 8);
      const data = body.subarray(start + 12, start + 12 + size);
      /** @type {{ keywords: string[], caption?: string, byline?: string, title?: string, copyright?: string }} */
      const out = { keywords: [] };
      let i = 0;
      while (i + 5 <= data.length && data[i] === 0x1c) {
        const rec = data[i + 1];
        const ds = data[i + 2];
        const l = data.readUInt16BE(i + 3);
        const v = data.subarray(i + 5, i + 5 + l).toString("utf8");
        if (rec === 2 && ds === 25) out.keywords.push(v);
        if (rec === 2 && ds === 120) out.caption = v;
        if (rec === 2 && ds === 80) out.byline = v;
        if (rec === 2 && ds === 5) out.title = v;
        if (rec === 2 && ds === 116) out.copyright = v;
        i += 5 + l;
      }
      return out;
    }
    pos += 2 + len;
  }
  return null;
}
