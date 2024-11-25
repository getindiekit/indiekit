import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { getCategories } from "../../lib/categories.js";

await mockAgent("indiekit");

describe("indiekit/lib/categories", async () => {
  it("Returns array of available categories", async () => {
    const config = await testConfig({
      publication: { categories: ["Foo", "Bar"] },
    });
    const indiekit = await Indiekit.initialize({ config });
    const result = await getCategories(indiekit);

    assert.deepEqual(result, ["Bar", "Foo"]);
  });

  it("Fetches array from remote JSON file", async () => {
    const config = await testConfig({
      publication: { categories: "https://website.example/categories.json" },
    });
    const indiekit = await Indiekit.initialize({ config });
    const result = await getCategories(indiekit);

    assert.deepEqual(result, ["Bar", "Foo"]);
  });

  it("Returns empty array if remote JSON file not found", async () => {
    mock.method(console, "error", () => {});

    const config = await testConfig({
      publication: { categories: "https://website.example/404.json" },
    });
    const indiekit = await Indiekit.initialize({ config });
    const result = await getCategories(indiekit);

    assert.deepEqual(result, []);
  });

  it("Returns empty array if remote JSON file not reachable", async () => {
    const config = await testConfig({
      publication: { categories: "https://foo.bar/categories.json" },
    });
    const indiekit = await Indiekit.initialize({ config });
    const result = await getCategories(indiekit);

    assert.deepEqual(result, []);
  });

  it("Returns empty array if no publication configuration", async () => {
    const config = await testConfig();
    const indiekit = await Indiekit.initialize({ config });
    const result = await getCategories(indiekit);

    assert.deepEqual(result, []);
  });
});
