import { check } from "express-validator";

export const validate = [
  check("file").custom((value, { req, path }) => {
    if (!req.files) throw new Error(req.__(`files.error.${path}`));
    return true;
  }),
];
