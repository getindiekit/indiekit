import test from "ava";
import nock from "nock";
import { publication } from "@indiekit-test/publication";
import { postData } from "@indiekit-test/post-data";
import { post } from "../../lib/post.js";

test.beforeEach((t) => {
  t.context.url = "https://website.example/foo";
});

test.serial("Creates a post", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foo.md"))
    .reply(200, { commit: { message: "Create post" } });

  const result = await post.create(publication, postData);

  t.deepEqual(result, {
    location: "https://website.example/foo",
    status: 202,
    json: {
      success: "create_pending",
      success_description:
        "Post will be created at https://website.example/foo",
    },
  });
});

test("Throws error creating a post", async (t) => {
  await t.throwsAsync(post.create(false, postData), {
    message: "postTemplate is not a function",
  });
});

test.serial("Updates a post", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foo.md"))
    .reply(200, { commit: { message: "Update post" } });

  const result = await post.update(publication, postData, t.context.url);

  t.deepEqual(result, {
    location: "https://website.example/foo",
    status: 200,
    json: {
      success: "update",
      success_description: "Post updated at https://website.example/foo",
    },
  });
});

test("Throws error updating a post", async (t) => {
  await t.throwsAsync(post.update(false, postData, t.context.url), {
    message: "postTemplate is not a function",
  });
});

test.serial("Deletes a post", async (t) => {
  nock("https://api.github.com")
    .get((uri) => uri.includes("foo.md"))
    .reply(200, {})
    .delete((uri) => uri.includes("foo.md"))
    .reply(200, { commit: { message: "Delete post" } });

  const result = await post.delete(publication, postData);

  t.deepEqual(result, {
    status: 200,
    json: {
      success: "delete",
      success_description: "Post deleted from https://website.example/foo",
    },
  });
});

test("Throws error deleting a post", async (t) => {
  await t.throwsAsync(post.delete(false, postData), {
    message: "storeMessageTemplate is not a function",
  });
});

test.serial("Undeletes a post", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foo.md"))
    .reply(200, { commit: { message: "Create post" } })
    .get((uri) => uri.includes("foo.md"))
    .reply(200, {})
    .delete((uri) => uri.includes("foo.md"))
    .reply(200, { commit: { message: "Delete post" } })
    .put((uri) => uri.includes("foo.md"))
    .reply(200, { commit: { message: "Undelete post" } });
  await post.create(publication, postData);
  await post.delete(publication, postData);

  const result = await post.undelete(publication, postData);

  t.deepEqual(result, {
    location: "https://website.example/foo",
    status: 200,
    json: {
      success: "delete_undelete",
      success_description: "Post undeleted from https://website.example/foo",
    },
  });
});

test("Throws error undeleting a post", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foo.md"))
    .reply(200, { commit: { message: "Create post" } })
    .get((uri) => uri.includes("foo.md"))
    .reply(200, {})
    .delete((uri) => uri.includes("foo.md"))
    .reply(200, { commit: { message: "Delete post" } })
    .put((uri) => uri.includes("foo.md"))
    .replyWithError("Not found");
  await post.create(publication, postData);
  await post.delete(publication, postData);

  await t.throwsAsync(post.undelete(publication, postData), {
    message: /\bNot found\b/,
  });
});

test("Throws error undeleting a post (no post previously deleted)", async (t) => {
  await t.throwsAsync(post.undelete(publication, false), {
    message: "Post was not previously deleted",
  });
});
