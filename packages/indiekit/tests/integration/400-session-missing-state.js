import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error auth with missing state", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/session/auth")
    .query({ redirect: "/status" })
    .query({ code: "code" });

  t.is(result.status, 400);
  t.true(result.text.includes("Missing parameter: <code>state</code>"));

  server.close(t);
});
