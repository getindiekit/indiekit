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
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");

    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Anmelden - Test configuration");
  });

  after(() => server.close());
});
