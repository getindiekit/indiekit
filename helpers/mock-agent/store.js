import { MockAgent } from "undici";

/**
 * @returns {Function} Undici MockClient
 * @see {@link https://undici.nodejs.org/#/docs/api/MockClient}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const client = agent.get("https://store.example");
  const path = /\/user\/.*\.(md|jpg)/;
  const response = {
    commit: { message: "Message" },
  };

  // Create file
  client.intercept({ path: /.*401\.md/, method: "PUT" }).reply(401);
  client.intercept({ path, method: "PUT" }).reply(201, response).persist();

  // Update file
  client.intercept({ path, method: "PATCH" }).reply(201, response).persist();

  // Delete file
  client.intercept({ path, method: "DELETE" }).reply(200, response).persist();

  return agent;
}
