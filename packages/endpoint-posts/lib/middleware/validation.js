import { check } from "express-validator";
import { ISO_6709_RE } from "@indiekit/util";

export const validate = [
  check("audio.*")
    .if((value, { req }) => req.body?.["post-type"] === "audio")
    .notEmpty()
    .withMessage((value, { req }) =>
      req.__(`posts.error.media.empty`, "/music/audio.mp3"),
    ),
  check("bookmark-of")
    .if((value, { req }) => req.body?.["post-type"] === "bookmark")
    .exists()
    .isURL()
    .withMessage((value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org"),
    ),
  check("in-reply-to")
    .if(
      (value, { req }) =>
        req.body?.["post-type"] === "reply" ||
        req.body?.["post-type"] === "rsvp",
    )
    .exists()
    .isURL()
    .withMessage((value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org"),
    ),
  check("like-of")
    .if((value, { req }) => req.body?.["post-type"] === "like")
    .exists()
    .isURL()
    .withMessage((value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org"),
    ),
  check("repost-of")
    .if((value, { req }) => req.body?.["post-type"] === "repost")
    .exists()
    .isURL()
    .withMessage((value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org"),
    ),
  check("name")
    .if(
      (value, { req }) =>
        req.body?.["post-type"] === "article" ||
        req.body?.["post-type"] === "bookmark" ||
        req.body?.["post-type"] === "event",
    )
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("start")
    .if((value, { req }) => req.body?.["post-type"] === "event")
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("content")
    .if(
      (value, { req }) =>
        req.body?.["post-type"] === "article" ||
        req.body?.["post-type"] === "note" ||
        req.body?.["post-type"] === "reply",
    )
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("photo.*.url")
    .if((value, { req }) => req.body?.["post-type"] === "photo")
    .notEmpty()
    .withMessage((value, { req }) =>
      req.__(`posts.error.media.empty`, "/photos/image.jpg"),
    ),
  check("photo.*.alt")
    .if((value, { req }) => req.body?.["post-type"] === "photo")
    .notEmpty()
    .withMessage((value, { req }) => req.__(`posts.error.mp-photo-alt.empty`)),
  check("geo")
    .if((value, { req }) => req.body?.geo)
    .custom((value) => value.match(ISO_6709_RE))
    .withMessage((value, { req, path }) =>
      req.__(`posts.error.${path}.invalid`),
    ),
  check("video.*")
    .if((value, { req }) => req.body?.["post-type"] === "video")
    .notEmpty()
    .withMessage((value, { req }) =>
      req.__(`posts.error.media.empty`, "/movies/video.mp4"),
    ),
];
