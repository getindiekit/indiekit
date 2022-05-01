import test from "ava";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns guidance page", async (t) => {
  const request = await testServer();
  const response = await request.get("/token");
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Token endpoint - Test configuration"
  );
});
