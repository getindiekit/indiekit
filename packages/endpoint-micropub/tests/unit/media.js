import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/fixtures";
import { testToken } from "@indiekit-test/token";
import { uploadMedia } from "../../lib/media.js";

await mockAgent("endpoint-micropub");

test.beforeEach((t) => {
  t.context = {
    bearerToken: testToken(),
    files: {
      photo: {
        data: getFixture("file-types/photo.jpg", false),
        name: "photo",
        originalname: "photo1.jpg",
      },
    },
    mediaEndpoint: "https://media-endpoint.example",
    properties: {
      type: "entry",
      content: ["I ate a cheese sandwich, which was nice."],
      category: ["foo", "bar"],
      audio: ["https://website.example/media/sound.mp3"],
    },
  };
});

test("Uploads attached file via media endpoint", async (t) => {
  const { bearerToken, mediaEndpoint, properties, files } = t.context;
  const result = await uploadMedia(
    mediaEndpoint,
    bearerToken,
    properties,
    files
  );

  t.deepEqual(result.photo, ["https://website.example/media/photo1.jpg"]);
});

test("Uploads attached files via media endpoint", async (t) => {
  const { bearerToken, mediaEndpoint, properties } = t.context;
  const files = {
    photo: [
      {
        data: getFixture("file-types/photo.jpg"),
        name: "photo2.jpg",
      },
      {
        buffer: getFixture("file-types/photo.jpg"),
        name: "photo3.jpg",
      },
    ],
  };
  const result = await uploadMedia(
    mediaEndpoint,
    bearerToken,
    properties,
    files
  );

  t.deepEqual(result.photo, [
    "https://website.example/media/photo2.jpg",
    "https://website.example/media/photo3.jpg",
  ]);
});

test("Throws error no media endpoint URL", async (t) => {
  const { bearerToken, properties, files } = t.context;

  await t.throwsAsync(uploadMedia(undefined, bearerToken, properties, files), {
    message: "Failed to parse URL from undefined",
  });
});

test("Throws error uploading attached file", async (t) => {
  const { mediaEndpoint, properties, files } = t.context;

  await t.throwsAsync(uploadMedia(mediaEndpoint, "foobar", properties, files), {
    message: "The token provided was malformed",
  });
});
