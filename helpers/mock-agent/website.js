import { MockAgent } from "undici";
import { getFixture } from "@indiekit-test/get-fixture";

const agent = new MockAgent();
agent.disableNetConnect();

export const websiteAgent = () => {
  const client = agent.get("https://website.example");
  const photo = getFixture("file-types/photo.jpg", false);

  // Get media files
  for (let path of [1, 2, 3, 4, 5, 6]) {
    path = `/photo${path}.jpg`;
    client.intercept({ path }).reply(200, photo);
  }

  // Get media file (Not Found)
  client.intercept({ path: "/image.jpg" }).reply(404, { message: "Not found" });

  // Get categories
  client
    .intercept({ method: "GET", path: "/categories.json" })
    .reply(200, ["Foo", "Bar"]);

  // Get categories (Not Found)
  client
    .intercept({ method: "GET", path: "/404.json" })
    .reply(404, { message: "Not found" });

  return client;
};
