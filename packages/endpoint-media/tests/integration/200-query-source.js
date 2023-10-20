import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns list of uploaded files", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);

  // Upload file
  await request
    .post("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  const result = await request
    .get("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .query({ q: "source" });

  t.truthy(result.body.items[0].uid);
  t.is(result.body.items[0]["content-type"], "image/jpeg");
  t.is(result.body.items[0]["media-type"], "photo");
  t.truthy(result.body.items[0].published);
  t.true(result.body.items[0].url.startsWith("https://website.example"));

  server.close(t);
});
