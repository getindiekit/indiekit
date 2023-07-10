import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-media");

test("Redirects to file page if no delete permissions", async (t) => {
  // Upload file
  const server = await testServer();
  const request = supertest.agent(server);
  const uploadResponse = await request
    .post("/media")
    .auth(testToken({ scope: "media" }), { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
  const id = Buffer.from(uploadResponse.headers.location).toString("base64url");

  // Request delete page
  const result = await request.get(`/files/${id}/delete`);

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/files\/(.*)/);

  server.close(t);
});
