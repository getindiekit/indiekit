import { strict as assert } from "node:assert";
import { before, describe, it, mock } from "node:test";
import JekyllPreset from "@indiekit/preset-jekyll";
import {
  decodeQueryParameter,
  excerptString,
  getPostTypeConfig,
  relativeMediaPath,
  renderPath,
  toArray,
} from "../../lib/utils.js";

describe("endpoint-media/lib/utils", () => {
  before(() => {
    mock.method(console, "info", () => {});
    mock.method(console, "warn", () => {});
  });

  it("Decodes form-encoded query parameter", () => {
    const result = decodeQueryParameter("https%3A%2F%2Ffoo.bar");

    assert.equal(result, "https://foo.bar");
  });

  it("Excerpts the first n words from a string", () => {
    const result = excerptString("The quick fox jumped over the lazy fox", 5);

    assert.equal(result, "The quick fox jumped over");
  });

  it("Get post type configuration for a given type", () => {
    const { postTypes } = new JekyllPreset();
    const result = getPostTypeConfig("note", postTypes);

    assert.equal(result.name, "Note");
  });

  it("Renders relative path if at publication URL", () => {
    const result = relativeMediaPath("http://foo.bar/media/", "http://foo.bar");

    assert.equal(result, "/media/");
  });

  it("Renders relative path if at publication URL which has a path", () => {
    const result = relativeMediaPath(
      "http://foo.bar/baz/media/",
      "http://foo.bar/baz/",
    );

    assert.equal(result, "media/");
  });

  it("Renders path from URI template and properties", async () => {
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

    assert.match(
      result,
      /\d{4}\/\d{2}\/[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}\/foo/,
    );
  });

  it("Convert string to array if not already an array", () => {
    assert.deepEqual(toArray(["string"]), ["string"]);
    assert.deepEqual(toArray("string"), ["string"]);
  });
});
