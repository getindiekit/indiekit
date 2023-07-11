import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/fixtures";
import { testToken } from "@indiekit-test/token";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const mediaEndpointOrigin = "https://media-endpoint.example";
  const storeOrigin = "https://store.example";
  const websiteOrigin = "https://website.example";

  // Upload files to external media endpoint
  for (const path of [1, 2, 3, 4, 5, 6]) {
    agent
      .get(mediaEndpointOrigin)
      .intercept({
        path: "/",
        method: "POST",
        headers: {
          authorization: `Bearer ${testToken()}`,
        },
      })
      .reply(
        201,
        {
          success: "create",
          success_description: `https://website.example/media/photo${path}.jpg`,
          type: "photo",
        },
        {
          headers: {
            location: `https://website.example/media/photo${path}.jpg`,
          },
        }
      );
  }

  // Upload files to external media endpoint (Unauthorized)
  agent
    .get(mediaEndpointOrigin)
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

  // Create file on content store (Unauthorized)
  agent
    .get(storeOrigin)
    .intercept({ path: /.*401\.md/, method: "PUT" })
    .reply(401);

  // Create file on content store
  agent
    .get(storeOrigin)
    .intercept({ path: /\/user\/.*\.(md|jpg)/, method: "PUT" })
    .reply(201);

  // Update file on content store
  agent
    .get(storeOrigin)
    .intercept({ path: /\/user\/.*\.(md|jpg)/, method: "PATCH" })
    .reply(201)
    .persist();

  // Delete file on content store
  agent
    .get(storeOrigin)
    .intercept({ path: /\/user\/.*\.(md|jpg)/, method: "DELETE" })
    .reply(200);

  // Website post
  agent
    .get(websiteOrigin)
    .intercept({ path: "/post" })
    .reply(200, getFixture("html/post.html"));

  return agent;
}
