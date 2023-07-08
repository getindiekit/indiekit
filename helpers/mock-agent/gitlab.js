import { MockAgent } from "undici";

/**
 * @param {object} [options] - Options
 * @returns {Function} Undici MockClient
 * @see {@link https://undici.nodejs.org/#/docs/api/MockClient}
 */
export function mockClient(options) {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const projectId = options.projectId || "username%2Frepo";
  const client = agent.get(options.instance || "https://gitlab.com");
  const path = `/api/v4/projects/${projectId}/repository/files/foo.txt`;
  const getResponse = {
    content: "Zm9vYmFy", // ‘foobar’ Base64 encoded
    file_path: "foo.txt",
    commit_id: "\b[0-9a-f]{5,40}\b",
  };

  // Create file
  client
    .intercept({ path, method: "POST" })
    .reply(201, { file_path: "foo.txt", branch: "main" });

  // Create file (Not Found)
  client.intercept({ path, method: "POST" }).reply(404);

  // Read file
  client.intercept({ path: `${path}/raw?ref=main` }).reply(200, "foobar");

  // Read file (Not Found)
  client.intercept({ path: `${path}/raw?ref=main` }).reply(404);

  // Update file
  client.intercept({ path }).reply(200, getResponse);
  client
    .intercept({ path, method: "PUT" })
    .reply(200, { file_path: "foo.txt", branch: "main" });

  // Update file (Not Found)
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);
  client.intercept({ path, method: "PUT" }).reply(404);

  // Delete file
  client.intercept({ path }).reply(200, getResponse);
  client
    .intercept({ path, method: "DELETE" })
    .reply(200, { commit: { message: "Message" }, content: {} });

  // Delete file (Not Found)
  client.intercept({ path }).reply(200, getResponse);
  client.intercept({ path, method: "DELETE" }).reply(404);

  return client;
}
