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

  // Get media files
  for (let index of [1, 2, 3, 4, 5, 6]) {
    let path = `/photo${index}.jpg`;
    agent
      .get(origin)
      .intercept({ path })
      .reply(200, getFixture("file-types/photo.jpg", false));
  }

  // Get media file (Not Found)
  agent.get(origin).intercept({ path: "/404.jpg" }).reply(404);

  return agent;
}
