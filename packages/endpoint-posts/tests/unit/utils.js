import test from "ava";
import {
  getPostId,
  getPostName,
  getPostTypeName,
  getPostUrl,
  getRsvpItems,
  getSyndicateToItems,
  getVisibilityItems,
} from "../../lib/utils.js";

test.beforeEach((t) => {
  t.context.publication = {
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
            name: "Twitter",
          },
          uid: "https://twitter.com/username",
        },
        options: {
          checked: true,
        },
      },
    ],
  };
});

test("Gets post ID", (t) => {
  t.is(
    getPostId("https://website.example/foobar"),
    "aHR0cHM6Ly93ZWJzaXRlLmV4YW1wbGUvZm9vYmFy"
  );
});

test("Gets post name", (t) => {
  const post = { name: "My favourite sandwich" };

  t.is(getPostName(t.context.publication, post), "My favourite sandwich");
});

test("Gets post type name as fallback for post name", (t) => {
  const post = { "post-type": "article" };

  t.is(getPostName(t.context.publication, post), "Journal entry");
});

test("Gets post type name (or an empty string)", (t) => {
  t.is(getPostTypeName(t.context.publication, "article"), "Journal entry");
  t.is(getPostTypeName(t.context.publication, null), "");
});

test("Gets post URL", (t) => {
  t.is(
    getPostUrl("aHR0cHM6Ly93ZWJzaXRlLmV4YW1wbGUvZm9vYmFy"),
    "https://website.example/foobar"
  );
});

test("Gets RSVP `items` for radios component", (t) => {
  const response = { __: (value) => value };
  const result = getRsvpItems(response, {
    rsvp: "no",
  });

  t.is(result.length, 4);
  t.is(result[1].value, "no");
  t.is(result[1].text, "posts.form.rsvp.no");
  t.true(result[1].checked);
});

test("Gets syndication target `items` for checkboxes component", (t) => {
  const post = { "mp-syndicate-to": "https://twitter.com/username" };
  const result = getSyndicateToItems(t.context.publication, post);

  t.is(result.length, 1);
  t.true(result[0].checked);
  t.is(result[0].value, "https://twitter.com/username");
  t.is(result[0].text, "Twitter");
  t.is(result[0].hint.text, "https://twitter.com/username");
});

test("Gets visibility `items` for radios component", (t) => {
  const response = { __: (value) => value };
  const result = getVisibilityItems(response, {
    visibility: "public",
  });

  t.is(result.length, 4);
  t.is(result[0].value, "_ignore");
  t.is(result[0].text, "noValue");
  t.true(result[1].checked);
});
