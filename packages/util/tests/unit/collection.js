import test from "ava";
import { testDatabase } from "@indiekit-test/database";
import { getCursor } from "../../lib/collection.js";
import { ObjectId } from "mongodb";

test.before(async (t) => {
  const items = await testDatabase("items");
  items.insertMany([{ name: "foo" }, { name: "bar" }, { name: "baz" }]);
  items.count();
  t.context.items = items;
});

test.serial("Gets pagination cursor", async (t) => {
  const result = await getCursor(t.context.items, false, false, 3);

  // baz, bar, foo
  t.is(result.items.length, 3);
  t.true(result.firstItem instanceof ObjectId);
  t.true(result.lastItem instanceof ObjectId);
  t.false(result.hasNext);
  t.false(result.hasPrev);
});

test.serial("Gets pagination cursor after ID", async (t) => {
  const after = await t.context.items.findOne({ name: "baz" });
  const result = await getCursor(t.context.items, after._id);

  // bar, foo
  t.is(result.items.length, 2);
  t.false(result.hasNext);
  t.true(result.hasPrev);
});

test.serial("Gets pagination cursor after and before IDs", async (t) => {
  const after = await t.context.items.findOne({ name: "baz" });
  const before = await t.context.items.findOne({ name: "foo" });
  const result = await getCursor(t.context.items, after._id, before._id, 1);

  // baz
  t.is(result.items.length, 1);
  t.true(result.hasNext);
  t.false(result.hasPrev);
});
