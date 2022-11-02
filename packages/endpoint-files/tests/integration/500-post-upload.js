import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { setGlobalDispatcher } from "undici";
import { storeAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

setGlobalDispatcher(storeAgent());

test.failing("Returns 500 error uploading file", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/files/new")
    .set("cookie", [cookie])
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector(
    ".notification--error p"
  ).textContent;

  t.is(response.status, 500);
  t.is(result, "GitHub store: Something went wrong");

  server.close(t);
});
