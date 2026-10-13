import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-files GET /files/:uid/delete", () => {
  it("Returns upload new file page", async () => {
    const response = await request
      .get("/files/upload")
      .set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");
    const $input = document.querySelector("input[name=file][multiple]");

    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Upload a new file - Test configuration");
    assert.ok($input, "input element not found");
  });

  after(() => server.close());
});
