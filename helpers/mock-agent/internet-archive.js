import { MockAgent } from "undici";

const agent = new MockAgent();
agent.disableNetConnect();

export const internetArchiveAgent = () => {
  const client = agent.get("https://web.archive.org");
  const authorization = "LOW 0123456789abcdef:abcdef0123456789";
  const job_id = "ac58789b-f3ca-48d0-9ea6-1d1225e98695";
  const url = "http://website.example/post/1";
  const timestamp = "20180326070330";

  // Request capture
  client
    .intercept({ method: "POST", path: "/save", headers: { authorization } })
    .reply(201, { job_id, url });

  // Request capture (Unauthorized)
  client.intercept({ method: "POST", path: "/save" }).reply(401, {
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
};
