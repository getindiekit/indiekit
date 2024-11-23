import { strict as assert } from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import { testConfig } from "@indiekit-test/config";
import { testDatabase } from "@indiekit-test/database";
import { getFixture } from "@indiekit-test/fixtures";
import { mediaData } from "../../lib/media-data.js";

describe("endpoint-media/lib/media-data", async () => {
  let application;
  let publication;
  const { client, database, mongoServer } = await testDatabase();
  const media = database.collection("media");
  const file = {
    data: getFixture("file-types/photo.jpg", false),
    name: "photo.jpg",
  };
  const url = "https://website.example/photo.jpg";

  before(() => {
    mock.method(console, "info", () => {});
    mock.method(console, "warn", () => {});
  });

  beforeEach(async () => {
    await media.insertOne({
      path: "photo.jpg",
      properties: {
        "media-type": "photo",
        url,
      },
    });

    const config = await testConfig({ usePostTypes: true });

    application = { media };
    publication = config.publication;
  });

  after(() => {
    client.close();
    mongoServer.stop();
  });

  it("Creates media data", async () => {
    const result = await mediaData.create(application, publication, file);

    assert.match(result.path, /\b\w{5}\b/g);
    assert.equal(result.properties["media-type"], "photo");
  });

  it("Throws error creating media data for unsupported media type", async () => {
    const file = {
      data: getFixture("file-types/font.ttf", false),
      name: "font.ttf",
    };

    await assert.rejects(mediaData.create(application, publication, file), {
      message: "font",
    });
  });

  it("Throws error creating media data for non-configured media type", async () => {
    publication.postTypes = {};

    await assert.rejects(mediaData.create(application, publication, file), {
      message: "photo",
    });
  });

  it("Reads media data", async () => {
    const result = await mediaData.read(application, url);

    assert.equal(result.properties["media-type"], "photo");
    assert.equal(result.properties.url, "https://website.example/photo.jpg");
  });

  it("Deletes media data", async () => {
    assert.equal(await mediaData.delete(application, url), true);
  });

  it("Throws error deleting media data", async () => {
    await assert.rejects(mediaData.delete(application, ""), {
      message: "No media data to delete",
    });
  });
});
