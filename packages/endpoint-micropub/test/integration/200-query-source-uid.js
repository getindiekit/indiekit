import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
});
const request = supertest.agent(server);

const createPost = async (name) =>
  request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send(`name=${name}`);

const getUid = async (url) => {
  const result = await request
    .get("/micropub")
    .auth("JWT", { type: "bearer" })
    .set("accept", "application/json")
    .query({ q: "source" })
    .query({ "properties[]": "uid" })
    .query({ url });

  return result.body.properties.uid[0];
};

describe("endpoint-micropub GET /micropub?q=source&uid=*", () => {
  let seededUid;

  before(async () => {
    const response = await createPost("Foobar");
    seededUid = await getUid(response.headers.location);
  });

  it("Returns published post", async () => {
    const result = await request
      .get("/micropub")
      .auth("JWT", { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" })
      .query({ uid: seededUid });

    assert.equal(result.status, 200);
    assert.equal(result.body.properties.uid[0], seededUid);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
