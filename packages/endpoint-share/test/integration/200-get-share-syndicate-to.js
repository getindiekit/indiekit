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
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelectorAll(
      'input[type="checkbox"][name="mp-syndicate-to"]',
    );

    assert.equal(result.length, 2);
    assert.ok([...result].every((input) => input.value));
  });

  after(() => server.close());
});
