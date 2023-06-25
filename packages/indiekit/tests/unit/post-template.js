import test from "ava";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { getPostTemplate } from "../../lib/post-template.js";

test("Gets custom post template", (t) => {
  const publication = {
    postTemplate: (properties) => JSON.stringify(properties),
  };
  const postTemplate = getPostTemplate(publication);
  const result = postTemplate({ published: "2021-01-21" });

  t.is(result, '{"published":"2021-01-21"}');
});

test("Gets preset post template", async (t) => {
  const config = await testConfig();
  const indiekit = await Indiekit.initialize({ config });
  const { publication } = await indiekit.bootstrap();
  const postTemplate = getPostTemplate(publication);
  const result = postTemplate({ published: "2021-01-21" });

  t.is(result, "---\ndate: 2021-01-21\n---\n");
});

test("Gets default post template", (t) => {
  const postTemplate = getPostTemplate({});
  const result = postTemplate({ published: "2021-01-21" });

  t.is(result, '{"published":"2021-01-21"}');
});
