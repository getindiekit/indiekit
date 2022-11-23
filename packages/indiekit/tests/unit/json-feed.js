import test from "ava";
import { getFixture } from "@indiekit-test/fixtures";
import { jsonFeed } from "../../lib/json-feed.js";

test("Generates JSON Feed", (t) => {
  const application = {
    name: "Test",
    url: "https://server.example",
    locale: "en",
  };
  const feedUrl = "https://server.example/feed.json";
  const posts = [
    {
      lastAction: "create",
      path: "cheese-sandwich.md",
      properties: JSON.parse(getFixture("jf2/all-properties.jf2")),
    },
  ];
  const result = jsonFeed(application, feedUrl, posts);

  t.is(result.items[0].summary, "A very satisfactory meal.");
  t.is(result.items[0].attachments.length, 3);
  t.deepEqual(result.items[0].tags, ["lunch", "food"]);
});
