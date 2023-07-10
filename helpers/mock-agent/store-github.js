import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const origin = "https://api.github.com";
  const path = /\/repos\/user\/repo\/contents\/\D{3}\.md/;
  const createResponse = {
    content: { path: "foo.txt" },
    commit: { message: "Message" },
  };
  const readResponse = {
    content: "Zm9vYmFy", // ‘foobar’ Base64 encoded
    path: "foo.txt",
    sha: "1234",
  };
  const deleteResponse = {
    commit: { message: "Message" },
  };

  // Create/update file
  agent
    .get(origin)
    .intercept({ path, method: "PUT" })
    .reply(201, createResponse)
    .persist();

  // Create/update file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md/, method: "PUT" })
    .reply(401);

  // Read file
  agent
    .get(origin)
    .intercept({ path, method: "GET" })
    .reply(200, readResponse)
    .persist();

  // Read file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md/, method: "GET" })
    .reply(401)
    .persist();

  // Read file (Not Found)
  agent
    .get(origin)
    .intercept({ path: /.*404\.md/, method: "GET" })
    .reply(404)
    .persist();

  // Delete file
  agent
    .get(origin)
    .intercept({ path, method: "DELETE" })
    .reply(200, deleteResponse);

  return agent;
}
