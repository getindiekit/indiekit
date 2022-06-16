import test from "ava";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns 422 invalid form submission", async (t) => {
  const request = await testServer();
  const response = await request.post("/files/new").set("cookie", [cookie]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(response.status, 422);
  t.is(
    result.querySelector("title").textContent,
    "Error: Upload a new file - Test configuration"
  );
  t.is(
    result.querySelector("#file-error .error-message__text").textContent,
    "Choose a file to upload"
  );
});
