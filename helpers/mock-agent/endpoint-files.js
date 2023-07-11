import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const mediaEndpointOrigin = "https://media-endpoint.example";
  const mediaOrigin = "https://website.example/photo.jpg";

  // Get source information from external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: `/?q=source&url=${encodeURIComponent(mediaOrigin)}`,
    })
    .reply(200, { url: "https://website.example/photo.jpg" })
    .persist();

  // Upload file to external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: `/?action=delete&url=${encodeURIComponent(mediaOrigin)}`,
      method: "POST",
    })
    .reply(
      201,
      {
        success: "delete",
        success_description: mediaOrigin,
      },
      {
        headers: {
          location: mediaOrigin,
        },
      }
    );

  // Upload file to external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: "/",
      method: "POST",
      // headers: { authorization: `Bearer ${testToken()}` },
    })
    .reply(
      201,
      {
        success: "create",
        success_description: mediaOrigin,
      },
      {
        headers: {
          location: mediaOrigin,
        },
      }
    );

  // Upload file to external media endpoint
  agent
    .get("https://401-post-upload-unauthorized.example")
    .intercept({
      path: "/",
      method: "POST",
    })
    .reply(401, {});

  return agent;
}
