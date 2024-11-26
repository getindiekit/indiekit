import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

await mockAgent("endpoint-files");
const server = await testServer({
  application: { mediaEndpoint: "https://media-endpoint.example" },
});
const request = supertest.agent(server);

describe("endpoint-files GET /files/:uid/delete", () => {
  it("Redirects to file page if no delete permissions", async () => {
    const result = await request
      .get(`/files/123/delete`)
      .set("cookie", testCookie({ scope: "media" }));

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/files\/(.*)/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
