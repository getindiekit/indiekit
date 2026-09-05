import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { postData } from "@indiekit-test/post-data";
import { mockResponse } from "mock-req-res";

import {
  getChannelItems,
  getGeoProperty,
  getGeoValue,
  getLocationProperty,
  getPhotoUrl,
  getPostName,
  getPostProperties,
  getPostStatusBadges,
  getPostUrl,
  getSyndicateToItems,
} from "../../lib/utils.js";

const publication = {
  me: "https://website.example",
  channels: {
    posts: {
      name: "Posts",
    },
    pages: {
      name: "Pages",
    },
  },
  postTypes: {
    article: {
      name: "Journal entry",
    },
  },
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
    {
      info: {
        error: "Secret key required",
        service: {
          name: "Internet Archive",
        },
      },
    },
  ],
};

describe("endpoint-posts/lib/utils", () => {
  it("Gets channel `items` for checkboxes component", () => {
    const result = getChannelItems(publication);

    assert.equal(result.length, 2);
    assert.equal(result[0].label, "Posts");
    assert.equal(result[0].value, "posts");
    assert.equal(result[1].label, "Pages");
    assert.equal(result[1].value, "pages");
  });

  it("Gets geographic coordinates property", () => {
    assert.deepEqual(getGeoProperty("50.8252, -0.1383"), {
      type: "geo",
      name: "50° 49′ 30.72″ N 0° 8′ 17.88″ W",
      latitude: 50.8252,
      longitude: -0.1383,
    });
  });

  it("Gets comma separated geographic coordinates", async (t) => {
    await t.test("from address", () => {
      assert.equal(
        getGeoValue({
          "street-address": "Jubilee Street",
          locality: "Brighton",
          geo: {
            type: "geo",
            name: "50° 49′ 30.72″ N 0° 8′ 17.88″ W",
            latitude: 50.8252,
            longitude: -0.1383,
          },
        }),
        "50.8252,-0.1383",
      );
    });

    await t.test("from geographic coordinates", () => {
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

  it("Returns empty object if location property is empty", () => {
    assert.deepEqual(
      getLocationProperty({
        location: {
          "street-address": "",
          locality: "",
          "postal-code": "",
        },
        geo: "",
      }),
      {},
    );
  });

  it("Gets photo URL", () => {
    const photo = { url: "https://external.example/foo.jpg" };
    const photos = [{ url: "/path/to/foo.jpg" }, { url: "/path/to/bar.jpg" }];

    assert.equal(getPhotoUrl(publication, { name: "foo" }), false);
    assert.deepEqual(getPhotoUrl(publication, { photo }), {
      url: "https://external.example/foo.jpg",
    });
    assert.deepEqual(getPhotoUrl(publication, { photo: photos }), {
      url: "https://website.example/path/to/foo.jpg",
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

  describe("getPostProperties", () => {
    let client;
    let mongoServer;
    let application;
    let uid;

    before(async () => {
      ({ client, mongoServer } = await testDatabase());
      const posts = client.db().collection("posts");
      application = { collections: new Map([["posts", posts]]) };
      ({ insertedId: uid } = await posts.insertOne({ ...postData }));
    });

    it("Gets post properties by ID", async () => {
      const result = await getPostProperties(uid.toString(), application);

      assert.equal(result.name, "note");
      assert.equal(result.uid, uid.toString());
    });

    it("Returns false if no post with ID", async () => {
      const result = await getPostProperties(
        "000000000000000000000000",
        application,
      );

      assert.equal(result, false);
    });

    it("Returns false if ID is not an ObjectId", async () => {
      const result = await getPostProperties("123", application);

      assert.equal(result, false);
    });

    it("Returns false if no database", async () => {
      const result = await getPostProperties(uid.toString(), {});

      assert.equal(result, false);
    });

    after(async () => {
      await client.close();
      await mongoServer.stop();
    });
  });

  it("Gets post URL", () => {
    assert.equal(
      getPostUrl("aHR0cHM6Ly93ZWJzaXRlLmV4YW1wbGUvZm9vYmFy"),
      "https://website.example/foobar",
    );
  });

  it("Gets syndication target `items` for checkboxes component", () => {
    const result = getSyndicateToItems(publication, true);

    assert.equal(result.length, 2);
    assert.equal(result[0].checked, true);
    assert.equal(result[0].hint, "https://mastodon.example/@username");
    assert.equal(result[0].label, "Mastodon");
    assert.equal(result[0].value, "https://mastodon.example/@username");
    assert.equal(result[1].checked, undefined);
    assert.equal(result[1].hint, "Secret key required");
    assert.equal(result[1].label, "Internet Archive");
    assert.equal(result[1].value, undefined);
  });
});
