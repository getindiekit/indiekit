import process from "node:process";
import { MockAgent } from "undici";

const agent = new MockAgent();
agent.disableNetConnect();

export const mediaEndpointAgent = () => {
  const client = agent.get("https://media-endpoint.example");

  // Upload media
  for (const path of [1, 2, 3, 4, 5, 6]) {
    client
      .intercept({
        method: "POST",
        path: "/",
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
      method: "POST",
      path: "/",
      headers: {
        authorization: `Bearer foobar`,
      },
    })
    .reply(400, {
      error_description: "The token provided was malformed",
    });

  return client;
};
