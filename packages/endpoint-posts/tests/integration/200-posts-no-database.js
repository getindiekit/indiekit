import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Returns no published posts (no database)", async (t) => {
  const server = await testServer({ useDatabase: false });
  const request = supertest.agent(server);
  const response = await request.get("/posts").set("cookie", [testCookie()]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Published posts - Test configuration"
  );
  t.regex(result.querySelector(".main__container p").textContent, /No posts/);

  server.close(t);
});
