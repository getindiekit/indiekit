import test from "ava";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { getPostTypes } from "../../lib/post-types.js";

test("Merges values from custom and preset post types", async (t) => {
  const config = await testConfig({
    usePostTypes: true,
    usePreset: true,
  });
  const indiekit = await Indiekit.initialize({ config });
  const { publication } = await indiekit.bootstrap();
  const result = getPostTypes(publication);

  t.is(result[0].name, "Article");
  t.is(result[1].name, "Custom note post type");
});

test("Returns preset post types", async (t) => {
  const config = await testConfig({
    usePostTypes: false,
    usePreset: true,
  });
  const indiekit = await Indiekit.initialize({ config });
  const { publication } = await indiekit.bootstrap();
  const result = getPostTypes(publication);

  t.is(result[0].name, "Article");
  t.is(result[1].name, "Note");
});

test("Returns custom post types", async (t) => {
  const config = await testConfig({
    usePostTypes: true,
    usePreset: false,
  });
  const indiekit = await Indiekit.initialize({ config });
  const { publication } = await indiekit.bootstrap();
  const result = getPostTypes(publication);

  t.is(result[0].name, "Custom note post type");
});

test("Returns array if no preset or custom post types", async (t) => {
  const config = await testConfig({
    usePostTypes: false,
    usePreset: false,
  });
  const indiekit = await Indiekit.initialize({ config });
  const { publication } = await indiekit.bootstrap();

  t.deepEqual(getPostTypes(publication), []);
});
