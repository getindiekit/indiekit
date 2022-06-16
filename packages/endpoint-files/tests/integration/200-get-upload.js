import test from "ava";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns upload new file page", async (t) => {
  const request = await testServer();
  const response = await request.get("/files/new").set("cookie", [cookie]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Upload a new file - Test configuration"
  );
});
