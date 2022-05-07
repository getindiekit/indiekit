import test from "ava";
import { JekyllPreset } from "@indiekit/preset-jekyll";
import { postTypeCount } from "../../lib/post-type-count.js";

test.beforeEach((t) => {
  t.context = {
    properties: {
      type: "entry",
      published: new Date(),
      name: "Bar",
      "mp-slug": "bar",
      "post-type": "note",
    },
    publication: {
      me: "https://website.example",
      postTypes: new JekyllPreset().postTypes,
      posts: {
        aggregate: () => ({
          toArray: async () => [
            {
              type: "entry",
              published: new Date(),
              name: "Foo",
              "mp-slug": "foo",
              "post-type": "note",
            },
          ],
        }),
        count() {
          return 1;
        },
      },
    },
    url: "https://website.example/foo",
  };
});

test("Counts the number of posts of a given type", async (t) => {
  const result = await postTypeCount.get(
    t.context.publication,
    t.context.properties
  );

  t.is(result, 1);
});

test("Throws error getting post count without publication configuration", async (t) => {
  await t.throwsAsync(postTypeCount.get(false, t.context.properties), {
    message: "No publication configuration provided",
  });
});

test("Throws error getting post count without properties", async (t) => {
  await t.throwsAsync(postTypeCount.get(t.context.publication, false), {
    message: "No properties included in request",
  });
});
