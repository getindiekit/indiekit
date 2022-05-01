import process from "node:process";
import test from "ava";
import nock from "nock";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns share page", async (t) => {
  nock("https://tokens.indieauth.com").get("/token").reply(200, {
    me: process.env.TEST_PUBLICATION_URL,
    scope: "create",
  });
  const request = await testServer();
  const response = await request
    .get("/share")
    .auth(process.env.TEST_TOKEN, { type: "bearer" });
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(result.querySelector("title").textContent, "Share - Test configuration");
});
