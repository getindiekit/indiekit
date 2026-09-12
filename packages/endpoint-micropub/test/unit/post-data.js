import { strict as assert } from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";

import { testConfig } from "@indiekit-test/config";
import { testDatabase } from "@indiekit-test/database";

import { postData } from "../../lib/post-data.js";

describe("endpoint-micropub/lib/post-data", async () => {
  let application;
  let publication;
  const { client, database, mongoServer } = await testDatabase();
  const properties = {
    type: "entry",
    published: "2020-07-26T20:10:57.062Z",
    content: "Foo",
    category: ["foo", "bar"],
    "mp-slug": "foo",
  };
  const url = "https://website.example/notes/foo/";

  before(() => {
    mock.method(console, "info", () => {});
    mock.method(console, "warn", () => {});
  });

  beforeEach(async () => {
    const postsCollection = database.collection("posts");
    const config = await testConfig();
    const collections = new Map([["posts", postsCollection]]);

    application = { collections };
    publication = config.publication;
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
  });

  it("Creates post data", async () => {
    const result = await postData.create(application, publication, properties);

    assert.equal(result.properties["post-type"], "note");
    assert.equal(result.properties.slug, "foo");
    assert.equal(result.properties.type, "entry");
    assert.equal(result.properties.url, url);
  });

  it("Throws error creating post data for non-configured post type", async () => {
    publication.postTypes = {};

    await assert.rejects(
      postData.create(application, publication, properties),
      {
        message: "note",
      },
    );
  });

  it("Reads post data", async () => {
    const result = await postData.read(application, url);

    assert.equal(result.properties["post-type"], "note");
    assert.equal(result.properties.url, url);
  });

  it("Throws reading post data without a database", async () => {
    await assert.rejects(
      postData.read({ ...application, collections: undefined }, url),
      { cause: "database", message: "database" },
    );
  });

  it("Updates post by adding properties", async () => {
    const operation = { add: { syndication: ["https://website.example"] } };
    const result = await postData.update(
      application,
      publication,
      url,
      operation,
    );

    assert.ok(result.properties.syndication);
  });

  it("Doesn’t update post if no changes", async () => {
    const operation = { replace: { content: ["Foo"] } };
    const result = await postData.update(
      application,
      publication,
      url,
      operation,
    );

    assert.equal(result, undefined);
  });

  it("Updates post by replacing properties", async () => {
    const operation = { replace: { content: ["hello moon"] } };
    const result = await postData.update(
      application,
      publication,
      url,
      operation,
    );

    assert.deepEqual(result.properties.content, {
      html: "<p>hello moon</p>",
      text: "hello moon",
    });
  });

  it("Updates post by deleting entries", async () => {
    const operation = { delete: { category: ["foo"] } };
    const result = await postData.update(
      application,
      publication,
      url,
      operation,
    );

    assert.deepEqual(result.properties.category, ["bar"]);
  });

  it("Updates post by deleting properties", async () => {
    const operation = { delete: ["category"] };
    const result = await postData.update(
      application,
      publication,
      url,
      operation,
    );

    assert.equal(result.properties.category, undefined);
  });

  it("Updates post by adding, deleting and updating properties", async () => {
    const operation = {
      replace: {
        content: ["updated content"],
      },
      add: {
        syndication: ["https://website.example"],
      },
      delete: ["mp-syndicate-to"],
    };
    const result = await postData.update(
      application,
      publication,
      url,
      operation,
    );

    assert.deepEqual(result.properties.content, {
      html: "<p>updated content</p>",
      text: "updated content",
    });
    assert.ok(result.properties.syndication);
    assert.equal(result.properties["mp-syndicate-to"], undefined);
  });

  it("Throws error updating post data if no record available", async () => {
    const operation = { delete: ["category"] };

    await assert.rejects(
      postData.update(
        application,
        publication,
        "https://website.example/bar",
        operation,
      ),
      {
        message: "https://website.example/bar",
      },
    );
  });

  it("stores a UUIDv7 uid, and keeps it when replacing the same URL", async () => {
    const created = await postData.create(application, publication, {
      ...structuredClone(properties),
    });

    assert.match(created.properties.uid, /^[\da-f]{8}-[\da-f]{4}-7/);

    const again = await postData.create(application, publication, {
      ...structuredClone(properties),
      content: "Replaced",
    });

    assert.equal(
      again.properties.uid,
      created.properties.uid,
      "uid rotated when a post at the same URL was replaced",
    );
  });

  it("ignores a uid supplied by the client", async () => {
    const created = await postData.create(application, publication, {
      ...structuredClone(properties),
      uid: "supplied-by-the-client",
    });

    assert.notEqual(created.properties.uid, "supplied-by-the-client");
  });

  it("doesn’t let a client-supplied uid skew the post-type count used in the path", async () => {
    const postsCollection = database.collection("posts");
    const skewPublication = structuredClone(publication);
    skewPublication.postTypes.note.post.path =
      "src/content/notes/{n}-{slug}.md";

    // An existing post, published the same day as the one we're about to
    // create, that a client could quote back as its own `uid`.
    const existingUid = "0191f6e0-aaaa-7abc-8def-0123456789ab";
    await postsCollection.insertOne({
      properties: {
        type: "entry",
        "post-type": "note",
        published: "2024-05-01T10:00:00.000Z",
        url: "https://website.example/notes/other/",
        uid: existingUid,
      },
    });

    const result = await postData.create(application, skewPublication, {
      type: "entry",
      published: "2024-05-01T12:00:00.000Z",
      content: "Foo",
      "mp-slug": "skewed",
      uid: existingUid,
    });

    // If the client-supplied `uid` reached `postTypeCount.get()`, it
    // would `$ne`-exclude the existing post above from today's count,
    // making this the 1st note of the day instead of the 2nd.
    assert.equal(result.path, "src/content/notes/2-skewed.md");
  });
});
