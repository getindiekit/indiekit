import process from "node:process";
import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";

test("Uploads file", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes(".jpg"))
    .reply(200, { commit: { message: "Message" } });

  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  t.is(result.status, 201);
  t.regex(result.headers.location, /\b.jpg\b/);
  t.regex(result.body.success_description, /\bMedia uploaded\b/);

  server.close(t);
});
