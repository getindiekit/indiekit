import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns verified URL encoded access token", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/auth/token")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/x-www-form-urlencoded");
  const responseTextRegexp =
    /client_id=(?<client_id>.*)&me=(?<me>.*)&scope=(?<scope>.*)&iat=(?<iat>.*)&exp=(?<exp>.*)&iss=(?<iss>.*)/;

  const result = response.text.match(responseTextRegexp).groups;

  t.is(response.status, 200);
  t.truthy(result.client_id);
  t.is(result.me, encodeURIComponent(process.env.TEST_PUBLICATION_URL));
  t.truthy(result.scope);

  server.close(t);
});
