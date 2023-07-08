import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns new password page with generated password secret", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/auth/new-password")
    .type("form")
    .send({ password: "foo" });
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.regex(result.querySelector("#secret").textContent, /^\$2[aby]\$.{56}$/);

  server.close(t);
});
