import test from "ava";
import {
  absoluteUrl,
  friendlyUrl,
  imageUrl,
} from "../../../lib/filters/index.js";

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

test("Gets transformed image URL", (t) => {
  const application = {
    imageEndpoint: "/image",
    url: "https://server.example",
  };
  const result = imageUrl("/path/to/image.jpg", application);
  t.is(
    result,
    "https://server.example/image/path/to/image.jpg?w=240&h=240&c=true"
  );
});
