import test from "ava";
import supertest from "supertest";
import { setGlobalDispatcher } from "undici";
import { tokenEndpointAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(tokenEndpointAgent());

test("Returns authenticated session", async (t) => {
  const server = await testServer({
    publication: {
      me: "https://website.example",
      tokenEndpoint: "https://token-endpoint.example",
    },
  });
  const request = supertest.agent(server);
  const response = await request.post("/session/login");
  const authUrlRegexp =
    /client_id=(?<client_id>.*)&code_challenge_method=S256&code_challenge=(?<code_challenge>.*)&me=(?<me>.*)&response_type=code&scope=(?<scope>.*)&state=(?<state>.*)/;
  const { location } = response.headers;
  const parameters = location.match(authUrlRegexp).groups;

  const result = await request
    .get("/session/auth")
    .query(`code=invalid`)
    .query(`state=${parameters.state}`);

  t.is(result.status, 401);
  t.true(
    result.text.includes(
      "The access token provided is expired, revoked, malformed, or invalid for other reasons"
    )
  );

  server.close(t);
});
