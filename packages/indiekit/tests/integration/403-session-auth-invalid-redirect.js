import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 403 error auth with invalid redirect", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/session/auth")
    .query({ redirect: "https://external.example" });

  t.is(result.status, 403);
  t.true(result.text.includes("Invalid redirect attempted"));

  server.close(t);
});
