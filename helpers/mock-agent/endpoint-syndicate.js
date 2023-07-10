import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const origin = "https://store.example";

  // Create file on content store
  agent
    .get(origin)
    .intercept({ path: /\/user\/.*\.(md|jpg)/, method: "PUT" })
    .reply(201);

  // Update file on content store
  agent
    .get(origin)
    .intercept({ path: /\/user\/.*\.(md|jpg)/, method: "PATCH" })
    .reply(201);

  return agent;
}
