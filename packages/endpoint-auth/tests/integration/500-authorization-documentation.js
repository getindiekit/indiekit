import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns service documentation if no authorization query", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/auth").set("accept", "application/json");

  t.is(result.status, 500);

  server.close(t);
});
