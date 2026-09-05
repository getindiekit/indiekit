import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";

import { postTypeCount } from "../../lib/post-type-count.js";

const { client, database, mongoServer } = await testDatabase();
const posts = database.collection("posts");
const published = new Date();

describe("endpoint-micropub/lib/post-type-count", () => {
  before(async () => {
    await posts.insertMany([
      {
        properties: {
          type: "entry",
          "post-type": "note",
          published,
          name: "Foo",
          url: "https://website.example/foo",
        },
      },
      {
        properties: {
          type: "entry",
          "post-type": "note",
          published,
          name: "Bar",
          url: "https://website.example/bar",
        },
      },
    ]);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
  });

  it("Counts posts of a given type published on the same day", async () => {
    const result = await postTypeCount.get(posts, {
      type: "entry",
      published,
      "post-type": "note",
    });

    assert.equal(result, 2);
  });

  it("Doesn’t count the post being updated, by its ID", async () => {
    const post = await posts.findOne({});
    const result = await postTypeCount.get(posts, {
      uid: post._id.toString(),
      type: "entry",
      published,
      "post-type": "note",
    });

    assert.equal(result, 1);
  });

  it("Doesn’t count the post being updated, by its URL", async () => {
    const result = await postTypeCount.get(posts, {
      type: "entry",
      published,
      "post-type": "note",
      url: "https://website.example/foo",
    });

    assert.equal(result, 1);
  });

  it("Doesn’t count posts of another type", async () => {
    const result = await postTypeCount.get(posts, {
      type: "entry",
      published,
      "post-type": "photo",
    });

    assert.equal(result, 0);
  });
});
