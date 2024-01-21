import { ISO_6709_RE } from "./regex.js";

export const validationSchemas = {
  "audio.*": {
    errorMessage: (value, { req }) =>
      req.__(`posts.error.media.empty`, "/music/audio.mp3"),
    exists: {
      if: (value, { req }) => req.body?.postType === "audio",
    },
    notEmpty: true,
  },
  content: {
    errorMessage: (value, { req }) => req.__("posts.error.content.empty"),
    exists: {
      if: (value, { req }) =>
        ["article", "note", "reply"].includes(req.body?.postType),
    },
    notEmpty: true,
  },
  "bookmark-of": {
    errorMessage: (value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org"),
    exists: {
      if: (value, { req }) => req.body?.postType === "bookmark",
    },
    isURL: true,
  },
  geo: {
    errorMessage: (value, { req }) => req.__(`posts.error.geo.invalid`),
    exists: {
      if: (value, { req }) => req.body?.geo,
    },
    custom: {
      options: (value) => value.match(ISO_6709_RE),
    },
  },
  "like-of": {
    errorMessage: (value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org"),
    exists: {
      if: (value, { req }) => req.body?.postType === "like",
    },
    isURL: true,
  },
  "in-reply-to": {
    errorMessage: (value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org"),
    exists: {
      if: (value, { req }) => ["reply", "rsvp"].includes(req.body?.postType),
    },
    isURL: true,
  },
  name: {
    errorMessage: (value, { req }) => req.__("posts.error.name.empty"),
    exists: {
      if: (value, { req }) =>
        ["article", "bookmark", "event"].includes(req.body?.postType),
    },
    notEmpty: true,
  },
  "photo.*.url": {
    errorMessage: (value, { req }) =>
      req.__(`posts.error.media.empty`, "/photos/image.jpg"),
    exists: {
      if: (value, { req }) => req.body?.postType === "photo",
    },
    notEmpty: true,
  },
  "photo.*.alt": {
    errorMessage: (value, { req }) => req.__(`posts.error.mp-photo-alt.empty`),
    exists: {
      if: (value, { req }) => req.body?.postType === "photo",
    },
    notEmpty: true,
  },
  "repost-of": {
    errorMessage: (value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org"),
    exists: {
      if: (value, { req }) => ["repost"].includes(req.body?.postType),
    },
    isURL: true,
  },
  rsvp: {
    errorMessage: (value, { req }) => req.__("posts.error.rsvp.empty"),
    exists: {
      if: (value, { req }) => req.body?.postType === "rsvp",
    },
    notEmpty: true,
  },
  start: {
    errorMessage: (value, { req }) => req.__("posts.error.start.empty"),
    exists: {
      if: (value, { req }) => req.body?.postType === "event",
    },
    notEmpty: true,
  },
  "video.*": {
    errorMessage: (value, { req }) =>
      req.__(`posts.error.media.empty`, "/movies/video.mp4"),
    exists: {
      if: (value, { req }) => req.body?.postType === "video",
    },
    notEmpty: true,
  },
};
