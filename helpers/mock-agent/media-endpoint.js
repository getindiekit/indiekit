import process from "node:process";
import { MockAgent } from "undici";

export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const client = agent.get("https://media-endpoint.example");

  // Upload media
  for (const path of [1, 2, 3, 4, 5, 6]) {
    client
      .intercept({
        path: "/",
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.TEST_TOKEN}`,
        },
      })
      .reply(
        201,
        {
          success: "create",
          description: `https://website.example/media/photo${path}.jpg`,
          type: "photo",
        },
        {
          headers: {
            location: `https://website.example/media/photo${path}.jpg`,
          },
        }
      );
  }

  // Upload media (Unauthorized)
  client
    .intercept({
      path: "/",
      method: "POST",
      headers: {
        authorization: "Bearer foobar",
      },
    })
    .reply(400, {
      error_description: "The token provided was malformed",
    });

  return client;
}
