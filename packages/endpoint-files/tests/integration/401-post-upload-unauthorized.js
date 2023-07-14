import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-files");

test("Returns 401 error uploading file", async (t) => {
  const server = await testServer({
    application: {
      mediaEndpoint: "https://401-post-upload-unauthorized.example",
    },
  });
  const request = supertest.agent(server);
  const response = await request
    .post("/files/upload")
    .set("cookie", [testCookie({ scope: "profile" })])
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector(
    ".notification--error p"
  ).textContent;

  t.is(response.status, 401);
  t.regex(result, /Unauthorized/);

  server.close(t);
});
