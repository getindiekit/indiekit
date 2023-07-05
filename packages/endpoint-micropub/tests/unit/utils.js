import test from "ava";
import sinon from "sinon";
import JekyllPreset from "@indiekit/preset-jekyll";
import {
  decodeQueryParameter,
  excerptString,
  getPostTypeConfig,
  relativeMediaPath,
  renderPath,
  toArray,
} from "../../lib/utils.js";

test.before(() => {
  sinon.stub(console, "info"); // Disable console.info
  sinon.stub(console, "warn"); // Disable console.warn
});

test("Decodes form-encoded query parameter", (t) => {
  const result = decodeQueryParameter("https%3A%2F%2Ffoo.bar");

  t.is(result, "https://foo.bar");
});

test("Excerpts the first n words from a string", (t) => {
  const result = excerptString("The quick fox jumped over the lazy fox", 5);

  t.is(result, "The quick fox jumped over");
});

test("Get post type configuration for a given type", (t) => {
  const { postTypes } = new JekyllPreset();
  const result = getPostTypeConfig("note", postTypes);

  t.is(result.name, "Note");
});

test("Renders relative path if at publication URL", (t) => {
  const result = relativeMediaPath("http://foo.bar/media/", "http://foo.bar");

  t.is(result, "/media/");
});

test("Renders relative path if at publication URL which has a path", (t) => {
  const result = relativeMediaPath(
    "http://foo.bar/baz/media/",
    "http://foo.bar/baz/"
  );

  t.is(result, "media/");
});

test("Renders path from URI template and properties", async (t) => {
  const template = "{yyyy}/{MM}/{uuid}/{slug}";
  const properties = {
    published: "2020-01-01",
    "mp-slug": "foo",
  };
  const application = {
    posts: {
      aggregate: () => ({
        toArray: async () => [],
      }),
      count() {
        return 1;
      },
      path: "foo",
      properties: {
        type: "entry",
        published: "2019-08-17T23:56:38.977+01:00",
        "post-type": "note",
      },
    },
  };
  const result = await renderPath(template, properties, application);

  t.regex(
    result,
    /\d{4}\/\d{2}\/[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}\/foo/
  );
});

test("Convert string to array if not already an array", (t) => {
  t.deepEqual(toArray(["string"]), ["string"]);
  t.deepEqual(toArray("string"), ["string"]);
});
