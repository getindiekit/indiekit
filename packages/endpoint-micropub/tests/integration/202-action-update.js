import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Updates post", async (t) => {
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
    .auth(testToken(), { type: "bearer" })
    .send({
      action: "update",
      url: response.header.location,
      replace: {
        name: ["Barfoo"],
      },
    });

  t.is(result.status, 200);
  t.regex(result.headers.location, /\bfoobar\b/);
  t.regex(result.body.success_description, /\bPost updated\b/);

  server.close(t);
});
