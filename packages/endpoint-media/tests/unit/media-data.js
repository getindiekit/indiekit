import test from "ava";
import { getFixture } from "@indiekit-test/fixtures";
import JekyllPreset from "@indiekit/preset-jekyll";
import { mediaData } from "../../lib/media-data.js";

test.beforeEach((t) => {
  t.context = {
    file: {
      data: getFixture("file-types/photo.jpg", false),
      name: "photo.jpg",
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

test("Throws error creating media data for unsupported media type", async (t) => {
  const file = {
    data: getFixture("file-types/font.ttf", false),
    name: "font.ttf",
  };

  await t.throwsAsync(mediaData.create(t.context.publication, file), {
    message: "font",
  });
});

test("Throws error creating media data for non-configured media type", async (t) => {
  t.context.publication.postTypes = [];

  await t.throwsAsync(mediaData.create(t.context.publication, t.context.file), {
    message: "photo",
  });
});
