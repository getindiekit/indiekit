import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const origin = /https:\/\/gitlab\..*/;
  const filePath = /\/api\/v4\/projects\/.*\/repository\/files\/\D{3}.txt/;
  const commitPath = /\/api\/v4\/projects\/.*\/repository\/commits/;

  // Create file
  agent
    .get(origin)
    .intercept({ path: /.*new\.txt/, method: "POST" })
    .reply(
      201,
      { file_path: "new.txt", branch: "main" },
      { headers: { "content-type": "application/json" } },
    )
    .persist();

  // Create file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.txt/, method: "POST" })
    .reply(401);

  // Read file
  agent
    .get(origin)
    .intercept({ path: /.*(foo|bar).txt\?ref=main/ })
    .reply(
      200,
      { content: "Zm9v" }, // ‘foo’ Base64 encoded
      { headers: { "content-type": "application/json" } },
    )
    .persist();

  // Read raw file
  agent
    .get(origin)
    .intercept({ path: /.*(foo|bar).txt\/raw\?ref=main/ })
    .reply(200, "foo")
    .persist();

  // Read raw file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.txt\/raw\?ref=main/ })
    .reply(401);

  // Read raw file (Not Found)
  agent
    .get(origin)
    .intercept({ path: /.*404\.txt/ })
    .reply(404)
    .persist();

  // Update file
  agent
    .get(origin)
    .intercept({ path: filePath, method: "PUT" })
    .reply(
      200,
      { file_path: "foo.txt", branch: "main" },
      { headers: { "content-type": "application/json" } },
    );

  // Update and rename file
  agent
    .get(origin)
    .intercept({ path: commitPath, method: "POST", body: /previous_path/ })
    .reply(
      200,
      { file_path: "bar.txt", message: "message" },
      { headers: { "content-type": "application/json" } },
    )
    .persist();

  // Update commit
  agent
    .get(origin)
    .intercept({ path: commitPath, method: "POST", body: /.*(foo|bar).txt/ })
    .reply(
      200,
      { file_path: "foo.txt", message: "message" },
      { headers: { "content-type": "application/json" } },
    )
    .persist();

  // Update commit (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: commitPath, method: "POST", body: /.*401\.txt/ })
    .reply(401);

  // Delete file
  agent
    .get(origin)
    .intercept({ path: filePath, method: "DELETE" })
    .reply(
      200,
      { commit: { message: "Message" }, content: {} },
      { headers: { "content-type": "application/json" } },
    );

  // Delete file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.txt/, method: "DELETE" })
    .reply(401);

  return agent;
}
