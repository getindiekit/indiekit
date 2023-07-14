import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { getFileId } from "../../lib/utils.js";

await mockAgent("endpoint-files");

test("Returns uploaded file", async (t) => {
  const id = getFileId("https://website.example/photo.jpg");
  const server = await testServer({
    application: { mediaEndpoint: "https://media-endpoint.example" },
  });
  const request = supertest.agent(server);
  const response = await request
    .get(`/files/${id}`)
    .set("cookie", [testCookie()]);
  const fileDom = new JSDOM(response.text);
  const result = fileDom.window.document.querySelector("title").textContent;

  t.is(result, `photo.jpg - Test configuration`);

  server.close(t);
});
