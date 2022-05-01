import process from "node:process";
import test from "ava";
import nock from "nock";
import { getFixture } from "@indiekit-test/get-fixture";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Views previously uploaded file", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes(".jpg"))
    .reply(200, { commit: { message: "Message" } });

  // Upload file
  const request = await testServer();
  await request
    .post("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  // Get file data by parsing list of files and getting values from link
  const filesResponse = await request.get("/media/files");
  const filesDom = new JSDOM(filesResponse.text);
  const fileLink = filesDom.window.document.querySelector(".file-grid a");
  const fileName = fileLink.querySelector("img").alt;
  const fileId = fileLink.href.split("/").pop();

  // Visit file page
  const fileResponse = await request.get(`/media/files/${fileId}`);
  const fileDom = new JSDOM(fileResponse.text);
  const result = fileDom.window.document;

  t.is(
    result.querySelector("title").textContent,
    `${fileName} - Test configuration`
  );
});
