import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Deletes post", async (t) => {
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
        content: [
          "Micropub test of creating an h-entry with a JSON request containing multiple categories.",
        ],
        category: ["test1", "test2"],
      },
    });

  // Delete post
  const result = await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .send({
      action: "delete",
      url: response.header.location,
    });

  t.is(result.status, 200);
  t.regex(result.body.success_description, /\bPost deleted\b/);

  server.close(t);
});
