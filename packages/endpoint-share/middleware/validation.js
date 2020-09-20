import validator from 'express-validator';

const {check} = validator;

export const validate = [
  check('name')
    .not()
    .isEmpty()
    .withMessage((value, {req, path}) => {
      return req.__(`share.error.${path}`);
    }),
  check('bookmark-of')
    .exists()
    .isURL()
    .withMessage((value, {req, path}) => {
      return req.__(`share.error.${path}`);
    })
];
