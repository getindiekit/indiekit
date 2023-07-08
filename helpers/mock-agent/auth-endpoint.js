import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/fixtures";

/**
 * @returns {Function} Undici MockClient
 * @see {@link https://undici.nodejs.org/#/docs/api/MockClient}
 */
export const mockClient = () => {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const client = agent.get("https://auth-endpoint.example");

  // Client information
  const homeHtml = getFixture("html/home.html");
  client.intercept({ path: "/" }).reply(200, homeHtml);

  // Profile URL response
  client
    .intercept({
      path: /\/auth\?client_id=(?<client_id>.*)&code=(?<code>.*)&code_verifier=(?<code_verifier>.*)&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(200, {
      me: "https://website.example",
    });

  // Profile URL response (Bad Request)
  client
    .intercept({
      path: /\/auth\?client_id=(?<client_id>.*)&code=foobar&code_verifier=(?<code_verifier>.*)&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(400, { error_description: "Invalid code" });

  // Access token response
  client
    .intercept({
      path: /\/auth\/token\?client_id=(?<client_id>.*)&code=(?<code>.*)&code_verifier=(?<code_verifier>.*)&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(200, {
      access_token: "token",
      me: "https://website.example",
      scope: "create update delete media",
      token_type: "Bearer",
    });

  // Access token response (Bad Request)
  client
    .intercept({
      path: /\/auth\/token\?client_id=(?<client_id>.*)&code=foobar&code_verifier=(?<code_verifier>.*)&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(400, { error_description: "Invalid code" });

  return client;
};
