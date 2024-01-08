import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
  it("Returns documentation with invalid `response_type` error", async () => {
    const result = await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ response_type: "foo" })
      .query({ state: "12345" });

    assert.equal(result.status, 200);
    assert.equal(
      result.text.includes(
        "Invalid value provided for: <code>response_type</code>",
      ),
      true,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
