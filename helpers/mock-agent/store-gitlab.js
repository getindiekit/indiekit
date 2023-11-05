import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const origin = /https:\/\/gitlab\..*/;
  const filePath = /\/api\/v4\/projects\/.*\/repository\/files\/\D{3}.md/;
  const commitPath = /\/api\/v4\/projects\/.*\/repository\/commits/;

  // Create file
  agent
    .get(origin)
    .intercept({ path: filePath, method: "POST" })
    .reply(201, { file_path: "foo.md", branch: "main" })
    .persist();

  // Create file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md/, method: "POST" })
    .reply(401);

  // Read raw file
  agent
    .get(origin)
    .intercept({ path: /.*\D{3}.md\/raw\?ref=main/ })
    .reply(200, "foobar");

  // Read raw file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md\/raw\?ref=main/ })
    .reply(401);

  // Update file
  agent
    .get(origin)
    .intercept({ path: filePath, method: "PUT" })
    .reply(200, { file_path: "foo.md", branch: "main" });

  // Update and rename file
  agent
    .get(origin)
    .intercept({ path: commitPath, method: "POST", body: /previous_path/ })
    .reply(200, { file_path: "bar.md", message: "message" })
    .persist();

  // Update commit
  agent
    .get(origin)
    .intercept({ path: commitPath, method: "POST", body: /.*\D{3}.md/ })
    .reply(200, { file_path: "foo.md", message: "message" })
    .persist();

  // Update commit (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: commitPath, method: "POST", body: /.*401\.md/ })
    .reply(401);

  // Delete file
  agent
    .get(origin)
    .intercept({ path: filePath, method: "DELETE" })
    .reply(200, { commit: { message: "Message" }, content: {} });

  // Delete file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.md/, method: "DELETE" })
    .reply(401);

  return agent;
}
