import { MockAgent } from "undici";

export function mockClient({ instance = "https://getea.com" }) {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const client = agent.get(instance);
  const path = "/api/v1/repos/username/repo/contents/foo.txt";
  const getResponse = {
    content: "Zm9vYmFy", // ‘foobar’ Base64 encoded
    path: "foo.txt",
    sha: "1234",
  };

  // Create file
  client
    .intercept({ path, method: "POST" })
    .reply(201, { path: "foo.txt", branch: "main" });

  // Create file (Not Found)
  client
    .intercept({ path, method: "POST" })
    .reply(404, { message: "Not found" });

  // Read file
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);

  // Read file (Not Found)
  client
    .intercept({ path: `${path}?ref=main` })
    .reply(404, { message: "Not found" });

  // Update file
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);
  client
    .intercept({ path, method: "PUT" })
    .reply(200, { path: "foo.txt", branch: "main" });

  // Update file (Not Found)
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);
  client
    .intercept({ path, method: "PUT" })
    .reply(404, { message: "Not found" });

  // Delete file
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);
  client
    .intercept({ path, method: "DELETE" })
    .reply(200, { commit: { message: "Message" }, content: {} });

  // Delete file (Not Found)
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);
  client
    .intercept({ path, method: "DELETE" })
    .reply(404, { message: "Not found" });

  return client;
}
