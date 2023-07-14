import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Returns no uploaded files (no database)", async (t) => {
  const server = await testServer({ useDatabase: false });
  const request = supertest.agent(server);
  const response = await request.get("/files").set("cookie", [testCookie()]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Uploaded files - Test configuration"
  );
  t.regex(result.querySelector(".main__container p").textContent, /No files/);

  server.close(t);
});
