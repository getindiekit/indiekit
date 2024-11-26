import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer({ locale: "de" });
const request = supertest.agent(server);

describe("indiekit GET /session/login", () => {
  it("Returns localised page", async () => {
    const response = await request.get("/session/login");
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(result, "Anmelden - Test configuration");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
