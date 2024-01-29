import { strict as assert } from "node:assert";
import { before, describe, it, mock } from "node:test";
import { renderPath } from "../../lib/utils.js";

describe("endpoint-media/lib/util", () => {
  before(() => {
    mock.method(console, "info", () => {});
    mock.method(console, "warn", () => {});
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
