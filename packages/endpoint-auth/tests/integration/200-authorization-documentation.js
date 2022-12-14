import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns service documentation if no authorization query", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request.get("/auth");
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector("title").textContent;

  t.is(result, "Using this IndieAuth endpoint - Test configuration");

  server.close(t);
});
