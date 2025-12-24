import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { TestNetworkNoAppView } from "@atproto/dev-env";
import { getFixture } from "@indiekit-test/fixtures";
import sharp from "sharp";

import {
  createRichText,
  constrainImage,
  getPostImage,
  getPostParts,
  getPostText,
  htmlToStatusText,
  uriToPostUrl,
} from "../../lib/utils.js";

describe("syndicator-bluesky/lib/utils", async () => {
  let network;

  const largeImage = await sharp({
    create: {
      width: 640,
      height: 640,
      channels: 4,
      background: { r: 255, g: 128, b: 0, alpha: 1 },
      noise: {
        type: "gaussian",
        mean: 128,
        sigma: 30,
      },
    },
  })
    .png()
    .toBuffer();

  before(async () => {
    network = await TestNetworkNoAppView.create({
      dbPostgresSchema: "api_atp_agent",
    });
  });

  after(async () => {
    await network.close();
  });

  it("Converts plain text to rich text", async () => {
    const agent = network.getSeedClient();
    const result = await createRichText(agent, "foo https://bar.baz");

    assert.deepEqual(result.facets, [
      {
        features: [
          {
            $type: "app.bsky.richtext.facet#link",
            uri: "https://bar.baz",
          },
        ],
        index: {
          byteEnd: 19,
          byteStart: 4,
        },
      },
    ]);
  });

  it("Returns unconstrained image if already small enough", async () => {
    const maxBytes = 1024 * 1024; // 1MB

    const smallImage = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await constrainImage(smallImage, maxBytes);

    assert.deepStrictEqual(result, smallImage);
  });

  it("Compresses image larger than maximum file size", async () => {
    const maxBytes = 100 * 1024; // 100KB
    const result = await constrainImage(largeImage, maxBytes, 90);
    const metadata = await sharp(result).metadata();

    assert.ok(result.byteLength <= maxBytes);
    assert.strictEqual(metadata.format, "jpeg");
  });

  it("Gets resized post image", async () => {
    const result = await getPostImage(largeImage, "image/png");
    const metadata = await sharp(result.buffer).metadata();
    const maxBytes = 1024 * 1024; // 1MB

    assert.ok(metadata.size <= maxBytes);
    assert.equal(result.mimeType, "image/jpeg");
  });

  it("Gets post parts", () => {
    const result = getPostParts(
      "https://bsky.example/profile/did:plc:ix4srp5t7rswkoachemlkzdt/post/3llped5ya3b22",
    );

    assert.deepEqual(result, {
      did: "did:plc:ix4srp5t7rswkoachemlkzdt",
      rkey: "3llped5ya3b22",
    });
  });

  it("Gets post text for post with no content", () => {
    const result = getPostText(
      JSON.parse(getFixture("jf2/photo-untitled.jf2")),
    );

    assert.equal(result, "");
  });

  it("Gets post text with article post name and URL", () => {
    const result = getPostText(
      JSON.parse(getFixture("jf2/article-content-provided-html-text.jf2")),
    );

    assert.equal(result, "What I had for lunch https://foo.bar/lunchtime");
  });

  it("Gets post text with HTML content", () => {
    const result = getPostText(
      JSON.parse(getFixture("jf2/note-content-provided-html.jf2")),
    );

    assert.equal(result, "> I ate a cheese sandwich, which was > 10.");
  });

  it("Gets post text with HTML content and appends last link", () => {
    const result = getPostText(
      JSON.parse(getFixture("jf2/note-content-provided-html-with-link.jf2")),
    );

    assert.equal(
      result,
      "> I ate a cheese sandwich, which was > 10. https://en.wikipedia.org/wiki/Cheese",
    );
  });

  it("Convert HTML to status text", () => {
    const result = htmlToStatusText(
      "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
    );

    assert.equal(result, "I ate a cheese sandwich, which was nice.");
  });

  it("Convert HTML to status text, appending last link href if present", () => {
    const result = htmlToStatusText(
      '<p>Hello <a href="/hello">world</a>, hello <a href="https://moon.example">moon</a>.</p>',
    );

    assert.equal(result, "Hello world, hello moon. https://moon.example");
  });

  it("Converts Bluesky URI to post URL", () => {
    const result = uriToPostUrl(
      "https://app.example/profile",
      "at://did:plc:ix4srp5t7rswkoachemlkzdt/app.bsky.feed.post/3llped5ya3b22",
    );

    assert.equal(
      result,
      "https://app.example/profile/did:plc:ix4srp5t7rswkoachemlkzdt/post/3llped5ya3b22",
    );
  });
});
