import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

await mockAgent("endpoint-posts");
const server = await testServer({
  application: { micropubEndpoint: "https://micropub-endpoint.example" },
});
const request = supertest.agent(server);

describe("endpoint-posts GET /posts/:uid/delete", () => {
  it("Redirects to post page if no delete permissions", async () => {
    const result = await request
      .get(`/posts/123/delete`)
      .set("cookie", testCookie({ scope: "create" }));

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/posts\/(.*)/);
  });

  after(() => server.close());
});
