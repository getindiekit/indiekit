import test from "ava";
import { checkScope } from "../../lib/scope.js";

test("Returns true if required scope is provided by token", (t) => {
  t.true(checkScope("create update", "update"));
});

test("Returns true if required scope is `create` but token has `post`", (t) => {
  t.true(checkScope("post", "create"));
});

test("Returns true if required scope is `undelete` but token has `create`", (t) => {
  t.true(checkScope("create", "undelete"));
});

test("Required scope defaults to `create`", (t) => {
  t.true(checkScope("create update", null));
});

test("Requested scope defaults to `create` if none provided by token", (t) => {
  t.true(checkScope(null, "create"));
});

test("Throws error required scope not provided by token", (t) => {
  const error = t.throws(
    () => {
      checkScope("create update", "delete");
    },
    {
      code: "insufficient_scope",
      message: "Insufficient scope",
      name: "InsufficientScopeError",
    }
  );

  t.is(error.status, 403);
  t.is(error.scope, "delete");
});
