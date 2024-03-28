import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { isValid, parseISO } from "date-fns";
import { getFixture } from "@indiekit-test/fixtures";
import { getFileProperties, getMediaType } from "../../lib/file.js";

describe("endpoint-media/lib/file", () => {
  it("Derives media type and returns equivalent post type", async () => {
    const audio = { data: getFixture("file-types/audio.mp3", false) };
    const photo = { data: getFixture("file-types/photo.jpg", false) };
    const video = { data: getFixture("file-types/video.mp4", false) };
    const other = { data: getFixture("file-types/font.ttf", false) };

    assert.equal(await getMediaType(audio), "audio");
    assert.equal(await getMediaType(photo), "photo");
    assert.equal(await getMediaType(video), "video");
    assert.equal(await getMediaType(other), "font");
  });

  it("Derives properties from file data", async () => {
    const file = {
      data: getFixture("file-types/photo.jpg", false),
      name: "photo.jpg",
      md5: "be7d321488de26f2eb38834af7162164",
    };
    const result = await getFileProperties("UTC", file);

    assert.equal(result.ext, "jpg");
    assert.equal(result.filename, "photo.jpg");
    assert.equal(result.md5, "be7d321488de26f2eb38834af7162164");
    assert.equal(isValid(parseISO(result.published)), true);
  });
});
