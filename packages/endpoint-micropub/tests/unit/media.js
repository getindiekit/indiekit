import process from "node:process";
import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/fixtures";
import { uploadMedia } from "../../lib/media.js";

await mockAgent("media-endpoint");

test.beforeEach((t) => {
  t.context = {
    application: {
      mediaEndpoint: "https://media-endpoint.example",
    },
    bearerToken: process.env.TEST_TOKEN,
    files: {
      photo: {
        data: getFixture("file-types/photo.jpg", false),
        name: "photo",
        originalname: "photo1.jpg",
      },
    },
    properties: {
      type: "entry",
      content: ["I ate a cheese sandwich, which was nice."],
      category: ["foo", "bar"],
      audio: ["https://website.example/media/sound.mp3"],
    },
  };
});

test("Uploads attached file via media endpoint", async (t) => {
  const { bearerToken, application, properties, files } = t.context;
  const result = await uploadMedia(bearerToken, application, properties, files);

  t.deepEqual(result.photo, ["https://website.example/media/photo1.jpg"]);
});

test("Uploads attached files via media endpoint", async (t) => {
  const { bearerToken, application, properties } = t.context;
  const files = {
    photo: [
      {
        data: getFixture("file-types/photo.jpg", false),
        name: "photo2.jpg",
      },
      {
        buffer: getFixture("file-types/photo.jpg", false),
        name: "photo3.jpg",
      },
    ],
  };
  const result = await uploadMedia(bearerToken, application, properties, files);

  t.deepEqual(result.photo, [
    "https://website.example/media/photo2.jpg",
    "https://website.example/media/photo3.jpg",
  ]);
});

test("Throws error no media endpoint URL", async (t) => {
  const { bearerToken, properties, files } = t.context;

  await t.throwsAsync(uploadMedia(bearerToken, {}, properties, files), {
    message: "Failed to parse URL from undefined",
  });
});

test("Throws error uploading attached file", async (t) => {
  const { application, properties, files } = t.context;

  await t.throwsAsync(uploadMedia("foobar", application, properties, files), {
    message: "The token provided was malformed",
  });
});
