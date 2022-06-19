import test from "ava";
import { summaryRows } from "../../../lib/globals/index.js";

test("Transforms object into array for consumption by summary component", (t) => {
  const result = summaryRows({
    me: "https://website.example",
  });

  t.is(result[0].key.text, "me");
  t.is(result[0].value.text, "https://website.example");
});
