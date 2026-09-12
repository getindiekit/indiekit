import { randomBytes } from "node:crypto";

/**
 * A UUIDv7 for a known point in time
 *
 * `crypto.randomUUIDv7()` always stamps the current time, so it cannot give an
 * existing post an identifier that sorts by when the post was created. RFC 9562
 * lays the value out as a 48-bit big-endian millisecond timestamp, four version
 * bits, twelve free bits, two variant bits, then random. `seq` goes in the free
 * bits so that documents sharing a timestamp keep the order they arrive in.
 * @param {number} msecs - Milliseconds since the epoch
 * @param {number} seq - Tiebreaker within one millisecond, 0-4095
 * @returns {string} UUIDv7
 */
export const uuidv7At = (msecs, seq) => {
  const bytes = randomBytes(16);

  bytes.writeUIntBE(msecs, 0, 6);
  bytes.writeUInt16BE(0x70_00 | (seq & 0x0f_ff), 6);
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytes
    .toString("hex")
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
};

/**
 * Give every document in a collection a `properties.uid`
 *
 * Existing posts predate the identifier, and their creation time only survives
 * in the ObjectId. That timestamp resolves to the second, while the sequence
 * holds 4096 values per millisecond, so documents sharing a second are spread
 * across the milliseconds within it: enough for 4,096,000 of them before the
 * second is exhausted, and the order always matches `_id`.
 * @param {object} collection - MongoDB collection
 * @returns {Promise<number>} Number of documents updated
 */
export const backfillUids = async (collection) => {
  const cursor = collection.find(
    { "properties.uid": { $exists: false } },
    { sort: { _id: 1 } },
  );

  let second;
  let index = 0;
  let updated = 0;

  for await (const { _id } of cursor) {
    const msecs = _id.getTimestamp().getTime();
    index = msecs === second ? index + 1 : 0;
    second = msecs;

    await collection.updateOne(
      { _id },
      {
        $set: {
          "properties.uid": uuidv7At(
            msecs + Math.floor(index / 4096),
            index % 4096,
          ),
        },
      },
    );

    updated++;
  }

  return updated;
};
