import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const tokenEndpointOrigin = "https://token-endpoint.example";
  const websiteOrigin = "https://website.example";

  // Verify access token
  agent
    .get(tokenEndpointOrigin)
    .intercept({
      path: "/introspect?token=JWT",
      headers: { authorization: "Bearer JWT" },
      method: "POST",
    })
    .reply(200, {
      active: true,
      me: "https://website.example",
      scope: "create",
    });

  // Verify access token (wrong token)
  agent
    .get(tokenEndpointOrigin)
    .intercept({
      path: "/introspect?token=another",
      headers: { authorization: "Bearer another" },
      method: "POST",
    })
    .reply(200, {
      active: true,
      me: "https://another.example",
      scope: "create",
    });

  // Verify access token (inactive token)
  agent
    .get(tokenEndpointOrigin)
    .intercept({
      path: "/introspect?token=invalid",
      headers: { authorization: "Bearer invalid" },
      method: "POST",
    })
    .reply(200, { active: false });

  // Verify access token (Not found)
  agent
    .get(tokenEndpointOrigin)
    .intercept({
      path: "/introspect/token?token=JWT",
      headers: { authorization: "Bearer JWT" },
      method: "POST",
    })
    .reply(404, { message: "Not found" });

  // Exchange authorization code for access token (empty response)
  agent
    .get(tokenEndpointOrigin)
    .intercept({
      path: /\?client_id=(.*)&code=invalid&code_verifier=(.*)&grant_type=authorization_code&redirect_uri=(.*)/,
      method: "POST",
    })
    .reply(200, {});

  // Exchange authorization code for access token (Bad Request)
  agent
    .get(tokenEndpointOrigin)
    .intercept({
      path: /\?client_id=(.*)&code=foobar&code_verifier=(.*)&grant_type=authorization_code&redirect_uri=(.*)/,
      method: "POST",
    })
    .reply(400, {
      error: "invalid_request",
      error_description: "The code provided was not valid",
    });

  // Exchange authorization code for access token (Not Found)
  agent
    .get(tokenEndpointOrigin)
    .intercept({
      path: /\?client_id=(.*)&code=404&code_verifier=(.*)&grant_type=authorization_code&redirect_uri=(.*)/,
      method: "POST",
    })
    .reply(404, {
      message: "Not found",
    });

  // Exchange authorization code for access token
  agent
    .get(tokenEndpointOrigin)
    .intercept({
      path: /\?client_id=(.*)&code=(.*)&code_verifier=(.*)&grant_type=authorization_code&redirect_uri=(.*)/,
      method: "POST",
    })
    .reply(200, {
      access_token: "token",
      scope: "create",
      token_type: "Bearer",
    });

  // Get categories from website
  agent
    .get(websiteOrigin)
    .intercept({ path: "/categories.json" })
    .reply(200, ["Foo", "Bar"]);

  // Get categories from website (Not Found)
  agent.get(websiteOrigin).intercept({ path: "/404.json" }).reply(404);

  return agent;
}
