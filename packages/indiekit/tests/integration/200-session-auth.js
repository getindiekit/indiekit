import process from "node:process";
import test from "ava";
import nock from "nock";
import { getFixture } from "@indiekit-test/get-fixture";
import { testServer } from "@indiekit-test/server";

test("Returns authenticated session", async (t) => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get("/")
    .reply(200, getFixture("html/home.html"));
  nock("https://tokens.indieauth.com").post("/token").query(true).reply(200, {
    access_token: process.env.TEST_TOKEN,
    scope: "create",
  });
  const request = await testServer({
    publication: {
      tokenEndpoint: "https://tokens.indieauth.com/token",
    },
  });

  const response = await request.post("/session/login");
  const authUrlRegexp =
    /client_id=(?<client_id>.*)&code_challenge_method=S256&code_challenge=(?<code_challenge>.*)&me=(?<me>.*)&response_type=code&scope=(?<scope>.*)&state=(?<state>.*)/;
  const { location } = response.headers;
  const parameters = location.match(authUrlRegexp).groups;

  const result = await request
    .get("/session/auth")
    .query(`code=${parameters.code_challenge}`)
    .query(`state=${parameters.state}`);

  t.is(result.statusCode, 302);
});
