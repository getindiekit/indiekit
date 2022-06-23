import test from "ava";
import { getFixture } from "@indiekit-test/fixtures";
import { JekyllPreset } from "@indiekit/preset-jekyll";
import { mediaData } from "../../lib/media-data.js";

test.beforeEach((t) => {
  t.context = {
    file: {
      buffer: getFixture("file-types/photo.jpg", false),
      originalname: "photo.jpg",
    },
    publication: {
      me: "https://website.example",
      postTypes: new JekyllPreset().postTypes,
      media: {
        async findOne(url) {
          if (url["properties.url"] === "https://website.example/photo.jpg") {
            return {
              path: "photo.jpg",
              properties: {
                "post-type": "photo",
                url,
              },
            };
          }
        },
      },
    },
    url: "https://website.example/photo.jpg",
  };
});

test("Creates media data", async (t) => {
  const result = await mediaData.create(t.context.publication, t.context.file);

  t.regex(result.path, /\b[\d\w]{5}\b/g);
  t.is(result.properties["post-type"], "photo");
});

test("Throws error creating media data without publication configuration", async (t) => {
  await t.throwsAsync(mediaData.create(false, t.context.file), {
    name: "IndiekitError",
    message: "No publication configuration provided",
  });
});

test("Throws error creating media data without a file", async (t) => {
  await t.throwsAsync(mediaData.create(t.context.publication, false), {
    message: "No file included in request",
  });
});

test("Throws error creating media data for unsupported media type", async (t) => {
  const file = {
    buffer: getFixture("file-types/font.ttf", false),
    originalname: "font.ttf",
  };

  await t.throwsAsync(mediaData.create(t.context.publication, file), {
    message: "Micropub does not support the font media type.",
  });
});

test("Throws error creating media data for non-configured media type", async (t) => {
  t.context.publication.postTypes = [];

  await t.throwsAsync(mediaData.create(t.context.publication, t.context.file), {
    message:
      "No configuration found for photo post type. See https://getindiekit.com/customisation/post-types/",
  });
});

test("Reads media data", async (t) => {
  const result = await mediaData.read(t.context.publication, t.context.url);

  t.is(result.properties["post-type"], "photo");
});

test("Throws error reading media data without publication configuration", async (t) => {
  await t.throwsAsync(mediaData.read(false, t.context.url), {
    name: "IndiekitError",
    message: "No publication configuration provided",
  });
});

test("Throws error reading media data without URL", async (t) => {
  await t.throwsAsync(mediaData.read(t.context.publication, false), {
    message: "No URL provided",
  });
});
