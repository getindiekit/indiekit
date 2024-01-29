import { check, checkSchema } from "express-validator";

export const validate = {
  async form(request, response, next) {
    const { postTypes } = request.app.locals.publication;
    const validations = [];

    for (const typeConfig of Object.values(postTypes)) {
      if (!typeConfig.validationSchema) {
        continue;
      }

      for (const schema of typeConfig.validationSchema) {
        validations.push(checkSchema(schema));
      }
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
