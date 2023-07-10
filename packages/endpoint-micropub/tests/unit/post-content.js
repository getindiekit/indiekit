import test from "ava";
import sinon from "sinon";
import { mockAgent } from "@indiekit-test/mock-agent";
import { publication } from "@indiekit-test/publication";
import { deletedPostData, postData } from "@indiekit-test/post-data";
import { postContent } from "../../lib/post-content.js";

await mockAgent("endpoint-micropub");

test.before(() => {
  sinon.stub(console, "info"); // Disable console.info
  sinon.stub(console, "warn"); // Disable console.warn
});

test.beforeEach((t) => {
  t.context.url = "https://website.example/foo";
});

test("Creates a post", async (t) => {
  const result = await postContent.create(publication, postData);

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
  await t.throwsAsync(postContent.create(false, postData), {
    message: "postTemplate is not a function",
  });
});

test("Updates a post", async (t) => {
  const result = await postContent.update(publication, postData, t.context.url);

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
  await t.throwsAsync(postContent.update(false, postData, t.context.url), {
    message: "postTemplate is not a function",
  });
});

test("Deletes a post", async (t) => {
  const result = await postContent.delete(publication, postData);

  t.deepEqual(result, {
    status: 200,
    json: {
      success: "delete",
      success_description: "Post deleted from https://website.example/foo",
    },
  });
});

test("Throws error deleting a post", async (t) => {
  await t.throwsAsync(postContent.delete(false, postData), {
    message: "postTemplate is not a function",
  });
});

test("Undeletes a post", async (t) => {
  const result = await postContent.undelete(publication, deletedPostData);

  t.deepEqual(result, {
    location: "https://website.example/foo",
    status: 200,
    json: {
      success: "delete_undelete",
      success_description: "Post restored to https://website.example/foo",
    },
  });
});

test("Throws error undeleting a post", async (t) => {
  await t.throwsAsync(postContent.undelete(false, postData), {
    message: "postTemplate is not a function",
  });
});
