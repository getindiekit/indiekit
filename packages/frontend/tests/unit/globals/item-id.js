import test from "ava";
import { itemId } from "../../../lib/globals/item-id.js";

test("Gets item `id` for radio/checkbox", (t) => {
  const defined = itemId("test", "prefix", { first: true, index: 0 });
  const first = itemId(undefined, "prefix", { first: true, index: 0 });
  const other = itemId(undefined, "prefix", { first: false, index: 2 });

  t.is(defined, "test");
  t.is(first, "prefix");
  t.is(other, "prefix-2");
});
