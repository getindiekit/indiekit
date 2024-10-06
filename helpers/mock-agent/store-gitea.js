import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const origin = /https:\/\/gitea\..*/;
  const path = /\/api\/v1\/repos\/username\/repo\/contents\/(foo|bar).txt/;
  const getResponse = {
    content: "Zm9v", // ‘foo’ Base64 encoded
    path: "foo.txt",
    sha: "1234",
  };

  // Create new file
  agent
    .get(origin)
    .intercept({ path: /.*new\.txt/, method: "POST" })
    .reply(201, (options) => ({
      branch: "main",
      commit: { html_url: `${options.origin}/username/repo/new.txt` },
      path: "foo.txt",
    }))
    .persist();

  // Create/update file
  agent
    .get(origin)
    .intercept({ path, method: "POST" })
    .reply(201, (options) => ({
      branch: "main",
      commit: { html_url: `${options.origin}/username/repo/foo.txt` },
      path: "foo.txt",
    }))
    .persist();

  // Create file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.txt/, method: "POST" })
    .reply(401, { message: "Unauthorized" });

  // Read file
  agent
    .get(origin)
    .intercept({ path, method: "GET" })
    .reply(200, getResponse)
    .persist();

  // Read file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.txt/, method: "GET" })
    .reply(401, { message: "Unauthorized" })
    .persist();

  // Read file (Not Found)
  agent
    .get(origin)
    .intercept({ path: /.*404\.txt/, method: "GET" })
    .reply(404, { message: "Not found" })
    .persist();

  // Update and rename file
  agent
    .get(origin)
    .intercept({ path: /.*bar\.txt/, method: "PUT" })
    .reply(200, (options) => ({
      branch: "main",
      commit: { html_url: `${options.origin}/username/repo/bar.txt` },
      path: "bar.txt",
    }))
    .persist();

  // Update file
  agent
    .get(origin)
    .intercept({ path, method: "PUT" })
    .reply(200, (options) => ({
      branch: "main",
      commit: { html_url: `${options.origin}/username/repo/foo.txt` },
      path: "foo.txt",
    }))
    .persist();

  // Delete file
  agent
    .get(origin)
    .intercept({ path, method: "DELETE" })
    .reply(200, { commit: { message: "Message" }, content: {} });

  return agent;
}
