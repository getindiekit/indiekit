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
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(response.status, 422);
    assert.equal(
      result.querySelector("title").textContent,
      "Error: Share - Test configuration",
    );
    assert.equal(
      result.querySelector("#name-error .error-message__text").textContent,
      "Enter a title",
    );
    assert.equal(
      result.querySelector("#bookmark-of-error .error-message__text")
        .textContent,
      "Invalid value",
    );
  });

  after(() => server.close());
});
