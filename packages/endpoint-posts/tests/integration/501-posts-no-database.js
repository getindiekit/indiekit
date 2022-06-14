import process from "node:process";
import test from "ava";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns list of previously published posts", async (t) => {
  const request = await testServer({ useDatabase: false });
  const response = await request
    .get("/posts")
    .auth(process.env.TEST_TOKEN, { type: "bearer" });
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Not Implemented - Test configuration"
  );
  t.is(
    result.querySelector(".article__body p").textContent,
    "This feature requires a database."
  );
});
