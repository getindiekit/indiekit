import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getFixture } from "@indiekit-test/fixtures";

import { jf2ToMf2 } from "../../lib/mf2.js";

describe("endpoint-micropub/lib/mf2", () => {
  it("Convert JF2 to mf2", () => {
    const properties = JSON.parse(getFixture("jf2/all-properties.jf2"));
    const postData = { properties };
    const result = jf2ToMf2(postData);

    assert.deepEqual(result, {
      type: ["h-entry"],
      properties: {
        url: ["https://website.example/posts/cheese-sandwich"],
        name: ["What I had for lunch"],
        content: [
          {
            html: '<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>',
            value:
              "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
          },
        ],
        summary: ["A very satisfactory meal."],
        published: ["2020-02-02"],
        category: ["lunch", "food"],
        audio: [
          {
            url: "https://website.example/audio.mp3",
          },
        ],
        photo: [
          {
            alt: "Alternative text",
            url: "https://website.example/photo.jpg",
          },
        ],
        video: [
          {
            url: "https://website.example/video.mp4",
          },
        ],
        start: ["2020-02-02"],
        end: ["2020-02-20"],
        rsvp: ["Yes"],
        location: [
          {
            type: ["h-geo"],
            properties: {
              latitude: ["37.780080"],
              longitude: ["-122.420160"],
              name: ["37° 46′ 48.29″ N 122° 25′ 12.576″ W"],
            },
          },
        ],
        "bookmark-of": ["https://website.example"],
        "like-of": ["https://website.example"],
        "repost-of": ["https://website.example"],
        "in-reply-to": ["https://website.example"],
        "post-status": ["draft"],
        visibility: ["private"],
        syndication: ["https://website.example/post/12345"],
        "mp-slug": ["cheese-sandwich"],
        "mp-syndicate-to": ["https://mastodon.example"],
      },
    });
  });

  it("passes a stored uid through, and invents none without one", () => {
    const withUid = jf2ToMf2({
      properties: {
        type: "entry",
        uid: "01a0966c-ef50-79c5-a36d-33c045813e4b",
      },
    });
    assert.deepEqual(withUid.properties.uid, [
      "01a0966c-ef50-79c5-a36d-33c045813e4b",
    ]);

    const withoutUid = jf2ToMf2({
      _id: "6aa54e8a9bb0f7b129092770",
      properties: { type: "entry" },
    });
    assert.equal(
      withoutUid.properties.uid,
      undefined,
      "synthesised a uid from _id",
    );
  });
});
