import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error no `client_id`", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/token")
    .set("accept", "application/json")
    .query({ code: "code" })
    .query({ code_verifier: "abcdef" })
    .query({ grant_type: "authorization_code" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing parameter: `client_id`");

  server.close(t);
});
