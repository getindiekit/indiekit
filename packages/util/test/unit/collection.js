import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it } from "node:test";
import { testDatabase } from "@indiekit-test/database";
import { getCursor } from "../../lib/collection.js";
import { ObjectId } from "mongodb";

describe("util/lib/collection", async () => {
  const { client, database, mongoServer } = await testDatabase();
  let items;

  beforeEach(async () => {
    items = database.collection("items");
    await items.insertMany([{ name: "foo" }, { name: "bar" }, { name: "baz" }]);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
  });

  it("Gets pagination cursor", async () => {
    const result = await getCursor(items, undefined, undefined, 3);
    // baz, bar, foo
    assert.equal(result.items.length, 3);
    assert.equal(ObjectId.isValid(result.firstItem), true);
    assert.equal(ObjectId.isValid(result.lastItem), true);
    assert.equal(result.hasNext, false);
    assert.equal(result.hasPrev, false);
  });

  it("Gets pagination cursor after ID", async () => {
    const after = await items.findOne({ name: "baz" });
    const result = await getCursor(items, after._id);
    // bar, foo
    assert.equal(result.items.length, 2);
    assert.equal(result.hasNext, false);
    assert.equal(result.hasPrev, true);
  });

  it("Gets pagination cursor after and before IDs", async () => {
    const after = await items.findOne({ name: "baz" });
    const before = await items.findOne({ name: "foo" });
    const result = await getCursor(items, after._id, before._id, 1);
    // baz
    assert.equal(result.items.length, 1);
    assert.equal(result.hasNext, true);
    assert.equal(result.hasPrev, false);
  });
});
