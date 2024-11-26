import { check } from "express-validator";

import { verifyPassword } from "../password.js";

export const consentValidator = [
  check("password")
    .notEmpty()
    .withMessage((value, { req, path }) => req.__(`auth.error.${path}.missing`))
    .custom(async (value) => {
      const validPassword = await verifyPassword(value);
      if (!validPassword) {
        throw new Error("Invalid password");
      }
    })
    .withMessage((value, { req, path }) =>
      req.__(`auth.error.${path}.invalid`),
    ),
];

export const passwordValidator = [
  check("password")
    .notEmpty()
    .withMessage((value, { req, path }) =>
      req.__(`auth.error.${path}.missing`),
    ),
];
