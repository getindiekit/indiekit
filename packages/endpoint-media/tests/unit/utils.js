import test from "ava";
import sinon from "sinon";
import JekyllPreset from "@indiekit/preset-jekyll";
import { getPostTypeConfig, renderPath } from "../../lib/utils.js";

test.before(() => {
  sinon.stub(console, "info"); // Disable console.info
  sinon.stub(console, "warn"); // Disable console.warn
});

test("Get post type configuration for a given type", (t) => {
  const { postTypes } = new JekyllPreset();
  const result = getPostTypeConfig("note", postTypes);

  t.is(result.name, "Note");
});

test("Renders path from URI template and properties", async (t) => {
  const template = "{yyyy}/{MM}/{uuid}/{slug}";
  const properties = {
    published: "2020-01-01",
    "mp-slug": "foo",
  };
  const application = {};
  const result = await renderPath(template, properties, application);

  t.regex(
    result,
    /\d{4}\/\d{2}\/[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}\/foo/
  );
});
