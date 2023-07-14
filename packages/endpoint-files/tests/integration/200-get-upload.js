import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Returns upload new file page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/files/upload")
    .set("cookie", [testCookie()]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector("title").textContent;

  t.is(result, "Upload a new file - Test configuration");

  server.close(t);
});
