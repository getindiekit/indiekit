import { check } from "express-validator";

export const validate = [
  check("bookmark-of")
    .if((value, { req }) => req.body?.["post-type"] === "bookmark")
    .exists()
    .isURL()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("in-reply-to")
    .if((value, { req }) => req.body?.["post-type"] === "reply")
    .exists()
    .isURL()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("like-of")
    .if((value, { req }) => req.body?.["post-type"] === "like")
    .exists()
    .isURL()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("repost-of")
    .if((value, { req }) => req.body?.["post-type"] === "repost")
    .exists()
    .isURL()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("name")
    .if(
      (value, { req }) =>
        req.body?.["post-type"] === "article" ||
        req.body?.["post-type"] === "bookmark"
    )
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
  check("content")
    .if(
      (value, { req }) =>
        req.body?.["post-type"] === "article" ||
        req.body?.["post-type"] === "note" ||
        req.body?.["post-type"] === "reply"
    )
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
];
