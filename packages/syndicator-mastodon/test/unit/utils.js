import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getFixture } from "@indiekit-test/fixtures";

import {
  createStatus,
  getStatusIdFromUrl,
  htmlToStatusText,
} from "../../lib/utils.js";

describe("syndicator-mastodon/lib/utils", () => {
  it("Creates a status with article post name and URL", () => {
    const result = createStatus(
      JSON.parse(getFixture("jf2/article-content-provided-html-text.jf2")),
      {
        serverUrl: "https://mastodon.example",
      },
    );

    assert.equal(
      result.status,
      "What I had for lunch https://foo.bar/lunchtime",
    );
  });

  it("Creates a status that is unlisted", () => {
    const result = createStatus(
      JSON.parse(getFixture("jf2/note-visibility-unlisted.jf2")),
      {
        serverUrl: "https://mastodon.example",
      },
    );

    assert.equal(result.status, "I ate a cheese sandwich, which was nice.");
    assert.equal(result.visibility, "unlisted");
  });

  it("Creates a status with HTML content", () => {
    const result = createStatus(
      JSON.parse(getFixture("jf2/note-content-provided-html.jf2")),
      {
        serverUrl: "https://mastodon.example",
      },
    );

    assert.equal(result.status, "> I ate a cheese sandwich, which was > 10.");
  });

  it("Creates a status with HTML content and appends last link", () => {
    const result = createStatus(
      JSON.parse(getFixture("jf2/note-content-provided-html-with-link.jf2")),
      {
        serverUrl: "https://mastodon.example",
      },
    );

    assert.equal(
      result.status,
      "> I ate a cheese sandwich, which was > 10. https://en.wikipedia.org/wiki/Cheese",
    );
  });

  it("Creates a status with HTML content and doesn’t append Mastodon link", () => {
    const result = createStatus(
      JSON.parse(
        getFixture("jf2/note-content-provided-html-with-mastodon-link.jf2"),
      ),
      {
        serverUrl: "https://mastodon.example",
      },
    );

    assert.equal(result.status, "I ate @cheese’s sandwich, which was nice.");
  });

  it("Creates a reblog with status URL and post content", () => {
    const result = createStatus(
      JSON.parse(getFixture("jf2/repost-mastodon.jf2")),
      {
        serverUrl: "https://mastodon.example",
      },
    );

    assert.equal(
      result.status,
      `Someone else who likes cheese sandwiches. https://mastodon.example/@username/1234567890987654321`,
    );
  });

  it("Adds link to status post is in reply to", () => {
    const result = createStatus(
      JSON.parse(getFixture("jf2/reply-mastodon.jf2")),
      {
        serverUrl: "https://mastodon.example",
      },
    );

    assert.equal(result.status, "I ate a cheese sandwich too!");
    assert.equal(result.inReplyToId, "1234567890987654321");
  });

  it("Throws creating a status if post is off-service reply", () => {
    assert.throws(
      () => {
        createStatus(JSON.parse(getFixture("jf2/reply-off-service.jf2")), {
          serverUrl: "https://mastodon.example",
        });
      },
      {
        name: "BadRequestError",
        message: "Not a reply to a URL at this target",
      },
    );
  });

  it("Creates a status with a photo", () => {
    const result = createStatus(
      {
        content: {
          html: "<p>Here’s the cheese sandwich I ate.</p>",
        },
      },
      {
        mediaIds: ["1", "2", "3", "4"],
        serverUrl: "https://mastodon.example",
      },
    );

    assert.equal(result.status, "Here’s the cheese sandwich I ate.");
    assert.deepEqual(result.mediaIds, ["1", "2", "3", "4"]);
  });

  it("Gets status ID from Mastodon permalink", () => {
    const result = getStatusIdFromUrl(
      "https://mastodon.example/@username/1234567890987654321",
    );

    assert.equal(result, "1234567890987654321");
  });

  it("Converts HTML to status text", () => {
    const result = htmlToStatusText(
      "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
      "https://mastodon.example",
    );

    assert.equal(result, "I ate a cheese sandwich, which was nice.");
  });

  it("Converts HTML to status text, appending last link href if present", () => {
    const result = htmlToStatusText(
      '<p>Hello <a href="/hello">world</a>, hello <a href="https://moon.example">moon</a>.</p>',
      "https://mastodon.example",
    );

    assert.equal(result, "Hello world, hello moon. https://moon.example");
  });
});
