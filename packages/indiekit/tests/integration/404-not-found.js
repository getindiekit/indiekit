import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 404", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/not-found");

  t.is(result.status, 404);

  server.close(t);
});
