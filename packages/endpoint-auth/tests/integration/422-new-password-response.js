import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns 422 error missing new password", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request.post("/auth/new-password");
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(response.status, 422);
  t.is(
    result.querySelector("title").textContent,
    "Error: New password - Test configuration"
  );
  t.is(
    result.querySelector("#password-error .error-message__text").textContent,
    "Enter a password"
  );

  server.close(t);
});
