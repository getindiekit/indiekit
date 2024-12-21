import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const micropubEndpointOrigin = "https://micropub-endpoint.example";
  const postOrigin = "https://website.example/foobar";
  const postBadOrigin = "https://website.example/401";

  // Get source information for limited items from external micropub endpoint
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/?q=source&limit=12",
    })
    .reply(200, {
      items: [
        {
          type: ["h-entry"],
          properties: {
            uid: ["123"],
            name: ["Foobar"],
            "post-type": ["note"],
            published: ["2024-12-21"],
            url: [postOrigin],
          },
        },
      ],
    })
    .persist();

  // Get source information for all items from external micropub endpoint
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/?q=source",
    })
    .reply(200, {
      items: [
        {
          type: ["h-entry"],
          properties: {
            uid: ["123"],
            name: ["Foobar"],
            "post-type": ["note"],
            published: ["2024-12-21"],
            url: [postOrigin],
          },
        },
        {
          type: ["h-entry"],
          properties: {
            uid: ["401"],
            name: ["401"],
            "post-type": ["note"],
            url: [postBadOrigin],
          },
        },
      ],
    })
    .persist();

  // Upload file to external micropub endpoint
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/",
      method: "POST",
    })
    .reply(
      201,
      {
        success: "create",
        success_description: postOrigin,
      },
      {
        headers: {
          location: postOrigin,
        },
      },
    );

  // Upload file to external micropub endpoint (Unauthorized)
  agent
    .get("https://401-post-upload-unauthorized.example")
    .intercept({
      path: "/",
      method: "POST",
    })
    .reply(401, {});

  // Delete file at external micropub endpoint
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: `/?action=delete&url=${encodeURIComponent(postOrigin)}`,
      method: "POST",
    })
    .reply(
      201,
      {
        success: "delete",
        success_description: postOrigin,
      },
      {
        headers: {
          location: postOrigin,
        },
      },
    );

  // Delete file at external micropub endpoint (Unauthorized)
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: `/?action=delete&url=${encodeURIComponent(postBadOrigin)}`,
      method: "POST",
    })
    .reply(401, {});

  return agent;
}
