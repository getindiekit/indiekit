import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { deletedPostData, postData } from "@indiekit-test/post-data";
import { publication } from "@indiekit-test/publication";

import { postContent } from "../../lib/post-content.js";

await mockAgent("endpoint-micropub");
const url = "https://website.example/foo";

describe("endpoint-micropub/lib/post-content", () => {
  it("Creates a post", async () => {
    const result = await postContent.create(publication, postData);

    assert.deepEqual(result, {
      location: "https://website.example/foo",
      status: 202,
      json: {
        success: "create_pending",
        success_description:
          "Post will be created at https://website.example/foo",
      },
    });
  });

  it("Throws error creating a post", async () => {
    await assert.rejects(postContent.create(false, postData), {
      message: "postTemplate is not a function",
    });
  });

  it("Updates a post", async () => {
    const result = await postContent.update(publication, postData, url);

    assert.deepEqual(result, {
      location: "https://website.example/foo",
      status: 200,
      json: {
        success: "update",
        success_description: "Post updated at https://website.example/foo",
      },
    });
  });

  it("Throws error updating a post", async () => {
    await assert.rejects(postContent.update(false, postData, url), {
      message: "postTemplate is not a function",
    });
  });

  it("Deletes a post", async () => {
    const result = await postContent.delete(publication, postData);

    assert.deepEqual(result, {
      status: 200,
      json: {
        success: "delete",
        success_description: "Post deleted from https://website.example/foo",
      },
    });
  });

  it("Throws error deleting a post", async () => {
    await assert.rejects(postContent.delete(false, postData), {
      message: "storeMessageTemplate is not a function",
    });
  });

  it("Undeletes a post", async () => {
    const result = await postContent.undelete(publication, deletedPostData);

    assert.deepEqual(result, {
      location: "https://website.example/foo",
      status: 200,
      json: {
        success: "delete_undelete",
        success_description: "Post restored to https://website.example/foo",
      },
    });
  });

  it("Throws error undeleting a post", async () => {
    await assert.rejects(postContent.undelete(false, postData), {
      message: "postTemplate is not a function",
    });
  });
});
