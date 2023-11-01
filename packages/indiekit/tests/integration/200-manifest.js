import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns Web App Manifest", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/app.webmanifest");

  t.is(result.status, 200);
  t.is(result.type, "application/manifest+json");
  t.is(result.body.name, "Test configuration");
  t.truthy(result.body.icons);

  server.close(t);
});
