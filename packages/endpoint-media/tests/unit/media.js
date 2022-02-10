import test from "ava";
import nock from "nock";
import { getFixture } from "@indiekit-test/get-fixture";
import { mediaData } from "@indiekit-test/media-data";
import { publication } from "@indiekit-test/publication";
import { media } from "../../lib/media.js";

test.beforeEach((t) => {
  t.context.file = {
    buffer: getFixture("file-types/photo.jpg", false),
    originalname: "photo.jpg",
  };
});

test("Uploads a file", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("photo.jpg"))
    .reply(200, { commit: { message: "Message" } });

  const result = await media.upload(publication, mediaData, t.context.file);

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
  nock("https://api.github.com")
    .put((uri) => uri.includes("photo.jpg"))
    .replyWithError("Not found");

  await t.throwsAsync(media.upload(publication, mediaData, t.context.file), {
    message: /\bNot found\b/,
  });
});
