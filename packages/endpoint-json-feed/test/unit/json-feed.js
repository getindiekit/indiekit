import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { getFixture } from "@indiekit-test/fixtures";
import { jsonFeed } from "../../lib/json-feed.js";

describe("endpoint-json-feed/lib/json-feed", () => {
  it("Generates JSON Feed", () => {
    const application = {
      name: "Test",
      url: "https://server.example",
      locale: "en",
    };
    const feedUrl = "https://server.example/feed.json";
    const posts = [
      {
        path: "cheese-sandwich.md",
        properties: JSON.parse(getFixture("jf2/all-properties.jf2")),
      },
    ];
    const result = jsonFeed(application, feedUrl, posts);

    assert.equal(result.items[0].summary, "A very satisfactory meal.");
    assert.equal(result.items[0].attachments.length, 3);
    assert.deepEqual(result.items[0].tags, ["lunch", "food"]);
  });
});
