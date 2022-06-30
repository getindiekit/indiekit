import process from "node:process";
import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Uploads file and redirects to files page", async (t) => {
  nock("https://token-endpoint.example").get("/").reply(200, {
    me: process.env.TEST_PUBLICATION_URL,
    scope: "create",
  });
  nock("https://api.github.com")
    .put((uri) => uri.includes(".jpg"))
    .reply(200, { commit: { message: "Message" } });

  // Upload file
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/files/new")
    .set("cookie", [cookie])
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  t.is(result.status, 302);

  server.close(t);
});
