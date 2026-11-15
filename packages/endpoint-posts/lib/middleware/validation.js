import { check, checkSchema } from "express-validator";

export const validate = {
  /**
   * Validate form fields using post type validation schemas
   * @param {Request} request - Express request
   * @param {Response} response - Express response
   * @param {NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async form(request, response, next) {
    const { validationSchemas } = request.app.locals;
    const validations = [];

    for (const schema of [Object.fromEntries(validationSchemas)]) {
      validations.push(checkSchema(schema));
    }

    for (let validation of validations) {
      await validation.run(request);
    }

    next();
  },
  new: [
    check("type")
      .exists()
      .withMessage((value, { req }) => req.__("posts.error.type.empty")),
  ],
};

/**
 * @import { NextFunction, Request, Response } from "express"
 */
