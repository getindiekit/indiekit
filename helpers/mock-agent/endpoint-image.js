import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/fixtures";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const origin = "https://website.example";

  // Get media file
  agent
    .get(origin)
    .intercept({ path: "/photo.jpg" })
    .reply(200, getFixture("file-types/photo.jpg", false));

  // Get media file (Not Found)
  agent
    .get(origin)
    .intercept({ path: "/404.jpg" })
    .reply(404, { message: "Not found" });

  return agent;
}
