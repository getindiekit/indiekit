import { MockAgent } from "undici";

const agent = new MockAgent();
agent.disableNetConnect();

export const indieauthAgent = () => {
  const client = agent.get("https://indieauth.com");

  // Grant token (Bad Request)
  client
    .intercept({
      method: "POST",
      path: /\/auth\?client_id=(?<client_id>.*)&code=(?<code>.*)&redirect_uri=(?<redirect_uri>.*)/,
    })
    .reply(400, { error_description: "Not found" });

  return client;
};
