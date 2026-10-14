import { MockAgent } from "@indiekit-test/undici";

/**
 * @returns {MockAgent} Undici MockAgent
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
      _count: 1,
    })
    .persist();

  // Get source information for posts filtered by post type and text
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/",
      query: {
        q: "source",
        limit: "12",
        "post-type": "bookmark",
        filter: "lunch & dinner",
      },
    })
    .reply(200, {
      items: [
        {
          type: ["h-entry"],
          properties: {
            uid: ["456"],
            name: ["Lunch spots"],
            "post-type": ["bookmark"],
            published: ["2024-12-22"],
            url: ["https://website.example/lunch-spots"],
          },
        },
      ],
      paging: { after: "456" },
      _count: 1,
    })
    .persist();

  // Get source information for posts filtered by post type alone
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/",
      query: { q: "source", limit: "12", "post-type": "bookmark" },
    })
    .reply(200, {
      items: [
        {
          type: ["h-entry"],
          properties: {
            uid: ["456"],
            name: ["Lunch spots"],
            "post-type": ["bookmark"],
            published: ["2024-12-22"],
            url: ["https://website.example/lunch-spots"],
          },
        },
      ],
      _count: 1,
    })
    .persist();

  // Get source information for posts filtered by a post type with no posts
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/",
      query: { q: "source", limit: "12", "post-type": "photo" },
    })
    .reply(200, { items: [], _count: 0 })
    .persist();

  // Get source information for posts filtered by text alone
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/",
      query: {
        q: "source",
        limit: "12",
        filter: "lunch & dinner",
      },
    })
    .reply(200, {
      items: [
        {
          type: ["h-entry"],
          properties: {
            uid: ["456"],
            name: ["Lunch spots"],
            "post-type": ["bookmark"],
            published: ["2024-12-22"],
            url: ["https://website.example/lunch-spots"],
          },
        },
      ],
      _count: 1,
    })
    .persist();

  // Get source information for posts filtered by text that must not be
  // rendered as markup
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/",
      query: {
        q: "source",
        limit: "12",
        filter: "<script>alert(1)</script>",
      },
    })
    .reply(200, {
      items: [
        {
          type: ["h-entry"],
          properties: {
            uid: ["456"],
            name: ["Lunch spots"],
            "post-type": ["bookmark"],
            published: ["2024-12-22"],
            url: ["https://website.example/lunch-spots"],
          },
        },
      ],
      _count: 1,
    })
    .persist();

  // Get source information for a single post by uid from external micropub endpoint
  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/",
      query: { q: "source", uid: "123" },
    })
    .reply(200, {
      type: ["h-entry"],
      properties: {
        uid: ["123"],
        name: ["Foobar"],
        "post-type": ["note"],
        published: ["2024-12-21"],
        url: [postOrigin],
      },
    })
    .persist();

  agent
    .get(micropubEndpointOrigin)
    .intercept({
      path: "/",
      query: { q: "source", uid: "401" },
    })
    .reply(200, {
      type: ["h-entry"],
      properties: {
        uid: ["401"],
        name: ["401"],
        "post-type": ["note"],
        url: [postBadOrigin],
      },
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

/**
 * import { MockAgent } from "undici-v8"
 */
