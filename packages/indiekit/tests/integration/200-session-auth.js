import test from "ava";
import { setGlobalDispatcher } from "undici";
import { tokenEndpointAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(tokenEndpointAgent());

test("Returns authenticated session", async (t) => {
  const request = await testServer({
    publication: {
      me: "https://website.example",
      tokenEndpoint: "https://token-endpoint.example",
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
