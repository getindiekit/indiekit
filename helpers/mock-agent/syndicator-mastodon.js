import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/fixtures";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const id = "1234567890987654321";
  const instanceOrigin = "https://mastodon.example";
  const statusResponse = {
    id,
    url: `https://mastodon.example/@username/${id}`,
  };
  const responseOptions = {
    headers: { "Content-type": "application/json" },
  };
  const websiteOrigin = "https://website.example";

  // Post favourite
  agent
    .get(instanceOrigin)
    .intercept({ path: `/api/v1/statuses/${id}/favourite`, method: "POST" })
    .reply(200, statusResponse, responseOptions)
    .persist();

  // Post favourite (Not Found)
  agent
    .get(instanceOrigin)
    .intercept({ path: `/api/v1/statuses/404/favourite`, method: "POST" })
    .reply(404, { error: "Record not found" }, responseOptions);

  // Post reblog
  agent
    .get(instanceOrigin)
    .intercept({ path: `/api/v1/statuses/${id}/reblog`, method: "POST" })
    .reply(200, statusResponse, responseOptions)
    .persist();

  // Post reblog (Not Found)
  agent
    .get(instanceOrigin)
    .intercept({ path: `/api/v1/statuses/404/reblog`, method: "POST" })
    .reply(404, { error: "Record not found" }, responseOptions);

  // Post status
  agent
    .get(instanceOrigin)
    .intercept({
      path: `/api/v1/statuses`,
      headers: { authorization: "Bearer token" },
      method: "POST",
    })
    .reply(200, statusResponse, responseOptions)
    .persist();

  // Post status (Unauthorized)
  agent
    .get(instanceOrigin)
    .intercept({
      path: `/api/v1/statuses`,
      headers: { authorization: "Bearer invalid" },
      method: "POST",
    })
    .reply(401, { error: "The access token is invalid" }, responseOptions);

  // Media information
  agent
    .get(instanceOrigin)
    .intercept({ path: "/api/v1/media/1" })
    .reply(
      200,
      { id: 1, url: `https://mastodon.example/1.jpg` },
      responseOptions,
    )
    .persist();

  // Upload media
  agent
    .get(instanceOrigin)
    .intercept({
      path: `/api/v2/media`,
      method: "POST",
    })
    .reply(202, { id: 1, type: "image" }, responseOptions)
    .persist();

  // Upload media (Not Found)
  agent
    .get(instanceOrigin)
    .intercept({
      path: `/api/v2/media`,
      method: "POST",
    })
    .reply(404, { error: "Record not found" }, responseOptions)
    .persist();

  // Get media file
  agent
    .get(websiteOrigin)
    .intercept({ path: "/photo1.jpg" })
    .reply(200, getFixture("file-types/photo.jpg", false))
    .persist();

  // Get media file (Not Found)
  agent
    .get(websiteOrigin)
    .intercept({ path: "/404.jpg" })
    .reply(404, {})
    .persist();

  return agent;
}
