import test from "ava";
import { getFixture } from "@indiekit-test/fixtures";
import { jf2ToMf2 } from "../../lib/mf2.js";

test("Convert JF2 to mf2", (t) => {
  const jf2 = JSON.parse(getFixture("jf2/all-properties.jf2"));
  const result = jf2ToMf2(jf2);

  t.deepEqual(result, {
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
      checkin: [
        {
          type: ["h-card"],
          properties: {
            latitude: ["50"],
            longitude: ["0"],
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
