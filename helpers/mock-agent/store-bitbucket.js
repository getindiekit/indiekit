import { MockAgent } from "undici";

/**
 * @param {string} message - Error message
 * @returns {object} Bitbucket-shaped error response body
 */
function errorBody(message) {
  return { type: "error", error: { message } };
}

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const origin = "https://api.bitbucket.org";
  const sourcePath = "/2.0/repositories/username/repo/src";

  // File exists (foo.txt)
  agent
    .get(origin)
    .intercept({
      path: `${sourcePath}/main/foo.txt`,
      method: "GET",
      query: { format: "meta" },
    })
    .reply(200, { path: "foo.txt", type: "commit_file" })
    .persist();

  // File doesn’t exist (404.txt, new.txt, 401.txt)
  agent
    .get(origin)
    .intercept({
      path: /\/main\/(404|401|new)\.txt\?format=meta$/,
      method: "GET",
    })
    .reply(404, errorBody("Not found"))
    .persist();

  // Read file (foo.txt)
  agent
    .get(origin)
    .intercept({ path: `${sourcePath}/main/foo.txt`, method: "GET" })
    .reply(200, "foo")
    .persist();

  // Read file (Not found)
  agent
    .get(origin)
    .intercept({ path: `${sourcePath}/main/404.txt`, method: "GET" })
    .reply(404, errorBody("Not found"))
    .persist();

  /**
   * Bitbucket’s `src` endpoint is a single fixed URL for every create,
   * update and delete — the file path only appears as a field name inside
   * the multipart request body, which Undici’s `MockAgent` can’t inspect
   * (it sees a `FormData` body as the literal string `[object FormData]`).
   * So, rather than matching per file, these are registered as a queue:
   * each `it()` block below consumes the next one in order.
   */

  // 1. Creates file (new.txt)
  agent.get(origin).intercept({ path: sourcePath, method: "POST" }).reply(201, {
    type: "commit",
  });

  // 2. Throws error creating file (401.txt)
  agent
    .get(origin)
    .intercept({ path: sourcePath, method: "POST" })
    .reply(401, errorBody("Unauthorized"));

  // 3. Updates file (foo.txt)
  agent.get(origin).intercept({ path: sourcePath, method: "POST" }).reply(200, {
    type: "commit",
  });

  // 4. Updates and renames file (bar.txt) …
  agent.get(origin).intercept({ path: sourcePath, method: "POST" }).reply(200, {
    type: "commit",
  });

  // …5. … then deletes the old path (foo.txt)
  agent.get(origin).intercept({ path: sourcePath, method: "POST" }).reply(200, {
    type: "commit",
  });

  // 6. Throws error updating file (401.txt)
  agent
    .get(origin)
    .intercept({ path: sourcePath, method: "POST" })
    .reply(401, errorBody("Unauthorized"));

  // 7. Deletes a file (foo.txt)
  agent.get(origin).intercept({ path: sourcePath, method: "POST" }).reply(200, {
    type: "commit",
  });

  // 8. Throws error deleting a file (401.txt)
  agent
    .get(origin)
    .intercept({ path: sourcePath, method: "POST" })
    .reply(401, errorBody("Unauthorized"));

  return agent;
}
