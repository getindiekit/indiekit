import { strict as assert } from "node:assert";
import { after, before, describe, it, mock } from "node:test";

import { testDatabase } from "@indiekit-test/database";

import { backfillUids, uuidv7At } from "../../lib/migrate-uid.js";

// UUIDs sort as strings; a plain `.sort()` would coerce and compare lexically
// by default anyway, but the compare function keeps `unicorn/require-array-sort-compare` happy.
const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

describe("indiekit/lib/migrate-uid", () => {
  it("emits a well-formed UUIDv7 for a given time", () => {
    const msecs = Date.parse("2019-10-01T12:00:00Z");
    const uuid = uuidv7At(msecs, 0);

    assert.match(uuid, /^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/);
    assert.equal(uuid[14], "7", "version nibble is not 7");
    assert.ok("89ab".includes(uuid[19]), "variant bits are not RFC 9562");
    assert.equal(
      Number.parseInt(uuid.replaceAll("-", "").slice(0, 12), 16),
      msecs,
      "timestamp does not round-trip",
    );
  });

  it("orders by sequence within a millisecond, and by millisecond above that", () => {
    const msecs = Date.parse("2019-10-01T12:00:00Z");
    const sequential = Array.from({ length: 4096 }, (_, index) =>
      uuidv7At(msecs, index),
    );

    assert.deepEqual(
      sequential,
      sequential.toSorted(compare),
      "sequence does not order",
    );
    assert.ok(
      uuidv7At(msecs, 4095) < uuidv7At(msecs + 1, 0),
      "a later millisecond does not outrank a higher sequence",
    );
  });

  it("stays unique when time and sequence repeat", () => {
    const msecs = Date.parse("2019-10-01T12:00:00Z");
    const uuids = new Set(
      Array.from({ length: 10_000 }, () => uuidv7At(msecs, 7)),
    );

    assert.equal(uuids.size, 10_000, "random bits are not random");
  });

  describe("backfillUids", () => {
    let client;
    let database;
    let mongoServer;

    before(async () => {
      ({ client, database, mongoServer } = await testDatabase());
    });

    after(async () => {
      await client.close();
      await mongoServer.stop();
    });

    it("gives every document a uid, in _id order, and leaves existing ones alone", async () => {
      const collection = database.collection("backfill-posts");
      // 5000 documents sharing one second: more than the 4096-value sequence
      // holds, which is the case a bulk import produces.
      const documents = Array.from({ length: 5000 }, (_, index) => ({
        properties: { url: `https://website.example/post-${index}` },
      }));
      documents[0].properties.uid = "already-set";
      await collection.insertMany(documents);

      const updated = await backfillUids(collection);
      assert.equal(
        updated,
        4999,
        "did not skip the document that already had a uid",
      );

      const stored = await collection.find({}, { sort: { _id: 1 } }).toArray();
      assert.equal(
        stored[0].properties.uid,
        "already-set",
        "overwrote an existing uid",
      );

      const backfilled = stored.slice(1).map((item) => item.properties.uid);
      assert.ok(backfilled.every(Boolean), "a document was left without a uid");
      assert.deepEqual(
        backfilled,
        backfilled.toSorted(compare),
        "uid order does not match _id order",
      );
    });

    it("does nothing on a collection that needs nothing", async () => {
      const collection = database.collection("backfill-empty");

      assert.equal(await backfillUids(collection), 0);
    });

    it("resumes correctly after a partial run, without restarting the per-second sequence", async () => {
      const collection = database.collection("backfill-resume");
      // 5000 documents sharing one second, so the sequence overflows into a
      // second millisecond partway through, same as the "more than 4096" case.
      const documents = Array.from({ length: 5000 }, (_, index) => ({
        properties: { url: `https://website.example/resume-${index}` },
      }));
      await collection.insertMany(documents);

      // Simulate a completed first boot.
      await backfillUids(collection);

      // Simulate a crash partway through a second boot: strip the uid back
      // off the later half, as if those documents were never reached.
      const stored = await collection.find({}, { sort: { _id: 1 } }).toArray();
      const laterHalf = stored.slice(2500).map((document) => document._id);
      await collection.updateMany(
        { _id: { $in: laterHalf } },
        { $unset: { "properties.uid": "" } },
      );

      // Resume: this must continue the sequence, not restart it at 0 — a
      // restart would reuse the timestamp+sequence range already given to
      // the kept-uid documents, and the final order would stop matching _id.
      const updated = await backfillUids(collection);
      assert.equal(updated, 2500);

      const final = await collection.find({}, { sort: { _id: 1 } }).toArray();
      const uids = final.map((document) => document.properties.uid);
      assert.deepEqual(
        uids,
        uids.toSorted(compare),
        "uid order does not match _id order after resuming",
      );
    });

    it("does not overwrite a uid another process already assigned", async () => {
      const collection = database.collection("backfill-concurrent");
      await collection.insertOne({
        properties: { url: "https://website.example/concurrent" },
      });

      // A second process' run reaching this document first.
      const [existing] = await collection.find({}).toArray();
      await collection.updateOne(
        { _id: existing._id, "properties.uid": { $exists: false } },
        { $set: { "properties.uid": "already-set-by-another-process" } },
      );

      const updated = await backfillUids(collection);
      assert.equal(updated, 0, "overwrote a uid set by a concurrent run");

      const stored = await collection.findOne({ _id: existing._id });
      assert.equal(
        stored.properties.uid,
        "already-set-by-another-process",
        "overwrote a uid set by a concurrent run",
      );
    });

    it("skips a document whose _id is not an ObjectId, instead of crashing", async () => {
      const collection = database.collection("backfill-foreign-id");
      mock.method(console, "warn", () => {});

      await collection.insertMany([
        {
          _id: "foreign-string-id",
          properties: { url: "https://website.example/foreign" },
        },
        { properties: { url: "https://website.example/ordinary" } },
      ]);

      const updated = await backfillUids(collection);
      assert.equal(updated, 1, "did not backfill the ordinary document too");

      const foreign = await collection.findOne({ _id: "foreign-string-id" });
      assert.equal(
        foreign.properties.uid,
        undefined,
        "assigned a uid to a document with a non-ObjectId _id",
      );
    });
  });
});
