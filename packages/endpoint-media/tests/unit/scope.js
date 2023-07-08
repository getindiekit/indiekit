import test from "ava";
import { checkScope } from "../../lib/scope.js";

test("Action defaults to `media`", (t) => {
  t.true(checkScope("media"));
});

test("Scope defaults to `create`", (t) => {
  t.true(checkScope(undefined, "create"));
});

test("Returns true if action is permitted by scope", (t) => {
  t.true(checkScope("media", "media"));
  t.true(checkScope("create", "media"));
  t.true(checkScope("delete", "delete"));
});

test("Returns false if action not permitted by scope", (t) => {
  t.false(checkScope("create media", "delete"));
});
