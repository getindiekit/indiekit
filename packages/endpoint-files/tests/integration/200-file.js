import process from "node:process";
import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { setGlobalDispatcher } from "undici";
import { storeAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(storeAgent());

test("Returns previously uploaded file", async (t) => {
  // Upload file
  const server = await testServer();
  const request = supertest.agent(server);
  await request
    .post("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  // Get file data by parsing list of files and getting values from link
  const filesResponse = await request.get("/files");
  const filesDom = new JSDOM(filesResponse.text);
  const fileLink = filesDom.window.document.querySelector(".file-grid li a");
  const fileName = fileLink.querySelector("img").alt;
  const fileId = fileLink.href.split("/").pop();

  // Visit file page
  const fileResponse = await request.get(`/files/${fileId}`);
  const fileDom = new JSDOM(fileResponse.text);
  const result = fileDom.window.document.querySelector("title").textContent;

  t.is(result, `${fileName} - Test configuration`);

  server.close(t);
});
