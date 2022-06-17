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
      name: "ForbiddenError",
      message:
        "The scope of this token does not meet the requirements for this request",
    }
  );

  t.is(error.code, "insufficient_scope");
  t.is(error.scope, "delete");
});
