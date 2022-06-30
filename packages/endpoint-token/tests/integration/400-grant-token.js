import test from "ava";
import supertest from "supertest";
import { setGlobalDispatcher } from "undici";
import { indieauthAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(indieauthAgent());

test("Returns 400 error unable to grant token", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/token")
    .set("accept", "application/json")
    .query({ client_id: "https://client.example" })
    .query({ code: "foobar" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Invalid code");

  server.close(t);
});
