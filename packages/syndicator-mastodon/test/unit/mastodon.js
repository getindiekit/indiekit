import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import { mastodon } from "../../lib/mastodon.js";

await mockAgent("syndicator-mastodon");

describe("syndicator-mastodon/lib/mastodon", () => {
  let context;

  beforeEach(() => {
    context = {
      me: "https://website.example",
      options: {
        accessToken: "token",
        characterLimit: 500,
        includePermalink: false,
        serverUrl: "https://mastodon.example",
      },
      photo: [
        {
          url: "https://website.example/photo1.jpg",
          alt: "Example image",
        },
      ],
      statusId: "1234567890987654321",
      statusParameters: { status: "Toot" },
      statusUrl: "https://mastodon.example/@username/1234567890987654321",
      statusUrlNotFound: "https://mastodon.example/@username/404",
    };
  });

  it("Posts a favourite", async () => {
    const { options, statusId, statusUrl } = context;
    const result = await mastodon(options).postFavourite(statusUrl);

    assert.equal(result, `https://mastodon.example/@username/${statusId}`);
  });

  it("Throws error posting a favourite", async () => {
    const { options, statusUrlNotFound } = context;

    await assert.rejects(mastodon(options).postFavourite(statusUrlNotFound), {
      message: "Record not found",
    });
  });

  it("Posts a reblog", async () => {
    const { options, statusId, statusUrl } = context;
    const result = await mastodon(options).postReblog(statusUrl);

    assert.equal(result, `https://mastodon.example/@username/${statusId}`);
  });

  it("Throws error posting a reblog", async () => {
    const { options, statusUrlNotFound } = context;

    await assert.rejects(mastodon(options).postReblog(statusUrlNotFound), {
      message: "Record not found",
    });
  });

  it("Posts a status", async () => {
    const { options, statusParameters, statusId } = context;
    const result = await mastodon(options).postStatus(statusParameters);

    assert.equal(result, `https://mastodon.example/@username/${statusId}`);
  });

  it("Throws error posting a status", async () => {
    const { options, statusParameters } = context;
    options.accessToken = "invalid";

    await assert.rejects(mastodon(options).postStatus(statusParameters), {
      message: "The access token is invalid",
    });
  });

  it("Throws error fetching media to upload", async () => {
    const { me, options } = context;
    await assert.rejects(
      mastodon(options).uploadMedia({ url: `${me}/404.jpg` }, me),
      {
        message: "Not Found",
      },
    );
  });

  it("Returns false passing an object to media upload function", async () => {
    const { me, options } = context;
    const result = await mastodon(options).uploadMedia({ foo: "bar" }, me);

    assert.equal(result, undefined);
  });

  it("Posts a favourite of a Mastodon status to Mastodon", async () => {
    const { me, options, statusUrl } = context;
    const result = await mastodon(options).post({ "like-of": statusUrl }, me);

    assert.equal(
      result,
      "https://mastodon.example/@username/1234567890987654321",
    );
  });

  it("Doesn’t post a favourite of a URL to Mastodon", async () => {
    const { me, options } = context;
    const result = await mastodon(options).post(
      { "like-of": "https://foo.bar/lunchtime" },
      me,
    );

    assert.equal(result, false);
  });

  it("Posts a repost of a Mastodon status to Mastodon", async () => {
    const { me, options, statusUrl } = context;
    const result = await mastodon(options).post({ "repost-of": statusUrl }, me);

    assert.equal(
      result,
      "https://mastodon.example/@username/1234567890987654321",
    );
  });

  it("Doesn’t post a repost of a URL to Mastodon", async () => {
    const { me, options } = context;
    const result = await mastodon(options).post(
      { "repost-of": "https://foo.bar/lunchtime" },
      me,
    );

    assert.equal(result, false);
  });

  it("Posts a quote status to Mastodon", async () => {
    const { me, options, statusUrl } = context;
    const result = await mastodon(options).post(
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
    const { me, options } = context;
    const result = await mastodon(options).post(
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
    const { me, options, photo } = context;
    const result = await mastodon(options).post(
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
    const { me, options, photo } = context;
    const result = await mastodon(options).uploadMedia(photo[0], me);

    assert.ok(result);
  });
});
