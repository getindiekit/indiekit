import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 403 error verifying token if URLs don’t match", async (t) => {
  const server = await testServer({
    publication: {
      me: "https://server.example",
    },
  });
  const request = supertest.agent(server);
  const result = await request
    .get("/token")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 403);
  t.is(
    result.body.error_description,
    "Publication URL does not match that provided by access token"
  );

  server.close(t);
});
