import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Creates post (form-encoded)", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=Foobar")
      .send("content=Micropub+test+of+creating+an+h-entry+with+categories")
      .send("photo=https%3A%2F%2Fwebsite.example%2Fphoto.jpg")
      .send("category[]=test1&category[]=test2");

    assert.equal(result.status, 202);
    assert.match(result.headers.location, /\bfoobar\b/);
    assert.match(result.body.success_description, /\bPost will be created\b/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
