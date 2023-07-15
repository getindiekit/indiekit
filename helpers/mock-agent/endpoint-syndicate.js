import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect(/(?:127\.0\.0\.1:\d{5})/);

  const statusId = "1234567890987654321";
  const storeOrigin = "https://store.example";
  const syndicatorOrigin = "https://mastodon.example";
  const syndicatorResponseOptions = {
    headers: { "Content-type": "application/json" },
  };

  // Create file on content store
  agent
    .get(storeOrigin)
    .intercept({ path: /\/user\/.*\.(md|jpg)/, method: "PUT" })
    .reply(201);

  // Update file on content store
  agent
    .get(storeOrigin)
    .intercept({ path: /\/user\/.*\.(md|jpg)/, method: "PATCH" })
    .reply(201);

  // Get instance information from syndication target
  agent
    .get(syndicatorOrigin)
    .intercept({
      path: `/api/v1/instance`,
    })
    .reply(
      200,
      {
        uri: syndicatorOrigin,
        urls: { streaming_api: "https://streaming.mastodon.example" },
        version: "4.1.2",
      },
      syndicatorResponseOptions
    )
    .persist();

  // Post status to syndication target
  agent
    .get(syndicatorOrigin)
    .intercept({ path: `/api/v1/statuses`, method: "POST" })
    .reply(
      200,
      {
        id: statusId,
        url: `https://mastodon.example/@username/${statusId}`,
      },
      syndicatorResponseOptions
    )
    .persist();

  return agent;
}
