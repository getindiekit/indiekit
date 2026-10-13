import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-files GET /files", () => {
  it("Returns no uploaded files (no database)", async () => {
    const response = await request.get("/files").set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");
    const $p = document.querySelector(".main__container p");

    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Uploaded files - Test configuration");
    assert.ok($p, "p element not found");
    assert.match($p.textContent, /No files/);
  });

  after(() => server.close());
});
