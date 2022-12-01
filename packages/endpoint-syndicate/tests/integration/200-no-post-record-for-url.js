import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns no post record for URL", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/syndicate")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .query({ url: "https://website.example/notes/foobar/" });

  t.is(result.status, 200);
  t.is(
    result.body.success_description,
    `No post record available for https://website.example/notes/foobar/`
  );

  server.close(t);
});
