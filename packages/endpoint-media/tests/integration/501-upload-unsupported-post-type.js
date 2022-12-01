import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 501 error unsupported post type", async (t) => {
  const server = await testServer({ usePreset: false });
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  t.is(result.status, 501);
  t.is(
    result.body.error_description,
    "No configuration provided for photo post type"
  );
  t.is(
    result.body.error_uri,
    "https://getindiekit.com/configuration/post-types"
  );

  server.close(t);
});
