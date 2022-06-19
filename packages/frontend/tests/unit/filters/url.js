import test from "ava";
import { absoluteUrl } from "../../../lib/filters/url.js";

test("Gets absolute URL from path", (t) => {
  const result1 = absoluteUrl("path1", "https://website.example");
  const result2 = absoluteUrl("/path2", "https://website.example");
  const result3 = absoluteUrl(
    "https://website.example/path3",
    "https://website.example"
  );

  t.is(result1, "https://website.example/path1");
  t.is(result2, "https://website.example/path2");
  t.is(result3, "https://website.example/path3");
});
