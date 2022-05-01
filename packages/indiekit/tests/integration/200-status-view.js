import process from "node:process";
import test from "ava";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns status page", async (t) => {
  const request = await testServer();
  const response = await request
    .get("/status")
    .auth(process.env.TEST_TOKEN, { type: "bearer" });
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Server status - Test configuration"
  );
});
