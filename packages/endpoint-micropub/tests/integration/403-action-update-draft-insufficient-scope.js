import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Returns 403 error update non-draft post with draft scope", async (t) => {
  // Create post
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/micropub")
    .auth(testToken({ scope: "create" }), { type: "bearer" })
    .send({
      type: ["h-entry"],
      properties: {
        name: ["Foobar"],
      },
    });

  // Update post with draft scope
  const request2 = supertest.agent(server);
  const result = await request2
    .post("/micropub")
    .auth(testToken({ scope: "draft" }), { type: "bearer" })
    .set("accept", "application/json")
    .send({
      action: "update",
      url: response.header.location,
      replace: {
        name: ["Barfoo"],
      },
    });

  t.is(result.status, 403);
  t.is(
    result.body.error_description,
    "The request requires higher privileges than provided by the access token"
  );

  server.close(t);
});
