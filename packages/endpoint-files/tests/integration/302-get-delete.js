import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-media");

test("Redirects to file page if no delete permissions", async (t) => {
  const cookie = testCookie({ scope: "media" });

  // Upload file
  const server = await testServer();
  const request = supertest.agent(server);
  const uploadResponse = await request
    .post("/media")
    .set("accept", "application/json")
    .set("cookie", [cookie])
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
  const id = Buffer.from(uploadResponse.headers.location).toString("base64url");

  // Request delete page
  const result = await request
    .get(`/files/${id}/delete`)
    .set("cookie", [cookie]);

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/files\/(.*)/);

  server.close(t);
});
