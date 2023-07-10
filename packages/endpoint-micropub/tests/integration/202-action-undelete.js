import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Un-deletes post", async (t) => {
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

  // Delete post
  await request.post("/micropub").auth(testToken(), { type: "bearer" }).send({
    action: "delete",
    url: response.header.location,
  });

  // Undelete post
  const result = await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .send({
      action: "undelete",
      url: response.header.location,
    });

  t.is(result.status, 200);
  t.regex(result.body.success_description, /\bPost restored\b/);

  server.close(t);
});
