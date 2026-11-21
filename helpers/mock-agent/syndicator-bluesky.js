import { getFixture } from "@indiekit-test/fixtures";
import { MockAgent } from "@indiekit-test/undici";

/**
 * @param {object} [options] - Options
 * @param {MockPds} [options.pds] - Mock AT Protocol PDS to intercept requests to
 * @returns {InstanceType<typeof MockAgent>} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export function mockClient({ pds } = {}) {
  const agent = new MockAgent();

  // Get media file
  agent
    .get("https://website.example")
    .intercept({ path: "/photo1.jpg" })
    .reply(200, getFixture("file-types/photo.jpg", false), {
      headers: { "content-type": "image/jpeg" },
    })
    .persist();

  // Get media file (Not Found)
  agent
    .get("https://website.example")
    .intercept({ path: "/404.jpg" })
    .reply(404, {})
    .persist();

  // AT Protocol PDS
  pds?.intercept(agent);

  return agent;
}

/**
 * import { MockAgent } from "undici-v8"
 */

/**
 * @import { MockPds } from "@indiekit-test/atproto-pds"
 */
