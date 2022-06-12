import validator from "express-validator";

const { check } = validator;

export const validate = [
  check("file").custom((value, { req, path }) => {
    if (!req.file) throw new Error(req.__(`files.error.${path}`));
    return true;
  }),
];
