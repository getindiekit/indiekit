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
          "media-type": "photo",
          url: photoOrigin,
        },
        {
          uid: "456",
          "media-type": "audio",
          url: "https://website.example/audio.mp3",
        },
      ],
    })
    .persist();

  // A default-sized listing page (the shape `q=source` returns with no
  // `uid`/`url` and no explicit `limit`) that does not include the file
  // fetched by uid below — it's older than the newest page of uploads.
  const items = Array.from({ length: 40 }, (_, index) => ({
    uid: `other-${index}`,
    url: `https://website.example/other-${index}.jpg`,
  }));

  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: "/?q=source",
    })
    .reply(200, { items })
    .persist();

  // Get source information for a single file by uid from external media endpoint
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: "/",
      query: { q: "source", uid: "123" },
    })
    .reply(200, {
      uid: "123",
      "media-type": "photo",
      url: photoOrigin,
    })
    .persist();

  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: "/",
      query: { q: "source", uid: "401" },
    })
    .reply(200, {
      uid: "401",
      "media-type": "photo",
      url: photoBadOrigin,
    })
    .persist();

  // Get source information for a file older than the newest page of uploads
  agent
    .get(mediaEndpointOrigin)
    .intercept({
      path: "/",
      query: { q: "source", uid: "target-uid" },
    })
    .reply(200, {
      uid: "target-uid",
      "media-type": "photo",
      url: "https://website.example/target.jpg",
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
