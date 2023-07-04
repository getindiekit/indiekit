import test from "ava";
import { IndiekitError } from "@indiekit/error";
import { getFixture } from "@indiekit-test/fixtures";
import {
  createStatus,
  getStatusIdFromUrl,
  htmlToStatusText,
} from "../../lib/utils.js";

test.beforeEach((t) => {
  t.context = {
    me: "https://website.example",
    tweetUrl: "https://twitter.com/username/status/1234567890987654321",
  };
});

test("Creates a status with article post name and URL", (t) => {
  const result = createStatus(
    JSON.parse(getFixture("jf2/article-content-provided-html-text.jf2"))
  );

  t.is(result.status, "What I had for lunch https://foo.bar/lunchtime");
});

test("Creates a status with HTML content", (t) => {
  const result = createStatus(
    JSON.parse(getFixture("jf2/note-content-provided-html.jf2"))
  );

  t.is(result.status, "> I ate a cheese sandwich, which was > 10.");
});

test("Creates a status with HTML content and appends last link", (t) => {
  const result = createStatus(
    JSON.parse(getFixture("jf2/note-content-provided-html-with-link.jf2"))
  );

  t.is(
    result.status,
    "> I ate a cheese sandwich, which was > 10. https://en.wikipedia.org/wiki/Cheese"
  );
});

test("Creates a status with HTML content and doesn’t append Twitter link", (t) => {
  const result = createStatus(
    JSON.parse(
      getFixture("jf2/note-content-provided-html-with-twitter-link.jf2")
    )
  );

  t.is(result.status, "I ate a @cheese’s sandwich, which was nice.");
});

test("Creates a quote tweet with status URL and post content", (t) => {
  const result = createStatus(JSON.parse(getFixture("jf2/repost-twitter.jf2")));

  t.is(
    result.status,
    `Someone else who likes cheese sandwiches. ${t.context.tweetUrl}`
  );
});

test("Adds link to status post is in reply to", (t) => {
  const result = createStatus(JSON.parse(getFixture("jf2/reply-twitter.jf2")));

  t.is(result.status, "I ate a cheese sandwich too!");
  t.is(result.in_reply_to_status_id, "1234567890987654321");
});

test("Throws creating a status if post is off-service reply", (t) => {
  t.throws(
    () => {
      createStatus(JSON.parse(getFixture("jf2/reply-mastodon.jf2")));
    },
    {
      instanceOf: IndiekitError,
      message: "Not a reply to a URL at this target",
    }
  );
});

test("Creates a status with a location", (t) => {
  const result = createStatus(
    JSON.parse(getFixture("jf2/note-location-provided.jf2"))
  );

  t.is(result.status, "I ate a cheese sandwich right here!");
  t.is(result.lat, "37.780080");
  t.is(result.long, "-122.420160");
});

test("Creates a status with a photo", (t) => {
  const result = createStatus(
    {
      content: {
        html: "<p>Here’s the cheese sandwich I ate.</p>",
      },
    },
    ["1", "2", "3", "4"]
  );

  t.is(result.status, "Here’s the cheese sandwich I ate.");
  t.is(result.media_ids, "1,2,3,4");
});

test("Gets status ID from Twitter permalink", (t) => {
  const result = getStatusIdFromUrl(
    "https://twitter.com/paulrobertlloyd/status/1341502435760680961"
  );

  t.is(result, "1341502435760680961");
});

test("Convert HTML to status text", (t) => {
  const result = htmlToStatusText(
    "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>"
  );

  t.is(result, "I ate a cheese sandwich, which was nice.");
});

test("Convert HTML to status text, appending last link href if present", (t) => {
  const result = htmlToStatusText(
    '<p>Hello <a href="/hello">world</a>, hello <a href="https://moon.example">moon</a>.</p>'
  );

  t.is(result, "Hello world, hello moon. https://moon.example");
});
