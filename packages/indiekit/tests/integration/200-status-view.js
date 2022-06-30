import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns status page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/status")
    .auth(process.env.TEST_TOKEN, { type: "bearer" });
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Server status - Test configuration"
  );

  server.close(t);
});
