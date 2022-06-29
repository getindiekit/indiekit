import process from "node:process";
import test from "ava";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";

test("Returns 501 error unsupported post type", async (t) => {
  const request = await testServer({
    usePreset: false,
  });

  const result = await request
    .post("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  t.is(result.status, 501);
  t.is(
    result.body.error_description,
    "No configuration provided for photo post type."
  );
  t.is(
    result.body.error_uri,
    "https://getindiekit.com/customisation/post-types/"
  );
});
