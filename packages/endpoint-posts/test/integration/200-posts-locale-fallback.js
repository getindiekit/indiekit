import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-posts");
const server = await testServer({
  locale: "de",
  application: { micropubEndpoint: "https://micropub-endpoint.example" },
});
const request = supertest.agent(server);

const getDocument = async () => {
  const response = await request.get("/posts").set("cookie", testCookie());

  return new JSDOM(response.text).window.document;
};

describe("endpoint-posts GET /posts in a locale missing a key", () => {
  it("Uses the locale wherever it has a translation", async () => {
    const document = await getDocument();
    const $pageHeading = document.querySelector(".heading__title");

    assert.ok($pageHeading, "page heading not found");
    assert.equal($pageHeading.textContent?.trim(), "Veröffentlichte Beiträge");
  });

  it("Falls back to English where the locale has no translation", async () => {
    const document = await getDocument();
    const $heading = document.querySelector(".section__title");

    assert.ok($heading, "heading element not found");
    assert.equal($heading.textContent?.trim(), "1 post");
  });

  after(() => server.close());
});
