import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { AtpAgent } from "@atproto/api";
import { TestNetworkNoAppView } from "@atproto/dev-env";
import { mockAgent } from "@indiekit-test/mock-agent";

import { Bluesky } from "../../lib/bluesky.js";
import { createRichText, uriToPostUrl } from "../../lib/utils.js";

const BLUESKY_LIKE_URL =
  /^https:\/\/bsky\.app\/profile\/[^/]+\/did:plc:[a-z0-9]+\/like\/[\w\d]+$/;
const BLUESKY_POST_URL =
  /^https:\/\/bsky\.app\/profile\/[^/]+\/did:plc:[a-z0-9]+\/post\/[\w\d]+$/;
const BLUESKY_REPOST_URL =
  /^https:\/\/bsky\.app\/profile\/[^/]+\/did:plc:[a-z0-9]+\/repost\/[\w\d]+$/;

const aliceAccount = {
  email: "alice@alice.test",
  handle: "alice.test",
  password: "password",
};

const bobAccount = {
  email: "bob@bob.test",
  handle: "bob.test",
  password: "password",
};

describe("syndicator-bluesky/lib/bluesky", () => {
  const me = "https://website.example";
  const photo = [{ url: "https://website.example/photo1.jpg", alt: "Photo" }];

  let bluesky;
  let postUrl;
  let network;
  let seedAgent;
  let seedClient;

  before(async () => {
    network = await TestNetworkNoAppView.create({
      dbPostgresSchema: "api_atp_agent",
    });

    seedClient = network.getSeedClient();
    seedAgent = new AtpAgent({ service: network.pds.url });

    // Create Alice’s account
    await seedClient.createAccount("alice", aliceAccount);

    // Create and login to Bob’s account
    const bob = await seedClient.createAccount("bob", bobAccount);
    await seedAgent.login({
      identifier: bobAccount.handle,
      password: bobAccount.password,
    });

    // Create a post by Bob
    const bobPost = await seedAgent.app.bsky.feed.post.create(
      { repo: bob.did },
      { text: "I like cheese.", createdAt: new Date().toISOString() },
    );
    postUrl = uriToPostUrl("https://bsky.app/profile", bobPost.uri);

    // Bluesky client under test
    bluesky = new Bluesky({
      profileUrl: `https://bsky.app/profile/${aliceAccount.handle}`,
      serviceUrl: network.pds.url,
      identifier: aliceAccount.handle,
      password: aliceAccount.password,
    });
  });

  after(async () => {
    await network.close();
  });

  it("Posts a like", async () => {
    const result = await bluesky.postLike(postUrl);

    assert.match(result, BLUESKY_LIKE_URL);
  });

  it("Throws error posting a like", async () => {
    await assert.rejects(bluesky.postLike("https://foo.bar"), {
      message: `Error: Params must have the property "repo"`,
    });
  });

  it("Posts a repost", async () => {
    const result = await bluesky.postRepost(postUrl);

    assert.match(result, BLUESKY_REPOST_URL);
  });

  it("Throws error posting a repost", async () => {
    await assert.rejects(bluesky.postRepost("https://foo.bar"), {
      message: `Error: Params must have the property "repo"`,
    });
  });

  it("Posts a quote post", async () => {
    const richText = await createRichText(bluesky, "Me too!");
    const result = await bluesky.postQuotePost(postUrl, richText);

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Posts a quote post with images", async () => {
    await mockAgent("syndicator-bluesky");

    const richText = await createRichText(bluesky, "Me too!");
    const images = await bluesky.uploadMedia(photo[0], me);
    const result = await bluesky.postQuotePost(postUrl, richText, images);

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Throws error posting a quote post", async () => {
    await assert.rejects(bluesky.postQuotePost(postUrl, "Plain text"), {
      message: `Invalid app.bsky.feed.post record: Record must have the property "text"`,
    });
  });

  it("Posts a post", async () => {
    const richText = await createRichText(bluesky, "I like ham sandwiches");
    const result = await bluesky.postPost(richText);

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Posts a post with images", async () => {
    await mockAgent("syndicator-bluesky");

    const richText = await createRichText(bluesky, "I like ham sandwiches");
    const images = await bluesky.uploadMedia(photo[0], me);
    const result = await bluesky.postPost(richText, images);

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Throws error posting a post", async () => {
    await assert.rejects(bluesky.postPost("Plain text"), {
      message: `Invalid app.bsky.feed.post record: Record must have the property "text"`,
    });
  });

  it("Uploads media", async () => {
    await mockAgent("syndicator-bluesky");

    const result = await bluesky.uploadMedia(photo[0], me);

    assert.equal(result.mimeType, "image/jpeg");
    assert.equal(result.size, 789);
  });

  it("Throws error fetching media to upload", async () => {
    await mockAgent("syndicator-bluesky");

    await assert.rejects(bluesky.uploadMedia({ url: `${me}/404.jpg` }, me), {
      message: "Not Found",
    });
  });

  it("Posts a like of a Bluesky post to Bluesky", async () => {
    const result = await bluesky.post({ "like-of": postUrl }, me);

    assert.match(result, BLUESKY_LIKE_URL);
  });

  it("Doesn’t post a like of a URL to Bluesky", async () => {
    const result = await bluesky.post({ "like-of": "https://foo.bar" }, me);

    assert.equal(result, undefined);
  });

  it("Posts a repost of a Bluesky post to Bluesky", async () => {
    const result = await bluesky.post({ "repost-of": postUrl }, me);

    assert.match(result, BLUESKY_REPOST_URL);
  });

  it("Doesn’t post a repost of a URL to Bluesky", async () => {
    const result = await bluesky.post({ "repost-of": "https://foo.bar" }, me);

    assert.equal(result, undefined);
  });

  it("Posts a quote post to Bluesky", async () => {
    const result = await bluesky.post(
      {
        content: { html: "<p>Me too!</p>" },
        "repost-of": postUrl,
        "post-type": "repost",
      },
      me,
    );

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Posts a post to Bluesky", async () => {
    const result = await bluesky.post(
      {
        content: {
          html: "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
          text: "I ate a cheese sandwich, which was nice.",
        },
        url: "https://foo.bar",
      },
      me,
    );

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Posts a post with photo to Bluesky", async () => {
    const result = await bluesky.post(
      {
        content: {
          html: "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
          text: "I ate a cheese sandwich, which was nice.",
        },
        photo,
        url: "https://foo.bar",
      },
      me,
    );

    assert.match(result, BLUESKY_POST_URL);
  });
});
