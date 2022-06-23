import test from "ava";
import { checkScope } from "../../lib/scope.js";

test("Returns true if `create` scope is provided by token", (t) => {
  t.true(checkScope("create"));
});

test("Returns true if `media` scope is provided by token", (t) => {
  t.true(checkScope("media"));
});

test("Returns true if `create media` scope is provided by token", (t) => {
  t.true(checkScope("create media"));
});

test("Required scope defaults to `media`", (t) => {
  t.true(checkScope("media", null));
});

test("Throws error required scope not provided by access token", (t) => {
  const error = t.throws(
    () => {
      checkScope("post");
    },
    {
      code: "insufficient_scope",
      message: "Insufficient scope",
      name: "InsufficientScopeError",
    }
  );

  t.is(error.status, 403);
  t.is(error.scope, "create media");
});
