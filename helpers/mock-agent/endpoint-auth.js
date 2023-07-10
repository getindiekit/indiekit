import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/fixtures";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export const mockClient = () => {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const origin = "https://auth-endpoint.example";

  // Client information
  agent
    .get(origin)
    .intercept({ path: "/" })
    .reply(200, getFixture("html/home.html"));

  // Client information (Not Found)
  agent.get(origin).intercept({ path: "/404" }).reply(404);

  // Profile URL response
  agent
    .get(origin)
    .intercept({
      path: /\/auth\?client_id=(?<client_id>.*)&code=(?<code>.*)&code_verifier=(?<code_verifier>.*)&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(200, {
      me: "https://website.example",
    });

  // Profile URL response (Bad Request)
  agent
    .get(origin)
    .intercept({
      path: /\/auth\?client_id=(?<client_id>.*)&code=foobar&code_verifier=(?<code_verifier>.*)&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(400, { error_description: "Invalid code" });

  // Access token response
  agent
    .get(origin)
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
  agent
    .get(origin)
    .intercept({
      path: /\/auth\/token\?client_id=(?<client_id>.*)&code=foobar&code_verifier=(?<code_verifier>.*)&grant_type=authorization_code&redirect_uri=(?<redirect_uri>.*)/,
      method: "POST",
    })
    .reply(400, { error_description: "Invalid code" });

  return agent;
};
