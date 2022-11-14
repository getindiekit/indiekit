import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/fixtures";

/**
 * @returns {Function} Undici MockClient
 * @see {@link https://undici.nodejs.org/#/docs/api/MockClient}
 */
export function mockClient() {
  const agent = new MockAgent();
  agent.disableNetConnect();

  const client = agent.get("https://website.example");

  // Get post
  const post = getFixture("html/post.html");
  client.intercept({ path: "/post.html" }).reply(200, post);

  // Get media files
  const photo = getFixture("file-types/photo.jpg", false);
  for (let path of [1, 2, 3, 4, 5, 6]) {
    path = `/photo${path}.jpg`;
    client.intercept({ path }).reply(200, photo);
  }

  // Get media file (Not Found)
  client.intercept({ path: "/image.jpg" }).reply(404, { message: "Not found" });

  // Get categories
  client.intercept({ path: "/categories.json" }).reply(200, ["Foo", "Bar"]);

  // Get categories (Not Found)
  client.intercept({ path: "/404.json" }).reply(404, { message: "Not found" });

  return client;
}
