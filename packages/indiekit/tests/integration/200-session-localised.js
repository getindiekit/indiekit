import test from "ava";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns localised page", async (t) => {
  const request = await testServer({
    locale: "de",
  });
  const response = await request.get("/session/login");
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(
    result.querySelector("title").textContent,
    "Anmelden - Test configuration"
  );
});
