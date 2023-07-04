import test from "ava";
import { friendlyUrl, imageUrl } from "../../../lib/filters/index.js";

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
