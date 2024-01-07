import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit POST /session/login", () => {
  it("Login redirects to IndieAuth authentication URL", async () => {
    const result = await request.post("/session/login");
    const authUrlRegexp =
      /client_id=(?<client_id>.*)&code_challenge_method=S256&code_challenge=(?<code_challenge>.*)&me=(?<me>.*)&response_type=code&scope=(?<scope>.*)&state=(?<state>.*)/;
    const { location } = result.headers;
    const parameters = location.match(authUrlRegexp).groups;

    assert.equal(result.status, 302);
    assert.equal(parameters.client_id.startsWith("http"), true);
    assert.ok(parameters.code_challenge);
    assert.equal(parameters.me.startsWith("http"), true);
    assert.ok(parameters.scope);
    assert.ok(parameters.state);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
