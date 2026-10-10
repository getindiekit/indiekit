import { randomBytes } from "node:crypto";

/**
 * A UUIDv7 for a known point in time
 *
 * `crypto.randomUUIDv7()` always stamps the current time, so it cannot give a
 * document an identifier that sorts by when it was created or published. RFC
 * 9562 lays the value out as a 48-bit big-endian millisecond timestamp, four
 * version bits, twelve free bits, two variant bits, then random. `seq` goes in
 * the free bits so that documents sharing a timestamp keep the order they
 * arrive in; left out, those bits stay random.
 * @param {number} msecs - Milliseconds since the epoch
 * @param {number} [seq] - Tiebreaker within one millisecond, 0-4095
 * @returns {string} UUIDv7
 */
export const uuidv7At = (msecs, seq) => {
  const bytes = randomBytes(16);
  const sequence = seq ?? bytes.readUInt16BE(6) & 0x0f_ff;

  bytes.writeUIntBE(msecs, 0, 6);
  bytes.writeUInt16BE(0x70_00 | (sequence & 0x0f_ff), 6);
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytes
    .toString("hex")
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
};
