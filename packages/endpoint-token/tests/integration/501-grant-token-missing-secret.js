import process from "node:process";
import test from "ava";
import sinon from "sinon";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 501 error granting token if missing secret", async (t) => {
  sinon.stub(process.env, "TOKEN_SECRET").value("");
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/token")
    .set("accept", "application/json")
    .query({ client_id: "https://client.example" })
    .query({ code: "123456" })
    .query({ code_verifier: "abcdef" })
    .query({ grant_type: "authorization_code" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 501);
  t.is(result.body.error, "not_implemented");
  t.is(result.body.error_description, "Missing `TOKEN_SECRET`");

  server.close(t);
});
