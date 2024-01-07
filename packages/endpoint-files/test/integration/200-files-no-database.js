import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

const server = await testServer({ useDatabase: false });
const request = supertest.agent(server);

describe("endpoint-files GET /files", () => {
  it("Returns no uploaded files (no database)", async () => {
    const response = await request.get("/files").set("cookie", testCookie());
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(
      result.querySelector("title").textContent,
      "Uploaded files - Test configuration",
    );
    assert.match(
      result.querySelector(".main__container p").textContent,
      /No files/,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
