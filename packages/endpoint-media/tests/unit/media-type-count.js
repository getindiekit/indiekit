import test from "ava";
import sinon from "sinon";
import JekyllPreset from "@indiekit/preset-jekyll";
import { mediaTypeCount } from "../../lib/media-type-count.js";

test.before(() => {
  sinon.stub(console, "info"); // Disable console.info
  sinon.stub(console, "warn"); // Disable console.warn
});

test.beforeEach((t) => {
  t.context = {
    properties: {
      type: "entry",
      published: new Date(),
      name: "Bar",
      "mp-slug": "bar",
      "post-type": "note",
    },
    application: {
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

test("Counts the number of media of a given type", async (t) => {
  const result = await mediaTypeCount.get(
    t.context.application,
    t.context.properties
  );

  t.is(result, 1);
});
