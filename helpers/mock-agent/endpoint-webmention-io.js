import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const origin = "https://webmention.io";

  agent
    .get(origin)
    .intercept({
      path: "/api/mentions.jf2",
      query: {
        token: "abcd1234",
        domain: "website.example",
        "per-page": 20,
      },
    })
    .reply(200, {
      type: "feed",
      name: "Webmentions",
      children: [
        {
          type: "entry",
          author: {
            type: "card",
            name: "Example",
            url: "https://person.example",
          },
          url: "https://person.example/likes/1/",
          published: "2024-12-25T19:00:00+00:00",
          "wm-received": "2024-12-25T19:00:00+00:00",
          "wm-id": 1,
          "wm-source": "https://person.example/likes/1/",
          "wm-target": "https://getindiekit.com",
          "wm-protocol": "webmention",
          content: {
            "content-type": "text/html",
            value: "<p>This looks interesting.</p>",
            html: "<p>This looks interesting.</p>",
            text: "This looks interesting.",
          },
          "like-of": "https://getindiekit.com",
          "wm-property": "like-of",
          "wm-private": false,
        },
      ],
    })
    .persist();

  return agent;
}
