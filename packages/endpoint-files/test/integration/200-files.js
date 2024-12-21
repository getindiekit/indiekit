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

describe("endpoint-files GET /files", () => {
  it("Returns list of uploaded files", async () => {
    const response = await request.get("/files").set("cookie", testCookie());
    const dom = new JSDOM(response.text);
    const result =
      dom.window.document.querySelector(".card__title a").textContent;

    assert.equal(result, "photo.jpg");
  });

  after(() => server.close());
});
