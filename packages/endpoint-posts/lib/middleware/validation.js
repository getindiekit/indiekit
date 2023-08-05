import { check } from "express-validator";
import { LAT_LONG_RE } from "../utils.js";

export const validate = [
  check("audio")
    .if((value, { req }) => req.body?.["post-type"] === "audio")
    .exists()
    .isURL()
    .withMessage((value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org/audio.mp3"),
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
        req.body?.["post-type"] === "bookmark",
    )
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
  check("photo")
    .if((value, { req }) => req.body?.["post-type"] === "photo")
    .exists()
    .isURL()
    .withMessage((value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org/photo.jpg"),
    ),
  check("mp-photo-alt")
    .if((value, { req }) => req.body?.["post-type"] === "photo")
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("geo")
    .if((value, { req }) => req.body?.geo)
    .custom((value) => value.match(LAT_LONG_RE))
    .withMessage((value, { req, path }) =>
      req.__(`posts.error.${path}.invalid`),
    ),
  check("video")
    .if((value, { req }) => req.body?.["post-type"] === "video")
    .exists()
    .isURL()
    .withMessage((value, { req }) =>
      req.__(`posts.error.url.empty`, "https://example.org/video.mp4"),
    ),
];
