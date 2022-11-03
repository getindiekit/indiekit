import { MockAgent } from "undici";

export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const client = agent.get("https://api.github.com");
  const path = /\/repos\/user\/repo\/contents\/.*\.md/;
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
    content: null,
    commit: { message: "Message" },
  };
  const errorResponse = {
    message: "Bad credentials",
    documentation_url: "https://docs.github.com/rest",
  };

  // Create/update file
  client
    .intercept({ path, method: "PUT" })
    .reply(201, createResponse)
    .persist();

  // Create/update file (Unauthorized)
  client
    .intercept({
      path: /.*401\.txt/,
      method: "PUT",
    })
    .reply(401, errorResponse);

  // Read file
  client.intercept({ path }).reply(200, readResponse).persist();

  // Read file (Unauthorized)
  client
    .intercept({
      path: /.*401\.txt/,
    })
    .reply(401, errorResponse)
    .persist();

  // Read file (Not Found)
  client
    .intercept({ path: /.*404\.txt/ })
    .reply(404)
    .persist();

  // Delete file
  client.intercept({ path, method: "DELETE" }).reply(200, deleteResponse);

  return client;
}
