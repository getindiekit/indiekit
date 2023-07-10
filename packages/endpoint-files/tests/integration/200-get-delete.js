import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-media");

test("Gets delete confirmation page", async (t) => {
  // Upload file
  const server = await testServer();
  const request = supertest.agent(server);
  const uploadResponse = await request
    .post("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
  const id = Buffer.from(uploadResponse.headers.location).toString("base64url");

  // Request delete page
  const response = await request.get(`/files/${id}/delete`);
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector("title").textContent;

  t.is(
    result,
    "Are you sure you want to delete this file? - Test configuration"
  );

  server.close(t);
});
