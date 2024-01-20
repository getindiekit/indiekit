import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { getPostTypes } from "../../lib/post-types.js";

const postTypes = [
  {
    type: "article",
    name: "Journal post",
  },
  {
    type: "note",
    name: "Micro post",
  },
  {
    type: "puppy",
    name: "Puppy post",
  },
];

describe("preset-hugo/lib/post-types", () => {
  it("Gets paths and URLs for configured post types", () => {
    assert.deepEqual(getPostTypes(postTypes), [
      {
        type: "article",
        post: {
          path: "content/articles/{slug}.md",
          url: "articles/{slug}",
        },
        media: {
          path: "static/articles/{filename}",
          url: "articles/{filename}",
        },
      },
      {
        type: "note",
        post: {
          path: "content/notes/{slug}.md",
          url: "notes/{slug}",
        },
        media: {
          path: "static/notes/{filename}",
          url: "notes/{filename}",
        },
      },
      {
        type: "puppy",
        post: {
          path: "content/puppies/{slug}.md",
          url: "puppies/{slug}",
        },
        media: {
          path: "static/puppies/{filename}",
          url: "puppies/{filename}",
        },
      },
    ]);
  });
});
