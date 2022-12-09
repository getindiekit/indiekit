import test from "ava";
import {
  getPostName,
  getPostTypeConfig,
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
  };
});

test("Gets post name", (t) => {
  const post = {
    name: "My favourite sandwich",
  };
  t.is(getPostName(post, t.context.publication), "My favourite sandwich");
});

test("Gets post type name", (t) => {
  const post = {
    "post-type": "article",
  };
  t.is(getPostName(post, t.context.publication), "Journal entry");
});

test("Gets post type config", (t) => {
  const result = getPostTypeConfig("note", [
    {
      type: "note",
      name: "Custom note post type",
    },
  ]);

  t.is(result.name, "Custom note post type");
});

test("Get syndication target `items` for checkboxes component", (t) => {
  const result = getSyndicateToItems({
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
  });

  t.is(result.length, 1);
  t.true(result[0].checked);
  t.is(result[0].value, "https://twitter.com/username");
  t.is(result[0].text, "Twitter");
  t.is(result[0].hint.text, "https://twitter.com/username");
});

test("Get visibility `items` for radios component", (t) => {
  const response = { __: (value) => value };
  const result = getVisibilityItems(response, {
    visibility: "public",
  });

  t.is(result.length, 4);
  t.is(result[0].value, "_ignore");
  t.is(result[0].text, "posts.create.visibility._ignore");
  t.true(result[1].checked);
});
