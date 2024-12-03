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
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(response.status, 422);
    assert.equal(
      result.querySelector("title").textContent,
      "Error: Create a new custom note post type post - Test configuration",
    );
    assert.equal(
      result.querySelector("#content-error .error-message__text").textContent,
      "Enter some content",
    );
    assert.equal(
      result.querySelector("#geo-error .error-message__text").textContent,
      "Enter valid coordinates",
    );
  });

  after(() => server.close());
});
