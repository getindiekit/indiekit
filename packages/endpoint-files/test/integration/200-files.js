import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-files GET /files", () => {
  it("Returns list of uploaded files", async () => {
    const response = await request.get("/files").set("cookie", testCookie());
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(result, "Uploaded files - Test configuration");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
