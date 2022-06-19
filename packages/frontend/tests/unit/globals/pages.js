import test from "ava";
import { pages } from "../../../lib/globals/index.js";

test("Generates pagination data", (t) => {
  const result = pages(2, 5, 15);

  t.deepEqual(result.items[1], {
    current: true,
    href: "?page=2&limit=5",
    text: 2,
  });
  t.is(result.next.href, "?page=3&limit=5");
  t.is(result.previous.href, "?page=1&limit=5");
  t.deepEqual(result.results, {
    count: 15,
    from: 6,
    to: 10,
  });
});
