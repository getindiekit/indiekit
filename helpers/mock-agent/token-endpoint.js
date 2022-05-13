import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/get-fixture";

const agent = new MockAgent();
agent.disableNetConnect();

export const tokenEndpointAgent = () => {
  const client = agent.get("https://token-endpoint.example");
  const post = getFixture("html/post.html", false);
  const page = getFixture("html/page.html", false);

  // Request access token
  client
    .intercept({ path: "/", headers: { authorization: "Bearer JWT" } })
    .reply(200, { me: "https://website.example", scope: "create" });

  // Request access token (Bad Request)
  client
    .intercept({ path: "/", headers: { authorization: "Bearer foo" } })
    .reply(400, { error_description: "The token provided was malformed" });

  // Request access token (Not found)
  client
    .intercept({ path: "/token", headers: { authorization: "Bearer JWT" } })
    .reply(404, { message: "Not found" });

  // Exchange authorization code for access token
  client
    .intercept({ method: "POST", path: "/" })
    .reply(200, { access_token: "token", scope: "create" });

  // Exchange authorization code for access token (empty response)
  client.intercept({ method: "POST", path: "/" }).reply(200, {});

  // Exchange authorization code for access token (Bad Request)
  client.intercept({ method: "POST", path: "/" }).reply(400, {
    error_description: "The code provided was not valid",
  });

  // Exchange authorization code for access token (Not Found)
  client.intercept({ method: "POST", path: "/" }).reply(404, {
    message: "Not found",
  });

  // Mock HTML requests (need to use same origin as token endpoint)
  // See: https://github.com/nodejs/undici/discussions/1440
  client.intercept({ method: "GET", path: "/post.html" }).reply(200, post);
  client.intercept({ method: "GET", path: "/page.html" }).reply(200, page);
  client.intercept({ method: "GET", path: "/404.html" }).reply(404, {
    message: "Not found",
  });

  return client;
};
