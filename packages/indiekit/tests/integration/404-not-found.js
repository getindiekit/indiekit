import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 404", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/not-found")
    .auth(testToken(), { type: "bearer" });

  t.is(result.status, 404);

  server.close(t);
});
