import { check } from "express-validator";

export const validate = [
  check("content")
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`posts.error.${path}.empty`)),
];
