import { MockAgent } from "undici";

const agent = new MockAgent();
agent.disableNetConnect();

export const indieauthAgent = () => {
  const client = agent.get("https://indieauth.com");

  // Grant token
  client
    .intercept({
      method: "POST",
      path: /\/auth\?client_id=(?<client_id>.*)&code=123456&redirect_uri=(?<redirect_uri>.*)/,
    })
    .reply(200, {
      access_token: "token",
      me: process.env.TEST_PUBLICATION_URL,
      scope: "create update delete media",
    });

  // Grant token (Bad Request)
  client
    .intercept({
      method: "POST",
      path: /\/auth\?client_id=(?<client_id>.*)&code=foobar&redirect_uri=(?<redirect_uri>.*)/,
    })
    .reply(400, { error_description: "Invalid code" });

  return client;
};
