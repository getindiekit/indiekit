import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const authorization = "LOW token:secret";
  const job_id = "ac58789b-f3ca-48d0-9ea6-1d1225e98695";
  const origin = "https://web.archive.org";
  const timestamp = "20180326070330";
  const url = "http://website.example/post/1";

  // Request capture
  agent
    .get(origin)
    .intercept({ path: "/save", method: "POST", headers: { authorization } })
    .reply(201, { job_id, url });

  // Request capture (Unauthorized)
  agent.get(origin).intercept({ path: "/save", method: "POST" }).reply(401, {
    message: "You need to be logged in to use Save Page Now.",
  });

  // Capture status (pending)
  agent
    .get(origin)
    .intercept({ path: `/save/status/${job_id}`, headers: { authorization } })
    .reply(200, { status: "pending" });

  // Capture status (success)
  agent
    .get(origin)
    .intercept({ path: `/save/status/${job_id}`, headers: { authorization } })
    .reply(200, { status: "success", original_url: url, timestamp });

  // Capture status (error)
  agent
    .get(origin)
    .intercept({ path: "/save/status/foobar", headers: { authorization } })
    .reply(200, {
      status: "error",
      message: `Couldn't resolve host for ${url}`,
    });

  // Capture status (Unauthorized)
  agent
    .get(origin)
    .intercept({ path: `/save/status/${job_id}` })
    .reply(401, {
      message: "You need to be logged in to use Save Page Now.",
    });

  return agent;
}
