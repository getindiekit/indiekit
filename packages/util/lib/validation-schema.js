import { ISO_6709_RE } from "./regex.js";

const isRequired = (request, field) => {
  const { postTypes } = request.app.locals.publication;
  const postTypeConfig = postTypes[request.body.postType];

  return postTypeConfig["required-properties"].includes(field);
};

export const validationSchemas = [
  {
    "audio.*": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.media.empty`, "/music/audio.mp3"),
      exists: { if: (value, { req }) => isRequired(req, "audio") },
      isURL: true,
    },
    content: {
      errorMessage: (value, { req }) => req.__("posts.error.content.empty"),
      exists: { if: (value, { req }) => isRequired(req, "content") },
      notEmpty: true,
    },
    "bookmark-of": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.url.empty`, "https://example.org"),
      exists: { if: (value, { req }) => isRequired(req, "bookmark-of") },
      isURL: true,
    },
    geo: {
      errorMessage: (value, { req }) => req.__(`posts.error.geo.invalid`),
      exists: { if: (value, { req }) => req.body?.geo },
      custom: {
        options: (value) => value.match(ISO_6709_RE),
      },
    },
    "like-of": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.url.empty`, "https://example.org"),
      exists: { if: (value, { req }) => isRequired(req, "like-of") },
      isURL: true,
    },
    "in-reply-to": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.url.empty`, "https://example.org"),
      exists: { if: (value, { req }) => isRequired(req, "in-reply-to") },
      isURL: true,
    },
    name: {
      errorMessage: (value, { req }) => req.__("posts.error.name.empty"),
      exists: { if: (value, { req }) => isRequired(req, "name") },
      notEmpty: true,
    },
    "photo.*.url": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.media.empty`, "/photos/image.jpg"),
      exists: { if: (value, { req }) => isRequired(req, "photo") },
      isURL: true,
    },
    "photo.*.alt": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.mp-photo-alt.empty`),
      exists: { if: (value, { req }) => isRequired(req, "mp-photo-alt") },
      notEmpty: true,
    },
    "repost-of": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.url.empty`, "https://example.org"),
      exists: { if: (value, { req }) => isRequired(req, "repost-of") },
      isURL: true,
    },
    rsvp: {
      errorMessage: (value, { req }) => req.__("posts.error.rsvp.empty"),
      exists: { if: (value, { req }) => isRequired(req, "rsvp") },
      notEmpty: true,
    },
    start: {
      errorMessage: (value, { req }) => req.__("posts.error.start.empty"),
      exists: { if: (value, { req }) => isRequired(req, "start") },
      notEmpty: true,
    },
    "video.*": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.media.empty`, "/movies/video.mp4"),
      exists: { if: (value, { req }) => isRequired(req, "video") },
      isURL: true,
    },
  },
];
