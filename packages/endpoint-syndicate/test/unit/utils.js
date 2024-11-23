import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it } from "node:test";
import { testDatabase } from "@indiekit-test/database";
import {
  getPostData,
  getSyndicationTarget,
  hasSyndicationUrl,
} from "../../lib/utils.js";

const { client, database, mongoServer } = await testDatabase();
const posts = database.collection("posts");
const application = { posts };
const url = "https://website.example/post/12345";

describe("endpoint-syndicate/lib/token", () => {
  beforeEach(async () => {
    await posts.insertOne({
      properties: {
        type: "entry",
        "mp-syndicate-to": "https://mastodon.example/",
        url,
      },
    });
  });

  after(() => {
    client.close();
    mongoServer.stop();
  });

  it("Gets post for given URL from database", async () => {
    const result = await getPostData(application, url);

    assert.equal(
      result.properties["mp-syndicate-to"],
      "https://mastodon.example/",
    );
  });

  it("Gets post data from database", async () => {
    const result = await getPostData(application, "");

    assert.equal(
      result.properties["mp-syndicate-to"],
      "https://mastodon.example/",
    );
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
