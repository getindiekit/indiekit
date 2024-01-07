import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-files GET /files/:uid/delete", () => {
  it("Returns upload new file page", async () => {
    const response = await request
      .get("/files/upload")
      .set("cookie", testCookie());
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(result, "Upload a new file - Test configuration");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
