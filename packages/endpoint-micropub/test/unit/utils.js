import { strict as assert } from "node:assert";
import { before, describe, it, mock } from "node:test";
import {
  decodeQueryParameter,
  excerptString,
  getPostTemplateProperties,
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
    assert.deepEqual(decodeQueryParameter(["foo", "bar"]), ["foo", "bar"]);
    assert.equal(
      decodeQueryParameter("2024-02-14T13%3A24%3A00%2B0100"),
      "2024-02-14T13:24:00+0100",
    );
    assert.equal(
      decodeQueryParameter("https%3A%2F%2Ffoo.bar"),
      "https://foo.bar",
    );
    assert.equal(decodeQueryParameter("foo+bar"), "foo bar");
  });

  it("Excerpts the first n words from a string", () => {
    const result = excerptString("The quick fox jumped over the lazy fox", 5);

    assert.equal(result, "The quick fox jumped over");
  });

  it("Gets post template properties", () => {
    const result = getPostTemplateProperties({
      name: "foo",
      "mp-destination": "https://website.example",
      "mp-slug": "foo",
    });

    assert.deepEqual(result, {
      name: "foo",
    });
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
