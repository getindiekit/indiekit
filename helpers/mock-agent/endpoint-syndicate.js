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
  const mastodonOrigin = "https://mastodon.example";
  const internetArchiveOrigin = "https://web.archive.org";
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

  // Successfully syndicate post to Mastodon
  agent
    .get(mastodonOrigin)
    .intercept({ path: `/api/v1/statuses`, method: "POST" })
    .reply(
      200,
      {
        id: statusId,
        url: `https://mastodon.example/@username/${statusId}`,
      },
      syndicatorResponseOptions,
    )
    .persist();

  // Fail syndicating post to Internet Archive
  agent
    .get(internetArchiveOrigin)
    .intercept({ path: "/save", method: "POST" })
    .reply(401, {
      message: "You need to be logged in to use Save Page Now.",
    });

  return agent;
}
