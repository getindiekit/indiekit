import test from "ava";
import { fieldData } from "../../../lib/globals/index.js";

test("Gets field data", (t) => {
  const result = fieldData.call(
    {
      ctx: {
        data: { foo: "foo" },
      },
    },
    "foo",
  );

  t.falsy(result.errorMessage);
  t.is(result.value, "foo");
});

test("Gets field data with errors", (t) => {
  const result = fieldData.call(
    {
      ctx: {
        data: { foo: "foo" },
        errors: { foo: { value: "bar", msg: "Enter a foo" } },
      },
    },
    "foo",
  );

  t.deepEqual(result.errorMessage, { text: "Enter a foo" });
  t.is(result.value, "bar");
});
