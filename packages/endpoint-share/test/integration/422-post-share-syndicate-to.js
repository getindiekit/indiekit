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

describe("endpoint-share POST /share", () => {
  it("Keeps chosen syndication targets checked on error", async () => {
    const response = await request
      .post("/share")
      .set("cookie", testCookie())
      .send("mp-syndicate-to=https://mastodon.example/@username");
    const { document } = new JSDOM(response.text).window;
    const $input = /** @type {HTMLInputElement} */ (
      document.querySelector(
        'input[name="mp-syndicate-to"][value="https://mastodon.example/@username"]',
      )
    );

    assert.equal(response.status, 422);
    assert.ok($input, "input element not found");
    assert.equal($input.checked, true);
  });

  after(() => server.close());
});
