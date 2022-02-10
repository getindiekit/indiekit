import test from "ava";
import { getPostType } from "../../lib/post-type-discovery.js";

test("Discovers note post type", (t) => {
  const result = getPostType({
    type: "entry",
    content: "Note content",
  });

  t.is(result, "note");
});

test("Discovers note post type (with name)", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Note title",
    content: "Note title: Note content",
  });

  t.is(result, "note");
});

test("Discovers note post type (with summary)", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Note title",
    summary: "Note summary",
  });

  t.is(result, "note");
});

test("Discovers article post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Article title",
    content: "Article content",
  });

  t.is(result, "article");
});

test("Discovers article post type (with HTML)", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Article title",
    content: {
      html: "<p>Article content in <em>HTML</em> format.</p>",
    },
  });

  t.is(result, "article");
});

test("Discovers article post type (with plaintext)", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Article title",
    content: {
      text: "Content in plaintext format.",
    },
  });

  t.is(result, "article");
});

test("Discovers article post type (with HTML and plaintext)", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Article title",
    content: {
      html: "<p>Article content in <em>HTML</em> format.</p>",
      text: "Article content in plaintext format.",
    },
  });

  t.is(result, "article");
});

test("Discovers article post type (with summary)", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Article title",
    summary: "Article summary",
    content: {
      html: "<p>Article content in <em>HTML</em> format.</p>",
      text: "Article content in plaintext format.",
    },
  });

  t.is(result, "article");
});

test("Discovers photo post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Photo title",
    photo: ["https://website.example/photo.jpg"],
  });

  t.is(result, "photo");
});

test("Discovers video post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Video title",
    video: ["https://website.example/video.mp4"],
  });

  t.is(result, "video");
});

test("Discovers audio post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Audio title",
    audio: ["https://website.example/audio.mp3"],
  });

  t.is(result, "audio");
});

test("Discovers like post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Like title",
    "like-of": "https://website.example",
  });

  t.is(result, "like");
});

test("Discovers repost post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Repost title",
    "repost-of": "https://website.example",
  });

  t.is(result, "repost");
});

test("Discovers bookmark post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Bookmark title",
    "bookmark-of": "https://website.example",
  });

  t.is(result, "bookmark");
});

test("Discovers quotation post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Quotation title",
    "quotation-of": "https://website.example",
    content: "Quotation content",
  });

  t.is(result, "quotation");
});

test("Discovers rsvp post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Event title",
    rsvp: "yes",
    "in-reply-to": "https://website.example",
  });

  t.is(result, "rsvp");
});

test("Discovers reply post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Reply title",
    "in-reply-to": "https://website.example",
    content: "Reply content",
  });

  t.is(result, "reply");
});

test("Discovers watch post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Watch title",
    "watch-of": "https://website.example/video.mp4",
  });

  t.is(result, "watch");
});

test("Discovers listen post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Listen title",
    "listen-of": "https://website.example/audio.mp3",
  });

  t.is(result, "listen");
});

test("Discovers read post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Read title",
    "read-of": "https://website.example/article",
  });

  t.is(result, "read");
});

test("Discovers checkin post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Checkin title",
    checkin: "https://website.example/place",
  });

  t.is(result, "checkin");
});

test("Discovers collection post type", (t) => {
  const result = getPostType({
    type: "entry",
    name: "Collection title",
    children: [
      "https://website.example/child-1",
      "https://website.example/child-2",
    ],
  });

  t.is(result, "collection");
});

test("Discovers event post type", (t) => {
  const result = getPostType({
    type: "event",
    name: "Event title",
  });

  t.is(result, "event");
});
