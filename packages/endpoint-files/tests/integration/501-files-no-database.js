import test from "ava";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns 501 error as feature requires a database", async (t) => {
  const request = await testServer({ useDatabase: false });
  const response = await request.get("/files").set("cookie", [cookie]);
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
