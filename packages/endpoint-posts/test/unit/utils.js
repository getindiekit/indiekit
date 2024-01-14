import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mockResponse } from "mock-req-res";
import {
  getGeoProperty,
  getGeoValue,
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
  it("Gets geographic coordinates property", () => {
    assert.deepEqual(getGeoProperty("50.8252, -0.1383"), {
      type: "geo",
      name: "50° 49′ 30.72″ N 0° 8′ 17.88″ W",
      latitude: 50.8252,
      longitude: -0.1383,
    });
  });

  it("Gets comma separated geographic coordinates", () => {
    assert.equal(
      getGeoValue({
        type: "geo",
        name: "50° 49′ 30.72″ N 0° 8′ 17.88″ W",
        latitude: 50.8252,
        longitude: -0.1383,
      }),
      "50.8252,-0.1383",
    );
  });

  it("Gets location property", async (t) => {
    await t.test("with address", () => {
      assert.deepEqual(
        getLocationProperty({
          location: {
            "street-address": "Jubilee Street",
            locality: "Brighton",
            "postal-code": "BN1 1GE",
          },
        }),
        {
          type: "adr",
          "street-address": "Jubilee Street",
          locality: "Brighton",
          "postal-code": "BN1 1GE",
        },
      );
    });

    await t.test("without empty values", () => {
      assert.deepEqual(
        getLocationProperty({
          location: {
            name: "Brighton Jubilee Library",
            "street-address": "",
            locality: "Brighton",
            "postal-code": "",
          },
        }),
        {
          type: "card",
          name: "Brighton Jubilee Library",
          locality: "Brighton",
        },
      );
    });

    await t.test("with venue", () => {
      assert.deepEqual(
        getLocationProperty({
          location: {
            name: "Brighton Jubilee Library",
            "street-address": "Jubilee Street",
            locality: "Brighton",
            "postal-code": "BN1 1GE",
          },
        }),
        {
          type: "card",
          name: "Brighton Jubilee Library",
          "street-address": "Jubilee Street",
          locality: "Brighton",
          "postal-code": "BN1 1GE",
        },
      );
    });

    await t.test("with geographic coordinates", () => {
      assert.deepEqual(
        getLocationProperty({
          geo: "50.8252, -0.1383",
        }),
        {
          type: "geo",
          name: "50° 49′ 30.72″ N 0° 8′ 17.88″ W",
          latitude: 50.8252,
          longitude: -0.1383,
        },
      );
    });

    await t.test("with venue and geographic coordinates", () => {
      assert.deepEqual(
        getLocationProperty({
          geo: "50.8252, -0.1383",
          location: {
            name: "Brighton Jubilee Library",
            "street-address": "Jubilee Street",
            locality: "Brighton",
            "postal-code": "BN1 1GE",
          },
        }),
        {
          type: "card",
          name: "Brighton Jubilee Library",
          "street-address": "Jubilee Street",
          locality: "Brighton",
          "postal-code": "BN1 1GE",
          geo: {
            type: "geo",
            name: "50° 49′ 30.72″ N 0° 8′ 17.88″ W",
            latitude: 50.8252,
            longitude: -0.1383,
          },
        },
      );
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
