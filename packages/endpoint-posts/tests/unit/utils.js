import test from "ava";
import {
  getLocationProperty,
  getPostName,
  getPostStatusBadges,
  getPostTypeName,
  getPostUrl,
  getSyndicateToItems,
} from "../../lib/utils.js";

test.beforeEach((t) => {
  t.context = {
    publication: {
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
    },
    response: {
      locals: { __: (value) => value },
    },
  };
});

test("Gets location property", (t) => {
  t.deepEqual(getLocationProperty("12.3456, -65.4321"), {
    type: "geo",
    latitude: "12.3456",
    longitude: "-65.4321",
    name: "12° 20′ 44.16″ N 65° 25′ 55.56″ W",
  });
});

test("Gets post name", (t) => {
  const post = { name: "My favourite sandwich" };

  t.is(getPostName(t.context.publication, post), "My favourite sandwich");
});

test("Gets post type name as fallback for post name", (t) => {
  const post = { "post-type": "article" };

  t.is(getPostName(t.context.publication, post), "Journal entry");
});

test("Gets post status badges", (t) => {
  const post = {
    deleted: true,
    "post-status": "unlisted",
  };

  t.deepEqual(getPostStatusBadges(post, t.context.response), [
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

test("Gets post type name (or an empty string)", (t) => {
  t.is(getPostTypeName(t.context.publication, "article"), "Journal entry");
  t.is(getPostTypeName(t.context.publication), "");
});

test("Gets post URL", (t) => {
  t.is(
    getPostUrl("aHR0cHM6Ly93ZWJzaXRlLmV4YW1wbGUvZm9vYmFy"),
    "https://website.example/foobar",
  );
});

test("Gets syndication target `items` for checkboxes component", (t) => {
  const post = { "mp-syndicate-to": "https://mastodon.example/@username" };
  const result = getSyndicateToItems(t.context.publication, post);

  t.is(result.length, 1);
  t.true(result[0].checked);
  t.is(result[0].hint, "https://mastodon.example/@username");
  t.is(result[0].label, "Mastodon");
  t.is(result[0].value, "https://mastodon.example/@username");
});
