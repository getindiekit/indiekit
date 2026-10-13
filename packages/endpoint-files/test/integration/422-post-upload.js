import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-files POST /posts/create", () => {
  it("Returns 422 error invalid form submission", async () => {
    const response = await request
      .post("/files/upload")
      .set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");
    const $fileError = document.querySelector(
      "#file-error .error-message__text",
    );

    assert.equal(response.status, 422);
    assert.ok($title, "title element not found");
    assert.equal(
      $title.textContent,
      "Error: Upload a new file - Test configuration",
    );
    assert.ok($fileError, "#file-error element not found");
    assert.equal($fileError.textContent, "Choose a file to upload");
  });

  after(() => server.close());
});
