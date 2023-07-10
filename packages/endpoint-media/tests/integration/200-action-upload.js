import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-media");

test("Uploads file", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  t.is(result.status, 201);
  t.regex(result.headers.location, /\b.jpg\b/);
  t.regex(result.body.success_description, /\bMedia uploaded\b/);

  server.close(t);
});
