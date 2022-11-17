import test from "ava";
import { absoluteUrl, friendlyUrl } from "../../../lib/filters/index.js";

test("Gets absolute URL from path", (t) => {
  t.is(
    absoluteUrl("path1", "https://website.example"),
    "https://website.example/path1"
  );
  t.is(
    absoluteUrl("/path2", "https://website.example"),
    "https://website.example/path2"
  );
  t.is(
    absoluteUrl("https://website.example/path3", "https://website.example"),
    "https://website.example/path3"
  );
});

test("Gets absolute path from path", (t) => {
  t.is(absoluteUrl("path1", "path"), "path/path1");
  t.is(absoluteUrl("/path2", "path/path1"), "path/path1/path2");
});

test("Gets friendly URL", (t) => {
  t.is(friendlyUrl("https://website.example/path"), "website.example/path");
});
