import { getFixture } from "@indiekit-test/fixtures";
import { MockAgent } from "undici";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();

  // Get media file
  agent
    .get("https://website.example")
    .intercept({ path: "/photo1.jpg" })
    .reply(200, getFixture("file-types/photo.jpg", false))
    .persist();

  // Get media file (Not Found)
  agent
    .get("https://website.example")
    .intercept({ path: "/404.jpg" })
    .reply(404, {})
    .persist();

  return agent;
}
