import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-files");
const server = await testServer({
  application: {
    mediaEndpoint: "https://401-post-upload-unauthorized.example",
  },
});
const request = supertest.agent(server);

describe("endpoint-files POST /files/upload", () => {
  it("Returns 401 error uploading file", async () => {
    const response = await request
      .post("/files/upload")
      .set("cookie", testCookie({ scope: "profile" }))
      .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector(
      `notification-banner[type="error"] p`,
    ).textContent;

    assert.equal(response.status, 401);
    assert.match(result, /Unauthorized/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
