import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";
import { describe, it } from "node:test";

import { getFixture } from "@indiekit-test/fixtures";
import { testPublication } from "@indiekit-test/publication";
import { isValid, parseISO } from "date-fns";

import { getFileProperties, getMediaType } from "../../lib/file.js";

describe("endpoint-media/lib/file", () => {
  it("Derives media type and returns equivalent post type", async () => {
    const audio = {
      data: getFixture("file-types/audio.mp3", false),
      name: "audio.mp3",
    };
    const photo = {
      data: getFixture("file-types/photo.jpg", false),
      name: "photo.jpg",
    };
    const video = {
      data: getFixture("file-types/video.mp4", false),
      name: "video.mp4",
    };
    const other = {
      data: getFixture("file-types/font.ttf", false),
      name: "font.ttf",
    };

    assert.equal(await getMediaType(audio), "audio");
    assert.equal(await getMediaType(photo), "photo");
    assert.equal(await getMediaType(video), "video");
    assert.equal(await getMediaType(other), "font");
  });

  it("Derives properties from file data", async () => {
    const publication = testPublication({
      slugSeparator: "-",
    });
    const file = {
      data: getFixture("file-types/photo.jpg", false),
      name: "Photo 1.jpeg",
      md5: "be7d321488de26f2eb38834af7162164",
    };
    const result = await getFileProperties(publication, file, "UTC");

    assert.equal(result.ext, "jpg");
    assert.equal(result.filename, "photo-1.jpg");
    assert.equal(result.md5, "be7d321488de26f2eb38834af7162164");
    assert.equal(isValid(parseISO(result.published)), true);
  });

  it("Derives file name using publication’s slug separator", async () => {
    const publication = testPublication({
      slugSeparator: "_",
    });
    const file = {
      data: getFixture("file-types/photo.jpg", false),
      name: "Photo 1.jpeg",
    };
    const result = await getFileProperties(publication, file, "UTC");

    assert.equal(result.filename, "photo_1.jpg");
  });

  it("Throws error if file type can’t be determined", async () => {
    const file = {
      data: Buffer.from("Plain text"),
      mimetype: "text/plain",
      name: "notes.txt",
    };

    await assert.rejects(getMediaType(file), {
      name: "UnsupportedMediaTypeError",
      message: "text/plain",
      status: 415,
    });
    const publication = testPublication({ slugSeparator: "-" });

    await assert.rejects(getFileProperties(publication, file, "UTC"), {
      name: "UnsupportedMediaTypeError",
    });
  });
});
