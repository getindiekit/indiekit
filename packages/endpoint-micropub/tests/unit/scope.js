import test from "ava";
import { checkScope } from "../../lib/scope.js";

test("Action defaults to `create`", (t) => {
  t.true(checkScope("create update"));
});

test("Scope defaults to `create`", (t) => {
  t.true(checkScope(undefined, "create"));
});

test("Returns true if action is permitted by scope", (t) => {
  t.true(checkScope("create update", "update"));
});

test("Returns true if `create` action but scope is `post`", (t) => {
  t.true(checkScope("post", "create"));
});

test("Returns true if `create` action but scope includes `post`", (t) => {
  t.true(checkScope("post delete", "create"));
});

test("Returns true if `undelete` action but scope is `create`", (t) => {
  t.true(checkScope("create", "undelete"));
});

test("Returns `draft` if `create` action but scope includes `draft`", (t) => {
  t.is(checkScope("create draft update", "create"), "draft");
});

test("Returns `draft` if `undelete` action but scope is `draft`", (t) => {
  t.is(checkScope("draft", "undelete"), "draft");
});

test("Returns false if action not permitted by scope", (t) => {
  t.false(checkScope("create update", "delete"));
});
