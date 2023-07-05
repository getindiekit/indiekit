import test from "ava";
import sinon from "sinon";
import JekyllPreset from "@indiekit/preset-jekyll";
import { postData } from "../../lib/post-data.js";

test.before(() => {
  sinon.stub(console, "info"); // Disable console.info
  sinon.stub(console, "warn"); // Disable console.warn
});

test.beforeEach((t) => {
  t.context = {
    properties: {
      type: "entry",
      published: "2020-07-26T20:10:57.062Z",
      name: "Foo",
      "mp-slug": "foo",
    },
    application: {
      posts: {
        aggregate: () => ({
          toArray: async () => [],
        }),
        count() {
          return 1;
        },
        async findOne(url) {
          if (url["properties.url"] === "https://website.example/foo") {
            return {
              path: "foo",
              properties: {
                type: "entry",
                content: "hello world",
                published: "2019-08-17T23:56:38.977+01:00",
                category: ["foo", "bar"],
                "mp-slug": "baz",
                "mp-syndicate-to": "https://archive.org/",
                "post-type": "note",
                url: url["properties.url"],
              },
            };
          }
        },
        async insertOne() {},
        async replaceOne() {},
      },
    },
    publication: {
      me: "https://website.example",
      postTypes: new JekyllPreset().postTypes,
    },
    url: "https://website.example/foo",
  };
});

test("Creates post data", async (t) => {
  const result = await postData.create(
    t.context.application,
    t.context.publication,
    t.context.properties
  );

  t.is(result.properties["post-type"], "note");
  t.is(result.properties["mp-slug"], "foo");
  t.is(result.properties.type, "entry");
  t.is(result.properties.url, "https://website.example/notes/2020/07/26/foo");
});

test("Throws error creating post data for non-configured post type", async (t) => {
  t.context.publication.postTypes = [];

  await t.throwsAsync(
    postData.create(
      t.context.application,
      t.context.publication,
      t.context.properties
    ),
    { message: "note" }
  );
});

test("Reads post data", async (t) => {
  const result = await postData.read(t.context.application, t.context.url);

  t.is(result.properties["post-type"], "note");
  t.is(result.properties.url, "https://website.example/foo");
});

test("Updates post by adding properties", async (t) => {
  const operation = { add: { syndication: ["http://website.example"] } };
  const result = await postData.update(
    t.context.application,
    t.context.publication,
    t.context.url,
    operation
  );

  t.truthy(result.properties.syndication);
});

test("Updates post by replacing properties", async (t) => {
  const operation = { replace: { content: ["hello moon"] } };
  const result = await postData.update(
    t.context.application,
    t.context.publication,
    t.context.url,
    operation
  );

  t.deepEqual(result.properties.content, {
    html: "<p>hello moon</p>",
    text: "hello moon",
  });
});

test("Updates post by deleting entries", async (t) => {
  const operation = { delete: { category: ["foo"] } };
  const result = await postData.update(
    t.context.application,
    t.context.publication,
    t.context.url,
    operation
  );

  t.deepEqual(result.properties.category, ["bar"]);
});

test("Updates post by deleting properties", async (t) => {
  const operation = { delete: ["category"] };
  const result = await postData.update(
    t.context.application,
    t.context.publication,
    t.context.url,
    operation
  );

  t.falsy(result.properties.category);
});

test("Updates post by adding, deleting and updating properties", async (t) => {
  const operation = {
    replace: {
      content: ["updated content"],
    },
    add: {
      syndication: ["http://website.example"],
    },
    delete: ["mp-syndicate-to"],
  };
  const result = await postData.update(
    t.context.application,
    t.context.publication,
    t.context.url,
    operation
  );

  t.deepEqual(result.properties.content, {
    html: "<p>updated content</p>",
    text: "updated content",
  });
  t.truthy(result.properties.syndication);
  t.falsy(result.properties["mp-syndicate-to"]);
});

test("Throws error updating post data if no record available", async (t) => {
  const operation = { delete: ["category"] };

  await t.throwsAsync(
    postData.update(
      t.context.application,
      t.context.publication,
      "https://website.example/bar",
      operation
    ),
    {
      message: "https://website.example/bar",
    }
  );
});
