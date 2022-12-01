import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns categories", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .query({ q: "category" });

  t.truthy(response.body.categories);

  server.close(t);
});
