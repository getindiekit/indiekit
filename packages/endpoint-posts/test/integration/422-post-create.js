import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts POST /posts/create", () => {
  it("Returns 422 error invalid form submission", async () => {
    const response = await request
      .post("/posts/create")
      .set("cookie", testCookie())
      .send({ type: "entry" })
      .send({ postType: "note" })
      .send({ geo: "foobar" });
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");
    const $contentError = document.querySelector(
      "#content-error .error-message__text",
    );
    const $geoError = document.querySelector("#geo-error .error-message__text");

    assert.equal(response.status, 422);
    assert.ok($title, "title element not found");
    assert.equal(
      $title.textContent,
      "Error: Create a new custom note post type post - Test configuration",
    );
    assert.ok($contentError, "span element not found");
    assert.equal($contentError.textContent, "Enter some content");
    assert.ok($geoError, "span element not found");
    assert.equal($geoError.textContent, "Enter valid coordinates");
  });

  after(() => server.close());
});
