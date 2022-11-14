import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("indieauth");

test("Grants token and returns URL encoded string", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/token")
    .set("accept", "application/x-www-form-urlencoded")
    .query({ client_id: "https://client.example" })
    .query({ code: "123456" })
    .query({ code_verifier: "abcdef" })
    .query({ grant_type: "authorization_code" })
    .query({ redirect_uri: "/" });
  const responseTextRegexp =
    /access_token=(?<access_token>.*)&me=(?<me>.*)&scope=(?<scope>.*)/;
  const result = response.text.match(responseTextRegexp).groups;

  t.is(response.status, 200);
  t.truthy(result.access_token);
  t.is(result.me, encodeURIComponent(process.env.TEST_PUBLICATION_URL));
  t.truthy(result.scope);

  server.close(t);
});
