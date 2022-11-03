import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import {
  getCategories,
  getEndpoints,
  getPostTemplate,
  getPostTypes,
} from "../../lib/publication.js";

await mockAgent("website");

test.beforeEach(async (t) => {
  const config = await testConfig();
  const indiekit = new Indiekit({ config });
  const { publication } = await indiekit.bootstrap();

  t.context = {
    application: {
      mediaEndpoint: "/media",
      tokenEndpoint: "/token",
      url: "https://server.example",
    },
    publication,
  };
});

test("Returns array of available categories", async (t) => {
  const result = await getCategories(undefined, {
    categories: ["Foo", "Bar"],
  });

  t.deepEqual(result, ["Foo", "Bar"]);
});

test("Fetches array from remote JSON file", async (t) => {
  const result = await getCategories(undefined, {
    categories: "https://website.example/categories.json",
  });

  t.deepEqual(result, ["Foo", "Bar"]);
});

test("Returns empty array if remote JSON file not found", async (t) => {
  await t.throwsAsync(
    getCategories(undefined, {
      categories: "https://website.example/404.json",
    }),
    {
      message: "Not Found",
    }
  );
});

test("Returns empty array if no publication configuration", async (t) => {
  const result = await getCategories(undefined, {});

  t.deepEqual(result, []);
});

test("Gets endpoints from server derived values", (t) => {
  const result = getEndpoints(t.context, {
    headers: { host: "server.example" },
    protocol: "https",
  });

  t.is(result.mediaEndpoint, "https://server.example/media");
  t.is(result.tokenEndpoint, "https://server.example/token");
});

test("Gets endpoints from publication configuration", (t) => {
  t.context.publication.mediaEndpoint = "https://website.example/media";
  const result = getEndpoints(t.context, {
    headers: { host: "server.example" },
    protocol: "https",
  });

  t.is(result.mediaEndpoint, "https://website.example/media");
  t.is(result.tokenEndpoint, "https://server.example/token");
});

test("Gets custom post template", (t) => {
  const publication = {
    postTemplate: (properties) => JSON.stringify(properties),
  };
  const postTemplate = getPostTemplate(publication);

  const result = postTemplate({ published: "2021-01-21" });

  t.is(result, '{"published":"2021-01-21"}');
});

test("Gets preset post template", (t) => {
  const postTemplate = getPostTemplate(t.context.publication);

  const result = postTemplate({ published: "2021-01-21" });

  t.is(result, "---\ndate: 2021-01-21\n---\n");
});

test("Gets default post template", (t) => {
  const postTemplate = getPostTemplate({});

  const result = postTemplate({ published: "2021-01-21" });

  t.is(result, '{"published":"2021-01-21"}');
});

test("Merges values from custom and preset post types", async (t) => {
  const config = await testConfig({
    usePostTypes: true,
    usePreset: true,
  });
  const indiekit = new Indiekit({ config });
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
  const indiekit = new Indiekit({ config });
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
  const indiekit = new Indiekit({ config });
  const { publication } = await indiekit.bootstrap();

  const result = getPostTypes(publication);

  t.is(result[0].name, "Custom note post type");
});

test("Returns array if no preset or custom post types", async (t) => {
  const config = await testConfig({
    usePostTypes: false,
    usePreset: false,
  });
  const indiekit = new Indiekit({ config });
  const { publication } = await indiekit.bootstrap();

  t.deepEqual(getPostTypes(publication), []);
});
