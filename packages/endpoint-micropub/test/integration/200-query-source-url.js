import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=source&url=*", () => {
  let response;

  before(async () => {
    response = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=Foobar");
  });

  it("Returns published post", async () => {
    const result = await request
      .get("/micropub")
      .auth("JWT", { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" })
      .query({ url: response.headers.location });

    assert.equal(result.body.type[0], "h-entry");
    assert.equal(result.body.properties.name[0], "Foobar");
    assert.equal(result.body.properties["mp-slug"][0], "foobar");
    assert.equal(result.body.properties["post-type"][0], "note");
    assert.ok(result.body.properties.published[0]);
    assert.ok(result.body.properties.url[0]);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
