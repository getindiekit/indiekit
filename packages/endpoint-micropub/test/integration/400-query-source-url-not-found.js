import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("indiekit");
const server = await testServer({
  application: {
    tokenEndpoint: "https://token-endpoint.example",
    introspectionEndpoint: "https://token-endpoint.example/introspect",
  },
  publication: {
    me: "https://website.example",
  },
});
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=source&url=*", () => {
  it("Returns 400 error source URL not found", async () => {
    const result = await request
      .get("/micropub")
      .auth("JWT", { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" })
      .query({ url: "https://website.example/404.html" });

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "No post was found at this URL",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
