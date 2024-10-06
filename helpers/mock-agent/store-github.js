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
  const path = /\/repos\/user\/repo\/contents\/(foo|bar)\.txt/;
  const createNewResponse = {
    content: {
      path: "new.txt",
      html_url: "https://github.com/user/repo/blob/main/new.txt",
    },
    commit: { message: "Message" },
  };
  const createResponse = {
    content: {
      path: "foo.txt",
      html_url: "https://github.com/user/repo/blob/main/foo.txt",
    },
    commit: { message: "Message" },
  };
  const updateResponse = {
    content: {
      path: "bar.txt",
      html_url: "https://github.com/user/repo/blob/main/bar.txt",
    },
    commit: { message: "Message" },
  };
  const readResponse = {
    content: "Zm9v", // ‘foo’ Base64 encoded
    path: "foo.txt",
    sha: "1234",
  };
  const deleteResponse = {
    commit: { message: "Message" },
  };

  // Create new file
  agent
    .get(origin)
    .intercept({ path: /.*new\.txt/, method: "PUT" })
    .reply(201, createNewResponse)
    .persist();

  // Create/update file
  agent
    .get(origin)
    .intercept({ path: /.*foo\.txt/, method: "PUT" })
    .reply(201, createResponse)
    .persist();

  // Create/update file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.txt/, method: "PUT" })
    .reply(401);

  // Update and rename file
  agent
    .get(origin)
    .intercept({ path: /.*bar\.txt/, method: "PUT" })
    .reply(201, updateResponse)
    .persist();

  // Read file
  agent
    .get(origin)
    .intercept({ path, method: "GET" })
    .reply(200, readResponse)
    .persist();

  // Read file (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: /.*401\.txt/, method: "GET" })
    .reply(401)
    .persist();

  // Read file (Not Found)
  agent
    .get(origin)
    .intercept({ path: /.*404\.txt/, method: "GET" })
    .reply(404)
    .persist();

  // Delete file
  agent
    .get(origin)
    .intercept({ path, method: "DELETE" })
    .reply(200, deleteResponse)
    .persist();

  return agent;
}
