import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { setGlobalDispatcher } from "undici";
import { indieauthAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(indieauthAgent());

test("Grants token and returns JSON", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/token")
    .set("accept", "application/json")
    .query({ client_id: "https://client.example" })
    .query({ code: "123456" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 200);
  t.truthy(result.body.access_token);
  t.is(result.body.me, process.env.TEST_PUBLICATION_URL);
  t.truthy(result.body.scope);

  server.close(t);
});
