import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Returns share page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request.get("/share").set("cookie", [testCookie()]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector("title").textContent;

  t.is(result, "Share - Test configuration");

  server.close(t);
});
