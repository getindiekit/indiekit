import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";

import { getCursor } from "../../lib/mongodb.js";
import { sqliteCollection } from "../../lib/sqlite.js";

// The spike's question: does code written against the collection interface
// run unchanged over SQLite? `getCursor` is imported from mongodb.js and is
// not modified here — only the collection it is handed differs.
describe("util/lib/sqlite — spike for #821", () => {
  let collection;

  beforeEach(async () => {
    collection = sqliteCollection();
    for (const name of ["one", "two", "three", "four", "five"]) {
      await collection.insertOne({ name });
    }
  });

  it("Stores and retrieves a document", async () => {
    const item = await collection.findOne({ name: "three" });

    assert.equal(item.name, "three");
    assert.ok(item._id);
  });

  it("Counts with an operator query", async () => {
    assert.equal(await collection.countDocuments({}), 5);
    assert.equal(await collection.countDocuments({ _id: { $lt: 3 } }), 2);
  });

  it("Deletes", async () => {
    assert.deepEqual(await collection.deleteOne({ name: "one" }), {
      deletedCount: 1,
    });
    assert.equal(await collection.countDocuments({}), 4);
  });

  it("Runs unmodified getCursor: first page, newest first", async () => {
    const cursor = await getCursor(collection, undefined, undefined, 2);

    assert.deepEqual(
      cursor.items.map((item) => item.name),
      ["five", "four"],
    );
    assert.equal(cursor.hasNext, true, "more items exist below");
    assert.equal(cursor.hasPrev, false, "nothing newer than the first page");
  });

  it("Runs unmodified getCursor: paging forward with `after`", async () => {
    const first = await getCursor(collection, undefined, undefined, 2);
    // `?after=` delivers a string, never the id's native type.
    const second = await getCursor(
      collection,
      String(first.lastItem),
      undefined,
      2,
    );

    assert.deepEqual(
      second.items.map((item) => item.name),
      ["three", "two"],
    );
    assert.equal(second.hasPrev, true);
  });

  it("Runs unmodified getCursor: paging back with `before`", async () => {
    const first = await getCursor(collection, undefined, undefined, 2);
    const second = await getCursor(collection, first.lastItem, undefined, 2);
    const back = await getCursor(
      collection,
      undefined,
      String(second.firstItem),
      2,
    );

    assert.deepEqual(
      back.items.map((item) => item.name),
      ["five", "four"],
      "returns to the first page",
    );
  });

  // Indiekit writes posts with `replaceOne`, never with update operators.
  it("Replaces a matching document in place, keeping its id", async () => {
    const target = await collection.findOne({ name: "three" });

    const result = await collection.replaceOne(
      { name: "three" },
      { name: "three", edited: true },
    );
    const updated = await collection.findOne({ name: "three" });

    assert.equal(result.matchedCount, 1);
    assert.equal(updated._id, target._id, "id survives the replacement");
    assert.equal(updated.edited, true);
    assert.equal(await collection.countDocuments({}), 5, "no extra row");
  });

  it("Inserts on replaceOne only when asked to upsert", async () => {
    const without = await collection.replaceOne(
      { name: "absent" },
      {
        name: "absent",
      },
    );
    assert.equal(without.matchedCount, 0);
    assert.equal(await collection.countDocuments({}), 5, "nothing inserted");

    const with_ = await collection.replaceOne(
      { name: "absent" },
      { name: "absent" },
      { upsert: true },
    );
    assert.equal(with_.upsertedCount, 1);
    assert.equal(await collection.countDocuments({}), 6);
  });

  it("Runs unmodified getCursor: empty collection", async () => {
    const cursor = await getCursor(sqliteCollection(), undefined, undefined, 2);

    assert.deepEqual(cursor.items, []);
    assert.equal(cursor.hasNext, false);
    assert.equal(cursor.hasPrev, false);
  });
});
