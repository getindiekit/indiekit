import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Returns 400 updating post without operation to perform", async (t) => {
  // Create post
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .send({
      type: ["h-entry"],
      properties: {
        name: ["Foobar"],
      },
    });

  // Update post
  const result = await request
    .post("/micropub")
    .accept("application/json")
    .auth(testToken(), { type: "bearer" })
    .send({
      action: "update",
      url: response.header.location,
    });

  t.is(result.status, 400);
  t.is(
    result.body.error_description,
    "No replace, add or remove operations included in request"
  );

  server.close(t);
});
