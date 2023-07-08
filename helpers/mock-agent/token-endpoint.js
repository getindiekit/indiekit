import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/fixtures";

/**
 * @returns {Function} Undici MockClient
 * @see {@link https://undici.nodejs.org/#/docs/api/MockClient}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const client = agent.get("https://token-endpoint.example");
  const postHtml = getFixture("html/post.html");
  const pageHtml = getFixture("html/page.html");

  // Verify access token
  client
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
  client
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
  client
    .intercept({
      path: "/introspect?token=invalid",
      headers: { authorization: "Bearer invalid" },
      method: "POST",
    })
    .reply(200, { active: false });

  // Verify access token (Not found)
  client
    .intercept({
      path: "/introspect/token?token=JWT",
      headers: { authorization: "Bearer JWT" },
      method: "POST",
    })
    .reply(404, { message: "Not found" });

  // Exchange authorization code for access token (empty response)
  client
    .intercept({
      path: /\?client_id=(.*)&code=invalid&code_verifier=(.*)&grant_type=authorization_code&redirect_uri=(.*)/,
      method: "POST",
    })
    .reply(200, {});

  // Exchange authorization code for access token (Bad Request)
  client
    .intercept({
      path: /\?client_id=(.*)&code=foobar&code_verifier=(.*)&grant_type=authorization_code&redirect_uri=(.*)/,
      method: "POST",
    })
    .reply(400, {
      error: "invalid_request",
      error_description: "The code provided was not valid",
    });

  // Exchange authorization code for access token (Not Found)
  client
    .intercept({
      path: /\?client_id=(.*)&code=404&code_verifier=(.*)&grant_type=authorization_code&redirect_uri=(.*)/,
      method: "POST",
    })
    .reply(404, {
      message: "Not found",
    });

  // Exchange authorization code for access token
  client
    .intercept({
      path: /\?client_id=(.*)&code=(.*)&code_verifier=(.*)&grant_type=authorization_code&redirect_uri=(.*)/,
      method: "POST",
    })
    .reply(200, {
      access_token: "token",
      scope: "create",
      token_type: "Bearer",
    });

  // Mock HTML requests (need to use same origin as token endpoint)
  // See: https://github.com/nodejs/undici/discussions/1440
  client.intercept({ path: "/post.html" }).reply(200, postHtml);
  client.intercept({ path: "/page.html" }).reply(200, pageHtml);
  client.intercept({ path: "/404.html" }).reply(404, {
    message: "Not found",
  });

  return client;
}
