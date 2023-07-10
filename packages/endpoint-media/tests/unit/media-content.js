import test from "ava";
import sinon from "sinon";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/fixtures";
import { mediaData } from "@indiekit-test/media-data";
import { publication } from "@indiekit-test/publication";
import { mediaContent } from "../../lib/media-content.js";

await mockAgent("endpoint-media");

test.before(() => {
  sinon.stub(console, "info"); // Disable console.info
  sinon.stub(console, "warn"); // Disable console.warn
});

test.beforeEach((t) => {
  t.context.file = {
    data: getFixture("file-types/photo.jpg", false),
    name: "photo.jpg",
  };
});

test("Uploads a file", async (t) => {
  const result = await mediaContent.upload(
    publication,
    mediaData,
    t.context.file
  );

  t.deepEqual(result, {
    location: "https://website.example/photo.jpg",
    status: 201,
    json: {
      success: "create",
      success_description:
        "Media uploaded to https://website.example/photo.jpg",
    },
  });
});

test("Throws error uploading a file", async (t) => {
  await t.throwsAsync(mediaContent.upload(false, mediaData, t.context.file), {
    message: "storeMessageTemplate is not a function",
  });
});
