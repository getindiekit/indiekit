import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns empty list of uploaded files (no database)", async (t) => {
  const server = await testServer({ useDatabase: false });
  const request = supertest.agent(server);
  const result = await request
    .get("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .query({ q: "source" });

  t.deepEqual(result.body.items, []);

  server.close(t);
});
