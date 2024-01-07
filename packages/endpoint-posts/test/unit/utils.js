import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mockResponse } from "mock-req-res";
import {
  getLocationProperty,
  getPostName,
  getPostStatusBadges,
  getPostTypeName,
  getPostUrl,
  getSyndicateToItems,
} from "../../lib/utils.js";

const publication = {
  postTypes: [
    {
      type: "article",
      name: "Journal entry",
    },
  ],
  syndicationTargets: [
    {
      info: {
        service: {
          name: "Mastodon",
        },
        uid: "https://mastodon.example/@username",
      },
      options: {
        checked: true,
      },
    },
  ],
};

describe("endpoint-posts/lib/utils", () => {
  it("Gets location property", () => {
    assert.deepEqual(getLocationProperty("12.3456, -65.4321"), {
      type: "geo",
      latitude: "12.3456",
      longitude: "-65.4321",
      name: "12° 20′ 44.16″ N 65° 25′ 55.56″ W",
    });
  });

  it("Gets post name", () => {
    const post = { name: "My favourite sandwich" };

    assert.equal(getPostName(publication, post), "My favourite sandwich");
  });

  it("Gets post type name as fallback for post name", () => {
    const post = { "post-type": "article" };

    assert.equal(getPostName(publication, post), "Journal entry");
  });

  it("Gets post status badges", () => {
    const post = { deleted: true, "post-status": "unlisted" };
    const response = mockResponse({ locals: { __: (value) => value } });

    assert.deepEqual(getPostStatusBadges(post, response), [
      {
        color: "offset-purple",
        size: "small",
        text: "posts.status.unlisted",
      },
      {
        color: "red",
        size: "small",
        text: "posts.status.deleted",
      },
    ]);
  });

  it("Gets post type name (or an empty string)", () => {
    assert.equal(getPostTypeName(publication, "article"), "Journal entry");
    assert.equal(getPostTypeName(publication, ""), "");
  });

  it("Gets post URL", () => {
    assert.equal(
      getPostUrl("aHR0cHM6Ly93ZWJzaXRlLmV4YW1wbGUvZm9vYmFy"),
      "https://website.example/foobar",
    );
  });

  it("Gets syndication target `items` for checkboxes component", () => {
    const result = getSyndicateToItems(publication, true);

    assert.equal(result.length, 1);
    assert.equal(result[0].checked, true);
    assert.equal(result[0].hint, "https://mastodon.example/@username");
    assert.equal(result[0].label, "Mastodon");
    assert.equal(result[0].value, "https://mastodon.example/@username");
  });
});
