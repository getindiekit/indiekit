import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/get-fixture";

const agent = new MockAgent();
agent.disableNetConnect();

export const websiteAgent = () => {
  const client = agent.get("https://website.example");
  const post = getFixture("html/post.html", false);
  const page = getFixture("html/page.html", false);
  const photo = getFixture("file-types/photo.jpg", false);

  // Get post
  client.intercept({ method: "GET", path: "/post.html" }).reply(200, post);

  // Get page
  client.intercept({ method: "GET", path: "/page.html" }).reply(200, page);

  // Get page returns 404
  client.intercept({ method: "GET", path: "/404.html" }).reply(404, {
    message: "Not found",
  });

  // Get media files
  for (let path of [1, 2, 3, 4, 5, 6]) {
    path = `/photo${path}.jpg`;
    client.intercept({ path }).reply(200, photo);
  }

  // Get media file (Not Found)
  client.intercept({ path: "/image.jpg" }).reply(404, { message: "Not found" });

  return client;
};
