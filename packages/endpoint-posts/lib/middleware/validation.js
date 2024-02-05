import { check, checkSchema } from "express-validator";

export const validate = {
  async form(request, response, next) {
    const { application } = request.app.locals;
    const validations = [];

    for (const schema of [application.validationSchemas]) {
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
