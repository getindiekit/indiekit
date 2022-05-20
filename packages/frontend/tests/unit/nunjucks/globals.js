import test from "ava";
import { icon, pages } from "../../../lib/nunjucks/globals.js";

test("Renders SVG icon", (t) => {
  const result = icon("note");

  t.regex(result, /^<svg class="icon" xmlns="http:\/\/www.w3.org\/2000\/svg"/);
});

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
