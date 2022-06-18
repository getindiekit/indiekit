import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns installed plugin detail page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/plugins/endpoint-micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" });
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Micropub endpoint - Test configuration"
  );

  server.close(t);
});
