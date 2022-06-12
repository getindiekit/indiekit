import test from "ava";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns list of previously uploaded files", async (t) => {
  const request = await testServer();
  const response = await request.get("/files").set("cookie", [cookie]);
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Uploaded files - Test configuration"
  );
});
