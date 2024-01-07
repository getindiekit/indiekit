import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { getPostTemplate } from "../../lib/post-template.js";

describe("indiekit/lib/post-templates", () => {
  it("Gets custom post template", () => {
    const publication = {
      postTemplate: (properties) => JSON.stringify(properties),
    };
    const postTemplate = getPostTemplate(publication);
    const result = postTemplate({ published: "2021-01-21" });

    assert.equal(result, '{"published":"2021-01-21"}');
  });

  it("Gets preset post template", async () => {
    const config = await testConfig();
    const indiekit = await Indiekit.initialize({ config });
    const { publication } = await indiekit.bootstrap();
    const postTemplate = getPostTemplate(publication);
    const result = postTemplate({ published: "2021-01-21" });

    assert.equal(result, "---\ndate: 2021-01-21\n---\n");
  });

  it("Gets default post template", () => {
    const postTemplate = getPostTemplate({});
    const result = postTemplate({ published: "2021-01-21" });

    assert.equal(result, '{"published":"2021-01-21"}');
  });
});
