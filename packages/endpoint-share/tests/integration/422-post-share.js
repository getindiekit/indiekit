import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Returns 422 error invalid form submission", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request.post("/share").set("cookie", [testCookie()]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(response.status, 422);
  t.is(
    result.querySelector("title").textContent,
    "Error: Share - Test configuration"
  );
  t.is(
    result.querySelector("#name-error .error-message__text").textContent,
    "Enter a title"
  );
  t.is(
    result.querySelector("#bookmark-of-error .error-message__text").textContent,
    "Invalid value"
  );

  server.close(t);
});
