import { uuidv7At } from "@indiekit/util";

/**
 * Give every document in a collection a `properties.uid`
 *
 * Existing posts predate the identifier, and their creation time only survives
 * in the ObjectId. That timestamp resolves to the second, while the sequence
 * holds 4096 values per millisecond, so documents sharing a second are spread
 * across the milliseconds within it: enough for 4,096,000 of them before the
 * second is exhausted, and the order always matches `_id`.
 *
 * The cursor walks every document, not only those still missing a uid: the
 * per-second sequence has to advance past documents a previous, interrupted
 * run already assigned, or a resumed run would reuse their timestamp+sequence
 * range and the order guarantee above would break. Only the write is
 * conditional (`properties.uid` absent), so re-running is a no-op past the
 * point an earlier run reached, and two processes starting at once can't
 * clobber each other's uid.
 * @todo Remove once every existing database has been backfilled: at v1.0.0
 * or the move off MongoDB (#821), whichever comes first. A fresh install
 * never needs it.
 * @param {object} collection - MongoDB collection
 * @returns {Promise<number>} Number of documents updated
 */
export const backfillUids = async (collection) => {
  const cursor = collection.find(
    {},
    { projection: { _id: 1 }, sort: { _id: 1 } },
  );

  let second;
  let index = 0;
  let updated = 0;

  for await (const { _id } of cursor) {
    // Indiekit never sets `_id` itself, so only foreign or imported data can
    // land here without an ObjectId. Skip it rather than crash the whole
    // startup sequence over one document that isn't ours to migrate anyway.
    if (typeof _id?.getTimestamp !== "function") {
      console.warn(
        `Skipped adding a uid to ${_id} in ‘${collection.collectionName}’: _id is not an ObjectId`,
      );
      continue;
    }

    const msecs = _id.getTimestamp().getTime();
    index = msecs === second ? index + 1 : 0;
    second = msecs;

    const result = await collection.updateOne(
      { _id, "properties.uid": { $exists: false } },
      {
        $set: {
          "properties.uid": uuidv7At(
            msecs + Math.floor(index / 4096),
            index % 4096,
          ),
        },
      },
    );

    updated += result.modifiedCount;
  }

  return updated;
};
