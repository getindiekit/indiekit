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

describe("endpoint-posts POST /posts/:uid/delete", () => {
  it("Deletes file and redirects to posts page", async () => {
    const result = await request
      .post(`/posts/123/delete`)
      .set("cookie", testCookie())
      .send({ url: "https://website.example/foobar" });

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/posts\?success/);
  });

  after(() => server.close());
});
