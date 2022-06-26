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
