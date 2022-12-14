import test from "ava";
import { summaryRows } from "../../../lib/globals/index.js";

test("Transforms object into array for consumption by summary component", (t) => {
  const result = summaryRows({
    me: "https://website.example",
    categories: ["foo", "bar"],
  });

  t.is(result[0].key.text, "me");
  t.regex(result[0].value.text, /^<code class="token string">/);
  t.regex(result[1].value.text, /^<pre class="language-js">/);
});
