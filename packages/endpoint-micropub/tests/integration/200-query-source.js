import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Returns list of previously published posts", async (t) => {
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
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .query({ q: "source" });

  t.is(result.body.items.length, 1);
  t.is(result.body.items[0].properties.url[0], response.headers.location);

  server.close(t);
});
