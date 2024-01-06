import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/fixtures";
import { testToken } from "@indiekit-test/token";
import { uploadMedia } from "../../lib/media.js";

await mockAgent("endpoint-micropub");
const files = {
  photo: {
    data: getFixture("file-types/photo.jpg", false),
    name: "photo",
    originalname: "photo1.jpg",
  },
};
const mediaEndpoint = "https://media-endpoint.example";
const token = testToken();

describe("endpoint-micropub/lib/media", () => {
  let properties;

  beforeEach(() => {
    properties = {
      type: "entry",
      content: ["I ate a cheese sandwich, which was nice."],
      audio: ["https://website.example/media/sound.mp3"],
    };
  });

  it("Uploads attached file via media endpoint", async () => {
    const result = await uploadMedia(mediaEndpoint, token, properties, files);

    assert.deepEqual(result.photo, [
      "https://website.example/media/photo1.jpg",
    ]);
  });

  it("Uploads attached files via media endpoint", async () => {
    const files = {
      photo: [
        { data: getFixture("file-types/photo.jpg"), name: "photo2.jpg" },
        { buffer: getFixture("file-types/photo.jpg"), name: "photo3.jpg" },
      ],
    };
    const result = await uploadMedia(mediaEndpoint, token, properties, files);

    assert.deepEqual(result.photo, [
      "https://website.example/media/photo2.jpg",
      "https://website.example/media/photo3.jpg",
    ]);
  });

  it("Throws error no media endpoint URL", async () => {
    await assert.rejects(uploadMedia(undefined, token, properties, files), {
      message: "Failed to parse URL from undefined",
    });
  });

  it("Throws error uploading attached file", async () => {
    await assert.rejects(
      uploadMedia(mediaEndpoint, "foobar", properties, files),
      {
        message: "The token provided was malformed",
      },
    );
  });
});
