import process from "node:process";
import test from "ava";
import mockSession from "mock-session";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns list of previously uploaded files", async (t) => {
  const request = await testServer();
  const cookie = mockSession("test", process.env.TEST_SESSION_SECRET, {
    token: process.env.TEST_TOKEN,
  });
  const response = await request.get("/micropub/posts").set("Cookie", [cookie]);
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Published posts - Test configuration"
  );
});
