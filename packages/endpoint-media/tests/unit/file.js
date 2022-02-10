import test from "ava";
import dateFns from "date-fns";
import { getFixture } from "@indiekit-test/get-fixture";
import { getFileProperties, getMediaType } from "../../lib/file.js";

const { isValid, parseISO } = dateFns;

test("Derives media type and returns equivalent post type)", async (t) => {
  const audio = { buffer: getFixture("file-types/audio.mp3", false) };
  const photo = { buffer: getFixture("file-types/photo.jpg", false) };
  const video = { buffer: getFixture("file-types/video.mp4", false) };
  const other = { buffer: getFixture("file-types/font.ttf", false) };

  t.is(await getMediaType(audio), "audio");
  t.is(await getMediaType(photo), "photo");
  t.is(await getMediaType(video), "video");
  t.is(await getMediaType(other), null);
});

test("Derives properties from file data", async (t) => {
  const publication = { timeZone: "UTC" };
  const file = {
    buffer: getFixture("file-types/photo.jpg", false),
    originalname: "photo.jpg",
  };

  const result = await getFileProperties(publication, file);

  t.is(result.originalname, "photo.jpg");
  t.is(result.ext, "jpg");
  t.regex(result.filename, /[\d\w]{5}.jpg/g);
  t.true(isValid(parseISO(result.published)));
});
