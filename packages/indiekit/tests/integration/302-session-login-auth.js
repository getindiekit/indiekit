import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Login redirects to IndieAuth authentication URL", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.post("/session/login");
  const authUrlRegexp =
    /client_id=(?<client_id>.*)&code_challenge_method=S256&code_challenge=(?<code_challenge>.*)&me=(?<me>.*)&response_type=code&scope=(?<scope>.*)&state=(?<state>.*)/;
  const { location } = result.headers;
  const parameters = location.match(authUrlRegexp).groups;

  t.is(result.status, 302);
  t.true(parameters.client_id.startsWith("http"));
  t.truthy(parameters.code_challenge);
  t.true(parameters.me.startsWith("http"));
  t.truthy(parameters.scope);
  t.truthy(parameters.state);

  server.close(t);
});
