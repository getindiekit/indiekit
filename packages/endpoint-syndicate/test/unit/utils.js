import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";

import {
  getPostData,
  getSyndicationTarget,
  hasSyndicationUrl,
  syndicateToTargets,
} from "../../lib/utils.js";

const { client, database, mongoServer } = await testDatabase();
const postsCollection = database.collection("posts");
const url = "https://website.example/post/12345";

describe("endpoint-syndicate/lib/token", () => {
  beforeEach(async () => {
    await postsCollection.insertOne({
      properties: {
        type: "entry",
        "mp-syndicate-to": "https://mastodon.example/",
        url,
      },
    });
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
  });

  it("Gets post for given URL from database", async () => {
    const result = await getPostData(postsCollection, url);

    assert.equal(
      result.properties["mp-syndicate-to"],
      "https://mastodon.example/",
    );
  });

  it("Gets post data from database", async () => {
    const result = await getPostData(postsCollection, "");

    assert.equal(
      result.properties["mp-syndicate-to"],
      "https://mastodon.example/",
    );
  });

  it("Gets a post with targets still awaiting syndication", async () => {
    // A post syndicated to one of two targets keeps the failed target in
    // `mp-syndicate-to` and gains a `syndication` URL for the one that worked.
    const collection = database.collection("posts-partially-syndicated");
    await collection.insertOne({
      properties: {
        type: "entry",
        "mp-syndicate-to": "https://bsky.example/",
        syndication: ["https://mastodon.example/@username/67890"],
        url: "https://website.example/post/67890",
      },
    });

    const result = await getPostData(collection, "");

    assert.ok(result, "expected the post to be awaiting syndication");
    assert.equal(result.properties["mp-syndicate-to"], "https://bsky.example/");
  });

  it("Gets oldest post awaiting syndication first", async () => {
    const collection = database.collection("posts-awaiting-syndication");
    await collection.insertMany(
      [
        "2023-01-26T12:00:00Z",
        "2023-01-26T10:00:00Z",
        "2023-01-26T11:00:00Z",
      ].map((published, index) => ({
        properties: {
          type: "entry",
          "mp-syndicate-to": "https://mastodon.example/",
          published,
          url: `https://website.example/post/${index}`,
        },
      })),
    );

    const result = await getPostData(collection, "");

    assert.equal(result.properties.published, "2023-01-26T10:00:00Z");
  });

  it("Gets syndication target for syndication URL", () => {
    const targets = [{ info: { uid: "https://mastodon.example" } }];
    const result = getSyndicationTarget(targets, "https://mastodon.example");

    assert.equal(result.info.uid, "https://mastodon.example");
  });

  it("Returns undefined getting unknown target for syndication URL", () => {
    const targets = [{ info: { uid: "https://mastodon.example" } }];
    const result = getSyndicationTarget(targets, "https://mastodon.foo");

    assert.equal(result, undefined);
  });

  it("Returns undefined if no target URLs defined for syndication URL", () => {
    const targets = [{ info: { name: "Example" } }];
    const result = getSyndicationTarget(targets, "https://mastodon.example");

    assert.equal(result, undefined);
  });

  it("Syndicates to a single target given as a string", async () => {
    // Converting mf2 to JF2 collapses a single-item array to a string, so a
    // post sent to one target arrives here as a string rather than an array.
    const target = {
      info: { uid: "https://mastodon.example/" },
      async syndicate() {
        return "https://mastodon.example/@username/67890";
      },
    };
    const publication = { syndicationTargets: [target] };
    const properties = { "mp-syndicate-to": "https://mastodon.example/" };

    const result = await syndicateToTargets(publication, properties);

    assert.deepEqual(result.syndicatedUrls, [
      "https://mastodon.example/@username/67890",
    ]);
  });

  it("Checks if target already returned a syndication URL", () => {
    const syndication = [
      "https://mastodon.example/@username/67890",
      "https://web.archive.org/web/20230116193035/https://example.com/",
    ];

    assert.equal(
      hasSyndicationUrl(syndication, "https://mastodon.example"),
      true,
    );
    assert.equal(
      hasSyndicationUrl(syndication, "https://web.archive.org"),
      true,
    );
    assert.equal(
      hasSyndicationUrl(syndication, "https://mastodon.foobar"),
      false,
    );
  });
});
