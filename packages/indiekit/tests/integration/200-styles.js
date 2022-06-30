import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns CSS", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/assets/app.css");

  t.is(result.status, 200);
  t.is(result.type, "text/css");

  server.close(t);
});
