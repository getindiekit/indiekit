import { MockAgent } from "undici";

/**
 * @returns {Function} Undici MockClient
 * @see {@link: https://undici.nodejs.org/#/docs/api/MockClient}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const client = agent.get("https://web.archive.org");
  const authorization = "LOW token:secret";
  const job_id = "ac58789b-f3ca-48d0-9ea6-1d1225e98695";
  const url = "http://website.example/post/1";
  const timestamp = "20180326070330";

  // Request capture
  client
    .intercept({ path: "/save", method: "POST", headers: { authorization } })
    .reply(201, { job_id, url });

  // Request capture (Unauthorized)
  client.intercept({ path: "/save", method: "POST" }).reply(401, {
    message: "You need to be logged in to use Save Page Now.",
  });

  // Capture status
  client
    .intercept({ path: `/save/status/${job_id}`, headers: { authorization } })
    .reply(200, { status: "pending" });
  client
    .intercept({ path: `/save/status/${job_id}`, headers: { authorization } })
    .reply(200, { status: "success", original_url: url, timestamp });

  // Capture status with error message
  client
    .intercept({ path: "/save/status/foobar", headers: { authorization } })
    .reply(200, {
      status: "error",
      message: `Couldn't resolve host for ${url}`,
    });

  // Capture status (Unauthorized)
  client.intercept({ path: `/save/status/${job_id}` }).reply(401, {
    message: "You need to be logged in to use Save Page Now.",
  });

  return client;
}
