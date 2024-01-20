import { strict as assert } from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import { testConfig } from "@indiekit-test/config";
import { testDatabase } from "@indiekit-test/database";
import { postData } from "../../lib/post-data.js";

describe("endpoint-micropub/lib/post-data", async () => {
  let application;
  let publication;
  const { client, database, mongoServer } = await testDatabase();
  const posts = database.collection("posts");
  const properties = {
    type: "entry",
    published: "2020-07-26T20:10:57.062Z",
    name: "Foo",
    "mp-slug": "foo",
  };
  const url = "https://website.example/foo";

  before(() => {
    mock.method(console, "info", () => {});
    mock.method(console, "warn", () => {});
  });

  beforeEach(async () => {
    await posts.insertOne({
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
    });

    const config = await testConfig({ usePostTypes: true });

    application = { posts, useDatabase: true };
    publication = config.publication;
  });

  after(() => {
    client.close();
    mongoServer.stop();
  });

  it("Creates post data", async () => {
    const result = await postData.create(application, publication, properties);

    assert.equal(result.properties["post-type"], "note");
    assert.equal(result.properties["mp-slug"], "foo");
    assert.equal(result.properties.type, "entry");
    assert.equal(result.properties.url, "https://website.example/notes/foo/");
  });

  it("Throws error creating post data for non-configured post type", async () => {
    publication.postTypes = [];

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
    assert.equal(result.properties.url, "https://website.example/foo");
  });

  it("Updates post by adding properties", async () => {
    const operation = { add: { syndication: ["http://website.example"] } };
    const result = await postData.update(
      application,
      publication,
      url,
      operation,
    );

    assert.ok(result.properties.syndication);
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
        syndication: ["http://website.example"],
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
});
