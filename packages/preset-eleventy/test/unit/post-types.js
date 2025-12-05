import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getPostTypes } from "../../lib/post-types.js";

const postTypes = new Map([
  ["article", { name: "Journal post" }],
  ["note", { name: "Micro post" }],
  ["puppy", { name: "Puppy post" }],
]);

describe("preset-eleventy/lib/post-types", () => {
  it("Gets paths and URLs for configured post types", () => {
    const result = getPostTypes(postTypes);

    assert.deepEqual(result.get("article"), {
      name: "Journal post",
      post: {
        path: "articles/{yyyy}-{MM}-{dd}-{slug}.md",
        url: "articles/{yyyy}/{MM}/{dd}/{slug}",
      },
      media: {
        path: "media/articles/{yyyy}/{MM}/{dd}/{filename}",
      },
    });
    assert.deepEqual(result.get("note"), {
      name: "Micro post",
      post: {
        path: "notes/{yyyy}-{MM}-{dd}-{slug}.md",
        url: "notes/{yyyy}/{MM}/{dd}/{slug}",
      },
      media: {
        path: "media/notes/{yyyy}/{MM}/{dd}/{filename}",
      },
    });
    assert.deepEqual(result.get("puppy"), {
      name: "Puppy post",
      post: {
        path: "puppies/{yyyy}-{MM}-{dd}-{slug}.md",
        url: "puppies/{yyyy}/{MM}/{dd}/{slug}",
      },
      media: {
        path: "media/puppies/{yyyy}/{MM}/{dd}/{filename}",
      },
    });
  });
});
