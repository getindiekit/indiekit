import test from "ava";
import { getPostName } from "../../lib/utils.js";

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
