import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-media");

test("Returns uploaded file", async (t) => {
  // Upload file
  const server = await testServer();
  const request = supertest.agent(server);
  await request
    .post("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  // Get file data by parsing list of files and getting values from link
  const filesResponse = await request.get("/files");
  const filesDom = new JSDOM(filesResponse.text);
  const fileLink = filesDom.window.document.querySelector(".card-grid li a");
  const fileName = fileLink.textContent;
  const fileId = fileLink.href.split("/").pop();

  // Visit file page
  const fileResponse = await request.get(`/files/${fileId}`);
  const fileDom = new JSDOM(fileResponse.text);
  const result = fileDom.window.document.querySelector("title").textContent;

  t.is(result, `${fileName} - Test configuration`);

  server.close(t);
});
