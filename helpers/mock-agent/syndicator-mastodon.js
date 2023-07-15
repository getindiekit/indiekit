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
  const instanceResponse = {
    uri: instanceOrigin,
    urls: { streaming_api: "https://streaming.mastodon.example" },
    version: "4.1.2",
  };
  const statusResponse = {
    id,
    url: `https://mastodon.example/@username/${id}`,
  };
  const responseOptions = {
    headers: { "Content-type": "application/json" },
  };
  const websiteOrigin = "https://website.example";

  // Instance information
  agent
    .get(instanceOrigin)
    .intercept({
      path: `/api/v1/instance`,
      headers: { authorization: "Bearer token" },
    })
    .reply(200, instanceResponse, responseOptions)
    .persist();

  // Instance information (Unauthorized, invalid access token)
  agent
    .get(instanceOrigin)
    .intercept({
      path: `/api/v1/instance`,
      headers: {
        authorization: "Bearer invalid",
      },
    })
    .reply(401)
    .persist();

  // Instance information (Unauthorized, no access token provided)
  agent
    .get(instanceOrigin)
    .intercept({
      path: `/api/v1/instance`,
    })
    .reply(401)
    .persist();

  // Post favourite
  agent
    .get(instanceOrigin)
    .intercept({ path: `/api/v1/statuses/${id}/favourite`, method: "POST" })
    .reply(200, statusResponse, responseOptions)
    .persist();

  // Post reblog
  agent
    .get(instanceOrigin)
    .intercept({ path: `/api/v1/statuses/${id}/reblog`, method: "POST" })
    .reply(200, statusResponse, responseOptions)
    .persist();

  // Post status
  agent
    .get(instanceOrigin)
    .intercept({ path: `/api/v1/statuses`, method: "POST" })
    .reply(200, statusResponse, responseOptions)
    .persist();

  // Media information
  agent
    .get(instanceOrigin)
    .intercept({ path: "/api/v1/media/1" })
    .reply(
      200,
      { id: 1, url: `https://mastodon.example/1.jpg` },
      responseOptions
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
