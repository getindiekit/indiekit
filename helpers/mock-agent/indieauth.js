import process from "node:process";
import { MockAgent } from "undici";

/**
 * @returns {Function} Undici MockClient
 * @see {@link: https://undici.nodejs.org/#/docs/api/MockClient}
 */
export const mockClient = () => {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const client = agent.get("https://indieauth.com");

  // Grant token
  client
    .intercept({
      path: /\/auth\?client_id=(?<client_id>.*)&code=123456&code_verifier=abcdef&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(200, {
      access_token: "token",
      me: process.env.TEST_PUBLICATION_URL,
      scope: "create update delete media",
      token_type: "Bearer",
    });

  // Grant token (Bad Request)
  client
    .intercept({
      path: /\/auth\?client_id=(?<client_id>.*)&code=foobar&code_verifier=abcdef&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(400, { error_description: "Invalid code" });

  return client;
};
