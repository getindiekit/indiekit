import { strict as assert } from "node:assert";
import { after, describe, it, mock } from "node:test";

import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

// Remove one key from the German catalog, so the test doesn’t depend on
// which keys Localazy has (or hasn’t yet) translated
const getLocaleCatalog = Object.getOwnPropertyDescriptor(
  Indiekit.prototype,
  "localeCatalog",
)?.get;
assert.ok(getLocaleCatalog, "localeCatalog getter not found");

mock.getter(
  Indiekit.prototype,
  "localeCatalog",
  /**
   * @this {Indiekit}
   * @returns {Map<string, object>} Catalog of localised strings
   */
  function () {
    // eslint-disable-next-line unicorn/no-this-outside-of-class
    const catalog = getLocaleCatalog.call(this);
    delete catalog.get("de").posts.posts.count;
    return catalog;
  },
);

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
