import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";
import { testDatabase } from "@indiekit-test/database";
import { postTypeCount } from "../../lib/post-type-count.js";

const { client, database, mongoServer } = await testDatabase();
const posts = database.collection("posts");
const application = { posts, useDatabase: true };

describe("endpoint-media/lib/post-type-count", () => {
  before(async () => {
    await posts.insertOne({
      properties: {
        type: "entry",
        "post-type": "note",
        published: new Date(),
        name: "Foo",
        url: "https://website.example/foo",
      },
    });
  });

  after(() => {
    client.close();
    mongoServer.stop();
  });

  it("Counts the number of posts of a given type", async () => {
    const post = await posts.findOne({});
    const result = await postTypeCount.get(application, {
      uid: post._id.toString(),
      type: "entry",
      published: new Date(),
      name: "Bar",
      "mp-slug": "bar",
      "post-type": "note",
    });

    assert.equal(result, 1);
  });
});
