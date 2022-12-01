import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 500 error as feature requires database", async (t) => {
  const server = await testServer({ useDatabase: false });
  const request = supertest.agent(server);
  const response = await request
    .get("/posts")
    .auth(testToken(), { type: "bearer" });
  const dom = new JSDOM(response.text);
  const result =
    dom.window.document.querySelector(".main__container p").textContent;

  t.is(response.status, 501);
  t.regex(result, /This feature requires a database/);

  server.close(t);
});
