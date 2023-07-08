import test from "ava";
import sinon from "sinon";
import { getFixture } from "@indiekit-test/fixtures";
import JekyllPreset from "@indiekit/preset-jekyll";
import { mediaData } from "../../lib/media-data.js";

test.before(() => {
  sinon.stub(console, "info"); // Disable console.info
  sinon.stub(console, "warn"); // Disable console.warn
});

test.beforeEach((t) => {
  const mediaUrl = "https://website.example/photo.jpg";

  t.context = {
    file: {
      data: getFixture("file-types/photo.jpg", false),
      name: "photo.jpg",
    },
    application: {
      media: {
        async deleteOne(url) {
          if (url["properties.url"] === mediaUrl) {
            return { deletedCount: 1 };
          }
        },
        async findOne(url) {
          if (url["properties.url"] === mediaUrl) {
            return {
              path: "photo.jpg",
              properties: {
                "media-type": "photo",
                url: url["properties.url"],
              },
            };
          }
        },
        async insertOne() {},
      },
    },
    publication: {
      me: "https://website.example",
      postTypes: new JekyllPreset().postTypes,
    },
    url: mediaUrl,
  };
});

test("Creates media data", async (t) => {
  const result = await mediaData.create(
    t.context.application,
    t.context.publication,
    t.context.file
  );

  t.regex(result.path, /\b\w{5}\b/g);
  t.is(result.properties["media-type"], "photo");
});

test("Throws error creating media data for unsupported media type", async (t) => {
  const file = {
    data: getFixture("file-types/font.ttf", false),
    name: "font.ttf",
  };

  await t.throwsAsync(
    mediaData.create(t.context.application, t.context.publication, file),
    {
      message: "font",
    }
  );
});

test("Throws error creating media data for non-configured media type", async (t) => {
  t.context.publication.postTypes = [];

  await t.throwsAsync(
    mediaData.create(
      t.context.application,
      t.context.publication,
      t.context.file
    ),
    {
      message: "photo",
    }
  );
});

test("Reads media data", async (t) => {
  const result = await mediaData.read(t.context.application, t.context.url);

  t.is(result.properties["media-type"], "photo");
  t.is(result.properties.url, "https://website.example/photo.jpg");
});

test("Deletes media data", async (t) => {
  t.true(await mediaData.delete(t.context.application, t.context.url));
});

test("Throws error deleting media data", async (t) => {
  await t.throwsAsync(mediaData.delete(t.context.application, ""), {
    message: "No media data to delete",
  });
});
