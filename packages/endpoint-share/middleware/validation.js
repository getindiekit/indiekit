import validator from 'express-validator';

const {check} = validator;

export const validate = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Enter a title'),
  check('bookmark-of')
    .exists()
    .isURL()
    .withMessage('Enter a web address like https://example.org')
];
