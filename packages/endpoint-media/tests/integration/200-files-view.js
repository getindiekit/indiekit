import process from "node:process";
import test from "ava";
import mockSession from "mock-session";
import nock from "nock";
import { getFixture } from "@indiekit-test/get-fixture";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Views previously uploaded file", async (t) => {
  nock("https://tokens.indieauth.com").get("/token").reply(200, {
    me: process.env.TEST_PUBLICATION_URL,
    scope: "media",
  });
  nock("https://api.github.com")
    .put((uri) => uri.includes(".jpg"))
    .reply(200, { commit: { message: "Message" } });

  // Upload file
  const request = await testServer();
  const cookie = mockSession("test", process.env.TEST_SESSION_SECRET, {
    token: process.env.TEST_BEARER_TOKEN,
  });
  await request
    .post("/media")
    .auth(process.env.TEST_BEARER_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .set("Cookie", [cookie])
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  // Get file data by parsing list of files and getting values from link
  const filesResponse = await request
    .get("/media/files")
    .set("Cookie", [cookie]);
  const filesDom = new JSDOM(filesResponse.text);
  const fileLink = filesDom.window.document.querySelector(".file a");
  const fileName = fileLink.textContent;
  const fileId = fileLink.href.split("/").pop();

  // Visit file page
  const fileResponse = await request
    .get(`/media/files/${fileId}`)
    .set("Cookie", [cookie]);
  const fileDom = new JSDOM(fileResponse.text);
  const result = fileDom.window.document;

  t.is(result.querySelector("title").textContent, `${fileName} - Test config`);
});
