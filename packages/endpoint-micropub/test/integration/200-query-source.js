import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=source", () => {
  let response;

  before(async () => {
    response = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=Foobar");
  });

  it("Returns list of published posts", async () => {
    const result = await request
      .get("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" });

    assert.equal(result.body.items.length, 1);
    assert.equal(
      result.body.items[0].properties.url[0],
      response.headers.location,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
