import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("indiekit");

test("Returns 400 error source URL not found", async (t) => {
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
  const result = await request
    .get("/micropub")
    .auth("JWT", { type: "bearer" })
    .set("accept", "application/json")
    .query({ q: "source" })
    .query({ "properties[]": "name" })
    .query({ url: "https://website.example/404.html" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "No post was found at this URL");

  server.close(t);
});
