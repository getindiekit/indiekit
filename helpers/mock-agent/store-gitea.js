import { MockAgent } from "undici";

/**
 * @param {object} [options] - Options
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient(options) {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const origin = options.instance || "https://gitea.com";
  const path = /\/api\/v1\/repos\/username\/repo\/contents\/\D{3}.md/;
  const getResponse = {
    content: "Zm9vYmFy", // ‘foobar’ Base64 encoded
    path: "foo.md",
    sha: "1234",
  };

  // Create file
  agent
    .get(origin)
    .intercept({ path, method: "POST" })
    .reply(201, { path: "foo.md", branch: "main" });

  // Create file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md/, method: "POST" })
    .reply(401);

  // Read file
  agent
    .get(origin)
    .intercept({ path, method: "GET" })
    .reply(200, getResponse)
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
    .reply(404);

  // Update file
  agent
    .get(origin)
    .intercept({ path, method: "PUT" })
    .reply(200, { path: "foo.md", branch: "main" });

  // Delete file
  agent
    .get(origin)
    .intercept({ path, method: "DELETE" })
    .reply(200, { commit: { message: "Message" }, content: {} });

  return agent;
}
