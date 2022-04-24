import process from "node:process";
import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import test from "ava";
import { setGlobalDispatcher } from "undici";
import { mediaEndpointAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/get-fixture";
import { uploadMedia } from "../../lib/media.js";

setGlobalDispatcher(mediaEndpointAgent());

test.beforeEach((t) => {
  t.context = {
    bearerToken: process.env.TEST_TOKEN,
    files: [
      {
        buffer: getFixture("file-types/photo.jpg", false),
        fieldname: "photo",
        originalname: "photo1.jpg",
      },
    ],
    publication: {
      mediaEndpoint: "https://media-endpoint.example",
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
  const { bearerToken, publication, properties, files } = t.context;
  const result = await uploadMedia(bearerToken, publication, properties, files);

  t.deepEqual(result.photo, ["https://website.example/media/photo1.jpg"]);
});

test("Uploads attached files via media endpoint", async (t) => {
  const { bearerToken, publication, properties } = t.context;
  const files = [
    {
      buffer: getFixture("file-types/photo.jpg", false),
      fieldname: "photo[]",
      originalname: "photo2.jpg",
    },
    {
      buffer: getFixture("file-types/photo.jpg", false),
      fieldname: "photo[]",
      originalname: "photo3.jpg",
    },
  ];
  const result = await uploadMedia(bearerToken, publication, properties, files);

  t.deepEqual(result.photo, [
    "https://website.example/media/photo2.jpg",
    "https://website.example/media/photo3.jpg",
  ]);
});

test("Throws error if no media endpoint URL", async (t) => {
  const { bearerToken, properties, files } = t.context;

  await t.throwsAsync(uploadMedia(bearerToken, {}, properties, files), {
    message: "Failed to parse URL from undefined",
  });
});

test("Throws error uploading attached file", async (t) => {
  const { publication, properties, files } = t.context;

  await t.throwsAsync(uploadMedia("foobar", publication, properties, files), {
    message: "The token provided was malformed",
  });
});
