import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-media");

test("Deletes file", async (t) => {
  // Create post
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  // Delete post
  const result = await request
    .post("/media")
    .auth(testToken(), { type: "bearer" })
    .send({
      action: "delete",
      url: response.header.location,
    });

  t.is(result.status, 200);
  t.regex(result.body.success_description, /\bFile deleted\b/);

  server.close(t);
});
