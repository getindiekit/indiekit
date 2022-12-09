import { check } from "express-validator";

export const validate = [
  check("bookmark-of")
    .if((value, { req }) => req.body?.["post-type"] === "bookmark")
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
        req.body?.["post-type"] === "note"
    )
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
];
