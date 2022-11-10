import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { createPasswordHash } from "../../lib/password.js";

test("Returns new password page with generated password secret", async (t) => {
  const secret = createPasswordHash("foo");
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/auth/new-password")
    .type("form")
    .send({ password: "foo" });
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(result.querySelector("#secret").textContent, secret);

  server.close(t);
});
