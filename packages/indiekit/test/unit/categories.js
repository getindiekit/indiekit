import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getCategories } from "../../lib/categories.js";

await mockAgent("indiekit");

describe("indiekit/lib/categories", () => {
  it("Returns array of available categories", async () => {
    const result = await getCategories(undefined, {
      categories: ["Foo", "Bar"],
    });

    assert.deepEqual(result, ["Bar", "Foo"]);
  });

  it("Fetches array from remote JSON file", async () => {
    const result = await getCategories(undefined, {
      categories: "https://website.example/categories.json",
    });

    assert.deepEqual(result, ["Bar", "Foo"]);
  });

  it("Returns empty array if remote JSON file not found", async () => {
    await assert.rejects(
      getCategories(undefined, {
        categories: "https://website.example/404.json",
      }),
      {
        message: "Not Found",
      },
    );
  });

  it("Returns empty array if no publication configuration", async () => {
    const result = await getCategories(undefined, {});

    assert.deepEqual(result, []);
  });
});
