import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns 500 error as feature requires database", async (t) => {
  const server = await testServer({ useDatabase: false });
  const request = supertest.agent(server);
  const response = await request.get("/files").set("cookie", [cookie]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Application error - Test configuration"
  );
  t.regex(
    result.querySelector(".article__body p").textContent,
    /This feature requires a database/
  );

  server.close(t);
});
