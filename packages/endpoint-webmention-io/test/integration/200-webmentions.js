import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-webmention-io");
const server = await testServer({
  plugins: ["@indiekit/endpoint-webmention-io"],
});
const request = supertest.agent(server);

describe("endpoint-webmention-io GET /webmentions", () => {
  it("Returns list of webmentions", async () => {
    const response = await request
      .get("/webmentions")
      .set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $p = document.querySelector(".card__body p");

    assert.ok($p, "p element not found");
    assert.equal($p.textContent.includes("This looks interesting"), true);
  });

  it("Omits avatar if author has no photo", async () => {
    const response = await request
      .get("/webmentions")
      .set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $img = document.querySelectorAll("img.avatar");

    assert.equal($img.length, 0);
  });

  after(() => server.close());
});
