import { strict as assert } from "node:assert";
import { before, describe, it, mock } from "node:test";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/fixtures";
import { mediaData } from "@indiekit-test/media-data";
import { publication } from "@indiekit-test/publication";
import { mediaContent } from "../../lib/media-content.js";

await mockAgent("endpoint-media");

const file = {
  data: getFixture("file-types/photo.jpg", false),
  name: "photo.jpg",
};

describe("endpoint-media/lib/media-content", () => {
  before(() => {
    mock.method(console, "info", () => {});
    mock.method(console, "warn", () => {});
  });

  it("Uploads a file", async () => {
    const result = await mediaContent.upload(publication, mediaData, file);

    assert.deepEqual(result, {
      location: "https://website.example/photo.jpg",
      status: 201,
      json: {
        success: "create",
        success_description:
          "Media uploaded to https://website.example/photo.jpg",
      },
    });
  });

  it("Throws error uploading a file", async () => {
    await assert.rejects(mediaContent.upload(false, mediaData, file), {
      message: "storeMessageTemplate is not a function",
    });
  });
});
