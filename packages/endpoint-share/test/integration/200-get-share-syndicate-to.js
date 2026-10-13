import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer({
  plugins: [
    "@indiekit/syndicator-internet-archive",
    "@indiekit/syndicator-mastodon",
  ],
});
const request = supertest.agent(server);

describe("endpoint-share GET /share", () => {
  it("Renders a checkbox for each syndication target", async () => {
    const response = await request.get("/share").set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $$inputs = /** @type {NodeListOf<HTMLInputElement>} */ (
      document.querySelectorAll(
        'input[type="checkbox"][name="mp-syndicate-to"]',
      )
    );

    assert.equal($$inputs.length, 2);
    assert.ok([...$$inputs].every((input) => input.value));
  });

  after(() => server.close());
});
