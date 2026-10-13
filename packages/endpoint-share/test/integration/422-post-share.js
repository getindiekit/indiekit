import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-share POST /share", () => {
  it("Returns 422 error invalid form submission", async () => {
    const response = await request.post("/share").set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");
    const $nameError = document.querySelector(
      "#name-error .error-message__text",
    );
    const $bookmarkOfError = document.querySelector(
      "#bookmark-of-error .error-message__text",
    );

    assert.equal(response.status, 422);
    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Error: Share - Test configuration");
    assert.ok($nameError, "span element not found");
    assert.equal($nameError.textContent, "Enter a title");
    assert.ok($bookmarkOfError, "span element not found");
    assert.equal($bookmarkOfError.textContent, "Invalid value");
  });

  after(() => server.close());
});
