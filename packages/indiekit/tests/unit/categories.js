import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getCategories } from "../../lib/categories.js";

await mockAgent("indiekit");

test("Returns array of available categories", async (t) => {
  const result = await getCategories(undefined, {
    categories: ["Foo", "Bar"],
  });

  t.deepEqual(result, ["Bar", "Foo"]);
});

test("Fetches array from remote JSON file", async (t) => {
  const result = await getCategories(undefined, {
    categories: "https://website.example/categories.json",
  });

  t.deepEqual(result, ["Bar", "Foo"]);
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
