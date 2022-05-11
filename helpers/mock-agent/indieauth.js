import { MockAgent } from "undici";

const agent = new MockAgent();
agent.disableNetConnect();

export const indieauthAgent = () => {
  const client = agent.get("https://indieauth.com");

  // Grant token (Bad Request)
  client
    .intercept({ method: "POST", path: "/auth" })
    .reply(400, { error_description: "Not found" });

  return client;
};
