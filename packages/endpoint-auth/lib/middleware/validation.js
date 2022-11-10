import { check } from "express-validator";
import { verifyPassword } from "../password.js";

export const consentValidator = [
  check("password")
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`auth.error.${path}.missing`))
    .custom((value) => verifyPassword(value))
    .withMessage((value, { req, path }) =>
      req.__(`auth.error.${path}.invalid`)
    ),
];

export const passwordValidator = [
  check("password")
    .notEmpty()
    .withMessage((value, { req, path }) =>
      req.__(`auth.error.${path}.missing`)
    ),
];
