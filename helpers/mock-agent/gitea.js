import { MockAgent } from "undici";

const agent = new MockAgent();
agent.disableNetConnect();

export const giteaAgent = (instance = "https://getea.com") => {
  const client = agent.get(instance);
  const path = "/api/v1/repos/username/repo/contents/foo.txt";
  const getResponse = {
    content: "Zm9vYmFy", // ‘foobar’ Base64 encoded
    path: "foo.txt",
    sha: "\b[0-9a-f]{5,40}\b",
  };

  // Create file
  client
    .intercept({ method: "POST", path })
    .reply(201, { path: "foo.txt", branch: "main" });

  // Create file (Not Found)
  client
    .intercept({ method: "POST", path })
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
    .intercept({ method: "PUT", path })
    .reply(200, { path: "foo.txt", branch: "main" });

  // Update file (Not Found)
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);
  client
    .intercept({ method: "PUT", path })
    .reply(404, { message: "Not found" });

  // Delete file
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);
  client
    .intercept({ method: "DELETE", path })
    .reply(200, { commit: { message: "Message" }, content: {} });

  // Delete file (Not Found)
  client.intercept({ path: `${path}?ref=main` }).reply(200, getResponse);
  client
    .intercept({ method: "DELETE", path })
    .reply(404, { message: "Not found" });

  return client;
};
