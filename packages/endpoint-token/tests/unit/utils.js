import test from "ava";
import { getCanonicalUrl } from "../../lib/utils.js";

test("Canonicalises URL", (t) => {
  t.is(getCanonicalUrl("https://foo.bar"), "https://foo.bar/");
});
