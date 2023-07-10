import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Creates draft post (JSON)", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/micropub")
    .auth(testToken({ scope: "draft" }), { type: "bearer" })
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

  t.is(result.status, 202);
  t.regex(result.headers.location, /\bfoobar\b/);
  t.regex(result.body.success_description, /\bPost will be created\b/);

  server.close(t);
});
