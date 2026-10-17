import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { AtpAgent, AppBskyRichtextFacet } from "@atproto/api";
import { TestNetworkNoAppView } from "@atproto/dev-env";
import { mockAgent } from "@indiekit-test/mock-agent";

import { Bluesky } from "../../lib/bluesky.js";
import { createRichText, uriToPostUrl } from "../../lib/utils.js";

const BLUESKY_LIKE_URL =
  /^https:\/\/bsky\.app\/profile\/did:plc:[a-z0-9]+\/like\/[\w\d]+$/;
const BLUESKY_POST_URL =
  /^https:\/\/bsky\.app\/profile\/did:plc:[a-z0-9]+\/post\/[\w\d]+$/;
const BLUESKY_REPOST_URL =
  /^https:\/\/bsky\.app\/profile\/did:plc:[a-z0-9]+\/repost\/[\w\d]+$/;

describe("syndicator-bluesky/lib/bluesky", () => {
  const me = "https://website.example";
  const photo = [{ url: "https://website.example/photo1.jpg", alt: "Photo" }];

  let /** @type {Bluesky} */ bluesky;
  let /** @type {string} */ postUrl;
  let /** @type {TestNetworkNoAppView} */ network;
  let /** @type {AtpAgent} */ seedAgent;
  let seedClient;

  before(async () => {
    network = await TestNetworkNoAppView.create({
      dbPostgresSchema: "api_atp_agent",
    });

    seedClient = network.getSeedClient();
    seedAgent = new AtpAgent({ service: network.pds.url });

    // Create Alice’s account
    const alice = await seedClient.createAccount("alice", {
      email: "alice@alice.test",
      handle: "alice.test",
      password: "password",
    });

    // Create and login to Bob’s account
    const bob = await seedClient.createAccount("bob", {
      email: "bob@bob.test",
      handle: "bob.test",
      password: "password",
    });
    await seedAgent.login({
      identifier: bob.handle,
      password: bob.password,
    });

    // Create a post by Bob
    const bobPost = await seedAgent.app.bsky.feed.post.create(
      { repo: bob.did },
      { text: "I like cheese.", createdAt: new Date().toISOString() },
    );
    postUrl = uriToPostUrl("https://bsky.app/profile", bobPost.uri);

    // Bluesky client under test
    bluesky = new Bluesky({
      profileUrl: `https://bsky.app/profile`,
      serviceUrl: network.pds.url,
      identifier: alice.handle,
      password: alice.password,
    });
  });

  after(async () => {
    await network.close();
  });

  it("Posts a like", async () => {
    const result = await bluesky.postLike(postUrl);

    assert.ok(result, "no post");
    assert.match(result, BLUESKY_LIKE_URL);
  });

  it("Throws error posting a like", async () => {
    await assert.rejects(bluesky.postLike("https://foo.bar"), {
      message: `Invalid com.atproto.repo.getRecord params: Missing required key "repo"`,
    });
  });

  it("Posts a repost", async () => {
    const result = await bluesky.postRepost(postUrl);

    assert.ok(result, "no post");
    assert.match(result, BLUESKY_REPOST_URL);
  });

  it("Throws error posting a repost", async () => {
    await assert.rejects(bluesky.postRepost("https://foo.bar"), {
      message: `Invalid com.atproto.repo.getRecord params: Missing required key "repo"`,
    });
  });

  it("Posts a quote post", async () => {
    const richText = await createRichText(seedAgent, "Me too!");
    const result = await bluesky.postQuotePost(postUrl, richText);

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Posts a quote post with images", async () => {
    await mockAgent("syndicator-bluesky");

    const richText = await createRichText(seedAgent, "Me too!");
    const image = await bluesky.uploadMedia(photo[0], me);
    const images = image ? [{ alt: photo[0].alt, image }] : [];
    const result = await bluesky.postQuotePost(postUrl, richText, images);

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Throws error posting a quote post", async () => {
    // @ts-expect-error: Testing invalid plain text input
    await assert.rejects(bluesky.postQuotePost(postUrl, "Plain text"), {
      message: `Invalid app.bsky.feed.post record: Missing required key "text" at $.record`,
    });
  });

  it("Posts a post", async () => {
    const richText = await createRichText(seedAgent, "I like ham sandwiches");
    const result = await bluesky.postPost(richText);

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Posts a post with images", async () => {
    await mockAgent("syndicator-bluesky");

    const richText = await createRichText(seedAgent, "I like ham sandwiches");
    const image = await bluesky.uploadMedia(photo[0], me);
    const images = image ? [{ alt: photo[0].alt, image }] : [];
    const result = await bluesky.postPost(richText, images);

    assert.match(result, BLUESKY_POST_URL);
  });

  it("Throws error posting a post", async () => {
    // @ts-expect-error: Testing invalid plain text input
    await assert.rejects(bluesky.postPost("Plain text"), {
      message: `Invalid app.bsky.feed.post record: Missing required key "text" at $.record`,
    });
  });

  it("Uploads media", async () => {
    await mockAgent("syndicator-bluesky");

    const result = await bluesky.uploadMedia(photo[0], me);

    assert.ok(result, "no media uploaded");
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

    assert.ok(result, "no post");
    assert.match(result, BLUESKY_LIKE_URL);
  });

  it("Doesn’t post a like of a URL to Bluesky", async () => {
    const result = await bluesky.post({ "like-of": "https://foo.bar" }, me);

    assert.equal(result, undefined);
  });

  it("Posts a repost of a Bluesky post to Bluesky", async () => {
    const result = await bluesky.post({ "repost-of": postUrl }, me);

    assert.ok(result, "no post");
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

    assert.ok(result, "no post");
    assert.match(result, BLUESKY_POST_URL);
  });

  it("Posts a threaded reply to a Bluesky post", async () => {
    const result = await bluesky.post(
      {
        content: { html: "<p>Me too!</p>" },
        "in-reply-to": postUrl,
        "post-type": "reply",
      },
      me,
    );
    assert.ok(result, "no post");

    const parent = await bluesky.getPost(postUrl);
    const reply = await bluesky.getPost(result);
    assert.match(result, BLUESKY_POST_URL);
    assert.equal(reply.value.reply?.parent.uri, parent.uri);
    assert.equal(reply.value.reply?.root.uri, parent.uri);
  });

  it("Roots a reply to a reply at the original post", async () => {
    const firstReplyUrl = await bluesky.post(
      { content: { html: "<p>Me too!</p>" }, "in-reply-to": postUrl },
      me,
    );
    assert.ok(firstReplyUrl, "no post");

    const result = await bluesky.post(
      { content: { html: "<p>And me.</p>" }, "in-reply-to": firstReplyUrl },
      me,
    );
    assert.ok(result, "no post");

    const original = await bluesky.getPost(postUrl);
    const first = await bluesky.getPost(firstReplyUrl);
    const second = await bluesky.getPost(result);

    assert.equal(second.value.reply?.parent.uri, first.uri);
    assert.equal(second.value.reply?.root.uri, original.uri);
  });

  it("Posts a reply to a URL on another site without threading", async () => {
    const result = await bluesky.post(
      {
        content: { html: "<p>Me too!</p>" },
        "in-reply-to": "https://another.example/post/1",
      },
      me,
    );
    assert.ok(result, "no post");

    const post = await bluesky.getPost(result);

    assert.match(result, BLUESKY_POST_URL);
    assert.equal(post.value.reply, undefined);
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

    assert.ok(result, "no post");
    assert.match(result, BLUESKY_POST_URL);
  });

  it("Posts a post with clickable link text to Bluesky", async () => {
    const result = await bluesky.post(
      {
        content: {
          html: '<p>I like <a href="https://cheese.example">cheese</a>.</p>',
        },
        url: "https://foo.bar",
      },
      me,
    );
    assert.ok(result, "no post");

    const post = await bluesky.getPost(result);
    const facets = (post.value.facets ?? []).filter((facet) => {
      const [feature] = facet.features;
      return (
        AppBskyRichtextFacet.isLink(feature) &&
        feature.uri === "https://cheese.example"
      );
    });

    // The link text, and the URL appended to the text
    assert.deepEqual(
      facets.map((facet) => facet.index),
      [
        { byteStart: 7, byteEnd: 13 },
        { byteStart: 15, byteEnd: 37 },
      ],
    );
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

    assert.ok(result, "no post");
    assert.match(result, BLUESKY_POST_URL);
  });
});
