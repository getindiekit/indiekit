import test from "ava";
import { queryList } from "../../lib/query.js";

test.beforeEach((t) => {
  t.context.list = ["blog", "indieweb", "microblog", "web", "website"];
});

test("Filters a list", (t) => {
  const result = queryList(t.context.list, { filter: "web" });

  t.deepEqual(result, ["indieweb", "web", "website"]);
});

test("Limits a list", (t) => {
  const result = queryList(t.context.list, { limit: 1 });

  t.deepEqual(result, ["blog"]);
});

test("Limits a list with an offset", (t) => {
  const result = queryList(t.context.list, { limit: 1, offset: 2 });

  t.deepEqual(result, ["microblog"]);
});

test("Filters and limits a list", (t) => {
  const result = queryList(t.context.list, { filter: "web", limit: 1 });

  t.deepEqual(result, ["indieweb"]);
});

test("Filters and limits a list with an offset", (t) => {
  const result = queryList(t.context.list, {
    filter: "web",
    limit: 1,
    offset: 2,
  });

  t.deepEqual(result, ["website"]);
});
