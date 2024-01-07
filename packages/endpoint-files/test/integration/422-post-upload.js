import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-files POST /posts/create", () => {
  it("Returns 422 error invalid form submission", async () => {
    const response = await request
      .post("/files/upload")
      .set("cookie", testCookie());
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(response.status, 422);
    assert.equal(
      result.querySelector("title").textContent,
      "Error: Upload a new file - Test configuration",
    );
    assert.equal(
      result.querySelector("#file-error .error-message__text").textContent,
      "Choose a file to upload",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
