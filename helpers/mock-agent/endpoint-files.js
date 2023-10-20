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
  const mediaBadOrigin = "https://website.example/401.jpg";

  // Get source information for all items from external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: /\/\?q=source/,
    })
    .reply(200, {
      items: [
        {
          uid: "123",
          url: "https://website.example/photo.jpg",
        },
        {
          uid: "401",
          url: "https://website.example/401.jpg",
        },
      ],
    })
    .persist();

  // Get source information for single item from external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: /\/\?q=source&url=.+jpg/,
    })
    .reply(200, (options) => {
      const { searchParams } = new URL(options.path, options.origin);
      return { url: searchParams.get("url") };
    })
    .persist();

  // Upload file to external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: "/",
      method: "POST",
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
      },
    );

  // Upload file to external media endpoint (Unauthorized)
  agent
    .get("https://401-post-upload-unauthorized.example")
    .intercept({
      path: "/",
      method: "POST",
    })
    .reply(401, {});

  // Delete file at external media endpoint
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
      },
    );

  // Delete file at external media endpoint (Unauthorized)
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: `/?action=delete&url=${encodeURIComponent(mediaBadOrigin)}`,
      method: "POST",
    })
    .reply(401, {});

  return agent;
}
