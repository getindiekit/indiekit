import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("indiekit");

const server = await testServer({
  application: { tokenEndpoint: "https://token-endpoint.example" },
  publication: { me: "https://website.example" },
});
const request = supertest.agent(server);

describe("indiekit POST /session/login", () => {
  it("Returns authenticated session", async () => {
    const response = await request.post("/session/login");
    const authUrlRegexp =
      /client_id=(?<client_id>.*)&code_challenge_method=S256&code_challenge=(?<code_challenge>.*)&me=(?<me>.*)&response_type=code&scope=(?<scope>.*)&state=(?<state>.*)/;
    const { location } = response.headers;
    const parameters = location.match(authUrlRegexp).groups;
    const result = await request
      .get("/session/auth")
      .query(`code=${parameters.code_challenge}`)
      .query(`state=${parameters.state}`);

    assert.equal(result.status, 302);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
