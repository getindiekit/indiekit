import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Returns 422 error invalid form submission", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/files/upload")
    .set("cookie", [testCookie()]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(response.status, 422);
  t.is(
    result.querySelector("title").textContent,
    "Error: Upload a new file - Test configuration"
  );
  t.is(
    result.querySelector("#file-error .error-message__text").textContent,
    "Choose a file to upload"
  );

  server.close(t);
});
