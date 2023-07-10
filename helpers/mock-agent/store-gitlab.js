import { MockAgent } from "undici";

/**
 * @param {object} [options] - Options
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient(options) {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const origin = options.instance || "https://gitlab.com";
  const projectId = options.projectId || "username%2Frepo";
  const path = `/api/v4/projects/${projectId}/repository/files/foo.md`;

  // Create file
  agent
    .get(origin)
    .intercept({ path, method: "POST" })
    .reply(201, { file_path: "foo.md", branch: "main" });

  // Create file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md/, method: "POST" })
    .reply(401);

  // Read raw file
  agent
    .get(origin)
    .intercept({ path: `${path}/raw?ref=main` })
    .reply(200, "foobar");

  // Read raw file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md\/raw\?ref=main/ })
    .reply(401);

  // Update file
  agent
    .get(origin)
    .intercept({ path, method: "PUT" })
    .reply(200, { file_path: "foo.md", branch: "main" });

  // Update file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md/, method: "PUT" })
    .reply(401);

  // Delete file
  agent
    .get(origin)
    .intercept({ path, method: "DELETE" })
    .reply(200, { commit: { message: "Message" }, content: {} });

  // Delete file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md/, method: "DELETE" })
    .reply(401);

  return agent;
}
