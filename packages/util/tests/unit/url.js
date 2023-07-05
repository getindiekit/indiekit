import test from "ava";
import { getCanonicalUrl, isSameOrigin, isUrl } from "../../lib/url.js";

test("Gets canonical URL", (t) => {
  t.is(getCanonicalUrl("https://website.example"), "https://website.example/");
  t.is(
    getCanonicalUrl("path1", "https://website.example"),
    "https://website.example/path1"
  );
  t.is(
    getCanonicalUrl("/path2", "https://website.example"),
    "https://website.example/path2"
  );
  t.is(
    getCanonicalUrl("https://website.example/path3", "https://website.example"),
    "https://website.example/path3"
  );
  t.is(getCanonicalUrl("path5", "path4"), "path4/path5");
});

test("Checks if parsed URL string has given origin", (t) => {
  t.true(
    isSameOrigin(
      "https://mastodon.example/@username/1234567890987654321",
      "https://mastodon.example"
    )
  );
  t.false(isSameOrigin("https://getindiekit.com", "https://mastodon.example"));
});

test("Checks if given string is a valid URL", (t) => {
  t.true(isUrl("https%3A%2F%2Ffoo.bar"));
  t.true(isUrl("https://foo.bar"));
  t.false(isUrl("foo.bar"));
});

test("Throws error if URL is not a string", (t) => {
  t.throws(
    () => {
      isUrl({});
    },
    {
      instanceOf: TypeError,
      message: "Expected a string",
    }
  );
});
