import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Verifies token and returns URL encoded string", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/token")
    .auth(process.env.TEST_TOKEN, { type: "bearer" });
  const responseTextRegexp =
    /client_id=(?<client_id>.*)&me=(?<me>.*)&scope=(?<scope>.*)&iat=(?<iat>.*)&exp=(?<exp>.*)&iss=(?<iss>.*)/;
  const result = response.text.match(responseTextRegexp).groups;

  t.is(response.status, 200);
  t.truthy(result.client_id);
  t.is(result.me, encodeURIComponent(process.env.TEST_PUBLICATION_URL));
  t.truthy(result.scope);

  server.close(t);
});
