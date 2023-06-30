import test from "ava";
import dateFns from "date-fns";
import { getFixture } from "@indiekit-test/fixtures";
import { getFileProperties, getMediaType } from "../../lib/file.js";

const { isValid, parseISO } = dateFns;

test("Derives media type and returns equivalent post type", async (t) => {
  const audio = { data: getFixture("file-types/audio.mp3", null) };
  const photo = { data: getFixture("file-types/photo.jpg", null) };
  const video = { data: getFixture("file-types/video.mp4", null) };
  const other = { data: getFixture("file-types/font.ttf", null) };

  t.is(await getMediaType(audio), "audio");
  t.is(await getMediaType(photo), "photo");
  t.is(await getMediaType(video), "video");
  t.is(await getMediaType(other), "font");
});

test("Derives properties from file data", async (t) => {
  const file = {
    data: getFixture("file-types/photo.jpg", null),
    name: "photo.jpg",
  };
  const result = await getFileProperties("UTC", file);

  t.is(result.originalname, "photo.jpg");
  t.is(result.ext, "jpg");
  t.regex(result.filename, /[\d\w]{5}.jpg/g);
  t.true(isValid(parseISO(result.published)));
});
