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
  const photoOrigin = "https://website.example/photo.jpg";
  const photoBadOrigin = "https://website.example/401.jpg";

  // Get source information for limited items from external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: "/?q=source&limit=20",
    })
    .reply(200, {
      items: [
        {
          uid: "123",
          url: photoOrigin,
        },
      ],
    })
    .persist();

  // Get source information for all items from external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: "/?q=source",
    })
    .reply(200, {
      items: [
        {
          uid: "123",
          url: photoOrigin,
        },
        {
          uid: "401",
          url: photoBadOrigin,
        },
      ],
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
        success_description: photoOrigin,
      },
      {
        headers: {
          location: photoOrigin,
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
      path: `/?action=delete&url=${encodeURIComponent(photoOrigin)}`,
      method: "POST",
    })
    .reply(
      201,
      {
        success: "delete",
        success_description: photoOrigin,
      },
      {
        headers: {
          location: photoOrigin,
        },
      },
    );

  // Delete file at external media endpoint (Unauthorized)
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: `/?action=delete&url=${encodeURIComponent(photoBadOrigin)}`,
      method: "POST",
    })
    .reply(401, {});

  return agent;
}
