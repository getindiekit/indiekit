import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Login redirects authenticated user to homepage", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/session/login").set("cookie", [cookie]);

  t.is(result.headers.location, "/");

  server.close(t);
});
