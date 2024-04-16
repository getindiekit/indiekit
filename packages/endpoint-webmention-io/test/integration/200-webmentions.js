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
    const dom = new JSDOM(response.text);
    const result =
      dom.window.document.querySelector(".card__body p").textContent;

    assert.equal(result.includes("This looks interesting"), true);
  });

  after(() => server.close());
});
