import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns 302 redirect from well known change password URL", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/.well-known/change-password");

  t.is(result.status, 302);
  t.is(result.headers.location, "/auth/new-password");

  server.close(t);
});
