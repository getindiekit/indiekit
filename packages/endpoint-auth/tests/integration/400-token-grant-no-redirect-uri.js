import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error no `redirect_uri`", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);

  const result = await request
    .post("/auth/token")
    .set("accept", "application/json")
    .query({ client_id: "https://server.example" })
    .query({ code: "code" })
    .query({ grant_type: "authorization_code" });
  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing parameter: `redirect_uri`");

  server.close(t);
});
