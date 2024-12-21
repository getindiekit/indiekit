import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-files");
const server = await testServer({
  application: { mediaEndpoint: "https://media-endpoint.example" },
});
const request = supertest.agent(server);

describe("endpoint-files POST /files/:uid/delete", () => {
  it("Returns 401 error deleting file", async () => {
    const response = await request
      .post(`/files/401/delete`)
      .set("cookie", testCookie())
      .send({ url: "https://website.example/401.jpg" });
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector(
      `notification-banner[type="error"] p`,
    ).textContent;

    assert.equal(response.status, 401);
    assert.match(result, /Unauthorized/);
  });

  after(() => server.close());
});
