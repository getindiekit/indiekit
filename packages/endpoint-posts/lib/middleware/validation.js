import { checkSchema } from "express-validator";

export const validate = () => {
  return async (request, response, next) => {
    const { postTypes } = request.app.locals.publication;
    const validations = [];

    for (const postType of postTypes) {
      if (!postType.validationSchema) {
        continue;
      }

      for (const schema of postType.validationSchema) {
        validations.push(checkSchema(schema));
      }
    }

    for (let validation of validations) {
      await validation.run(request);
    }

    next();
  };
};
