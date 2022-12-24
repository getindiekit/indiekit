import test from "ava";
import { attributes } from "../../../lib/globals/index.js";

test("Generates space-separated list of HTML attribute key values", (t) => {
  const result = attributes({
    id: "foo",
    "data-value": "bar",
    readonly: true,
  });

  t.is(result, ' id="foo" data-value="bar" readonly');
});
