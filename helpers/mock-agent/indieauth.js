import process from "node:process";
import { MockAgent } from "undici";

export const mockClient = () => {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const client = agent.get("https://indieauth.com");

  // Grant token
  client
    .intercept({
      path: /\/auth\?client_id=(?<client_id>.*)&code=123456&redirect_uri=(?<redirect_uri>.*)/,
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
      path: /\/auth\?client_id=(?<client_id>.*)&code=foobar&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(400, { error_description: "Invalid code" });

  return client;
};
