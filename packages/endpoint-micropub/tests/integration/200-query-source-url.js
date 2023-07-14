import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Returns published post", async (t) => {
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
    .query({ url: response.headers.location });

  t.is(result.body.type[0], "h-entry");
  t.is(result.body.properties.name[0], "Foobar");
  t.is(result.body.properties["mp-slug"][0], "foobar");
  t.is(result.body.properties["post-type"][0], "note");
  t.truthy(result.body.properties.published[0]);
  t.truthy(result.body.properties.url[0]);

  server.close(t);
});
