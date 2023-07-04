import test from "ava";
import JekyllPreset from "@indiekit/preset-jekyll";
import {
  getPostTypeConfig,
  randomString,
  renderPath,
  supplant,
} from "../../lib/utils.js";

test("Get post type configuration for a given type", (t) => {
  const { postTypes } = new JekyllPreset();
  const result = getPostTypeConfig("note", postTypes);

  t.is(result.name, "Note");
});

test("Generates random alpha-numeric string, 5 characters long", (t) => {
  t.regex(randomString(), /[\d\w]{5}/g);
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

test("Substitutes variables enclosed in { } braces with data from object", (t) => {
  const string = "{array} {string} {number}";
  const object = {
    array: ["Array"],
    string: "string",
    number: 1,
  };
  const result = supplant(string, object);

  t.is(result, "{array} string 1");
});
