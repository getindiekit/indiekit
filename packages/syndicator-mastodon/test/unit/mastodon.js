import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import { Mastodon } from "../../lib/mastodon.js";

await mockAgent("syndicator-mastodon");

describe("syndicator-mastodon/lib/mastodon", () => {
  const mastodon = new Mastodon({
    accessToken: "token",
    characterLimit: 500,
    includePermalink: false,
    serverUrl: "https://mastodon.example",
  });
  const me = "https://website.example";
  const photo = [{ url: "https://website.example/photo1.jpg", alt: "Photo" }];
  const statusUrl = "https://mastodon.example/@username/1234567890987654321";
  const statusUrlNotFound = "https://mastodon.example/@username/404";

  it("Posts a favourite", async () => {
    const result = await mastodon.postFavourite(statusUrl);

    assert.equal(result, statusUrl);
  });

  it("Throws error posting a favourite", async () => {
    await assert.rejects(mastodon.postFavourite(statusUrlNotFound), {
      message: "Record not found",
    });
  });

  it("Posts a reblog", async () => {
    const result = await mastodon.postReblog(statusUrl);

    assert.equal(result, statusUrl);
  });

  it("Throws error posting a reblog", async () => {
    await assert.rejects(mastodon.postReblog(statusUrlNotFound), {
      message: "Record not found",
    });
  });

  it("Posts a status", async () => {
    const result = await mastodon.postStatus({ status: "Toot" });

    assert.equal(result, statusUrl);
  });

  it("Throws error posting a status", async () => {
    const mastodonNoToken = new Mastodon({
      accessToken: "invalid",
      characterLimit: 500,
      serverUrl: "https://mastodon.example",
    });

    await assert.rejects(mastodonNoToken.postStatus({ status: "Toot" }), {
      message: "The access token is invalid",
    });
  });

  it("Throws error fetching media to upload", async () => {
    await assert.rejects(mastodon.uploadMedia({ url: `${me}/404.jpg` }, me), {
      message: "Not Found",
    });
  });

  it("Returns false passing an object to media upload function", async () => {
    const result = await mastodon.uploadMedia({ foo: "bar" }, me);

    assert.equal(result, undefined);
  });

  it("Posts a favourite of a Mastodon status to Mastodon", async () => {
    const result = await mastodon.post({ "like-of": statusUrl }, me);

    assert.equal(
      result,
      "https://mastodon.example/@username/1234567890987654321",
    );
  });

  it("Doesn’t post a favourite of a URL to Mastodon", async () => {
    const result = await mastodon.post(
      { "like-of": "https://foo.bar/lunchtime" },
      me,
    );

    assert.equal(result, undefined);
  });

  it("Posts a repost of a Mastodon status to Mastodon", async () => {
    const result = await mastodon.post({ "repost-of": statusUrl }, me);

    assert.equal(
      result,
      "https://mastodon.example/@username/1234567890987654321",
    );
  });

  it("Doesn’t post a repost of a URL to Mastodon", async () => {
    const result = await mastodon.post(
      { "repost-of": "https://foo.bar/lunchtime" },
      me,
    );

    assert.equal(result, undefined);
  });

  it("Posts a quote status to Mastodon", async () => {
    const result = await mastodon.post(
      {
        content: {
          html: "<p>Someone else who likes cheese sandwiches.</p>",
        },
        "repost-of": statusUrl,
        "post-type": "repost",
      },
      me,
    );

    assert.equal(
      result,
      "https://mastodon.example/@username/1234567890987654321",
    );
  });

  it("Posts a status to Mastodon", async () => {
    const result = await mastodon.post(
      {
        content: {
          html: "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
          text: "I ate a cheese sandwich, which was nice.",
        },
        url: "https://foo.bar/lunchtime",
      },
      me,
    );

    assert.equal(
      result,
      "https://mastodon.example/@username/1234567890987654321",
    );
  });

  it("Posts a status with photo to Mastodon", async () => {
    const result = await mastodon.post(
      {
        content: {
          html: "<p>Here’s the cheese sandwiches I ate.</p>",
        },
        photo,
      },
      me,
    );

    assert.equal(
      result,
      "https://mastodon.example/@username/1234567890987654321",
    );
  });

  it("Uploads media and returns a media id", async () => {
    const result = await mastodon.uploadMedia(photo[0], me);

    assert.ok(result);
  });
});
