import test from "ava";
import { getScopeItems } from "../../lib/scope.js";

test("Gets `items` object for checkboxes component", (t) => {
  const response = {
    locals: { __: (value) => value },
  };
  const result = getScopeItems("create update", response);

  t.is(result.length, 5);
  t.true(result[0].checked);
  t.is(result[0].value, "create");
});
