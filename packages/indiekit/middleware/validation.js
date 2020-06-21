import validator from 'express-validator';

const {check} = validator;

export const me = [
  check('me')
    .not()
    .isEmpty()
    .withMessage('Enter your web address'),
  check('me')
    .exists()
    .isURL({force_protocol: false}) // eslint-disable-line camelcase
    .withMessage('Enter a web address like https://example.org')
];
