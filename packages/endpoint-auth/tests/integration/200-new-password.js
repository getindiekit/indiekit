import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns new password page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request.get("/auth/new-password");
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "New password - Test configuration"
  );

  server.close(t);
});
