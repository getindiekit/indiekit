import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-media");

test("Returns 403 error token has insufficient scope", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth(testToken({ scope: "foo" }), { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  t.is(result.status, 403);
  t.is(
    result.body.error_description,
    "The request requires higher privileges than provided by the access token"
  );

  server.close(t);
});
