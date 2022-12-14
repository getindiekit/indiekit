import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error no `code`", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/auth/token")
    .set("accept", "application/json")
    .query({ client_id: "https://server.example" })
    .query({ grant_type: "authorization_code" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing parameter: `code`");

  server.close(t);
});
