import test from "ava";
import { summaryRows } from "../../../lib/globals/index.js";

test("Transforms object into array for consumption by summary component", (t) => {
  const result = summaryRows({
    array: ["foo", "bar"],
    boolean: [true],
    object: {
      foo: "bar",
    },
    string: "string",
  });

  t.is(result[0].key.text, "array");
  t.regex(result[0].value.text, /^<pre class="language-js">/);
  t.regex(result[1].value.text, /^<code class="token boolean">/);
  t.regex(result[2].value.text, /^<pre class="language-js">/);
  t.regex(result[3].value.text, /^<code class="token string">/);
});
