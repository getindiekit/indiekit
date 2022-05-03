import test from "ava";
import { JekyllPreset } from "@indiekit/preset-jekyll";
import { postData } from "../../lib/post-data.js";

test.beforeEach((t) => {
  t.context = {
    properties: {
      type: "entry",
      published: "2020-07-26T20:10:57.062Z",
      name: "Foo",
      "mp-slug": "foo",
    },
    publication: {
      me: "https://website.example",
      postTypes: new JekyllPreset().postTypes,
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
                url,
              },
            };
          }
        },
      },
    },
    url: "https://website.example/foo",
  };
});

test("Creates post data", async (t) => {
  const result = await postData.create(
    t.context.publication,
    t.context.properties
  );

  t.is(result.properties["post-type"], "note");
  t.is(result.properties["mp-slug"], "foo");
  t.is(result.properties.type, "entry");
  t.is(result.properties.url, "https://website.example/notes/2020/07/26/foo");
});

test("Throws error creating post data without publication configuration", async (t) => {
  await t.throwsAsync(postData.create(false, t.context.properties), {
    message: "No publication configuration provided",
  });
});

test("Throws error creating post data without properties", async (t) => {
  await t.throwsAsync(postData.create(t.context.publication, false), {
    message: "No properties included in request",
  });
});

test("Throws error creating post data for non-configured post type", async (t) => {
  t.context.publication.postTypes = [];

  await t.throwsAsync(
    postData.create(t.context.publication, t.context.properties),
    {
      message:
        "No configuration found for note post type. See https://getindiekit.com/customisation/post-types/",
    }
  );
});

test("Reads post data", async (t) => {
  const result = await postData.read(t.context.publication, t.context.url);

  t.is(result.properties["post-type"], "note");
});

test("Throws error reading post data without publication configuration", async (t) => {
  await t.throwsAsync(postData.read(false, t.context.url), {
    message: "No publication configuration provided",
  });
});

test("Throws error reading post data without URL", async (t) => {
  await t.throwsAsync(postData.read(t.context.publication, false), {
    message: "No URL provided",
  });
});

test("Updates post by adding properties", async (t) => {
  const operation = { add: { syndication: ["http://website.example"] } };

  const result = await postData.update(
    t.context.publication,
    t.context.url,
    operation
  );

  t.truthy(result.properties.syndication);
});

test("Updates post by replacing properties", async (t) => {
  const operation = { replace: { content: ["hello moon"] } };

  const result = await postData.update(
    t.context.publication,
    t.context.url,
    operation
  );

  t.is(result.properties.content, "hello moon");
});

test("Updates post by deleting entries", async (t) => {
  const operation = { delete: { category: ["foo"] } };

  const result = await postData.update(
    t.context.publication,
    t.context.url,
    operation
  );

  t.deepEqual(result.properties.category, ["bar"]);
});

test("Updates post by deleting properties", async (t) => {
  const operation = { delete: ["category"] };

  const result = await postData.update(
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
    t.context.publication,
    t.context.url,
    operation
  );

  t.is(result.properties.content, "updated content");
  t.truthy(result.properties.syndication);
  t.falsy(result.properties["mp-syndicate-to"]);
});

test("Throws error updating post data without publication configuration", async (t) => {
  const operation = { delete: ["category"] };

  await t.throwsAsync(postData.update(false, t.context.url, operation), {
    message: "No publication configuration provided",
  });
});

test("Throws error updating post data without URL", async (t) => {
  const operation = { delete: ["category"] };

  await t.throwsAsync(
    postData.update(t.context.publication, false, operation),
    {
      message: "No URL provided",
    }
  );
});

test("Throws error updating post data without operation", async (t) => {
  await t.throwsAsync(
    postData.update(t.context.publication, t.context.url, false),
    {
      message: "No update operation provided",
    }
  );
});

test("Throws error updating post data if no record available", async (t) => {
  const operation = { delete: ["category"] };

  await t.throwsAsync(
    postData.update(
      t.context.publication,
      "https://website.example/bar",
      operation
    ),
    {
      message: "No post record available for https://website.example/bar",
    }
  );
});
