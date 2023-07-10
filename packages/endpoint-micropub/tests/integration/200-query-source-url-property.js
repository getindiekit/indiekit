import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Returns previously published post", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=Foobar");
  const result = await request
    .get("/micropub")
    .auth("JWT", { type: "bearer" })
    .set("accept", "application/json")
    .query({ q: "source" })
    .query({ "properties[]": "name" })
    .query({ url: response.headers.location });

  t.deepEqual(result.body, { properties: { name: ["Foobar"] } });

  server.close(t);
});
