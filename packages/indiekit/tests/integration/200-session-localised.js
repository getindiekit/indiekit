import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns localised page", async (t) => {
  const server = await testServer({ locale: "de" });
  const request = supertest.agent(server);
  const response = await request.get("/session/login");
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector("title").textContent;

  t.is(result, "Anmelden - Test configuration");

  server.close(t);
});
