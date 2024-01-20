import { strict as assert } from "node:assert";
import { before, describe, it, mock } from "node:test";
import { testConfig } from "@indiekit-test/config";
import { getPostTypeConfig, renderPath } from "../../lib/utils.js";

describe("endpoint-media/lib/util", () => {
  before(() => {
    mock.method(console, "info", () => {});
    mock.method(console, "warn", () => {});
  });

  it("Get post type configuration for a given type", async () => {
    const { publication } = await testConfig({ usePostTypes: true });
    const result = getPostTypeConfig("note", publication.postTypes);

    assert.equal(result.name, "Custom note post type");
  });

  it("Renders path from URI template and properties", async () => {
    const template = "{yyyy}/{MM}/{uuid}/{slug}";
    const properties = {
      published: "2020-01-01",
      "mp-slug": "foo",
    };
    const application = {};
    const result = await renderPath(template, properties, application);

    assert.match(
      result,
      /\d{4}\/\d{2}\/[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}\/foo/,
    );
  });
});
