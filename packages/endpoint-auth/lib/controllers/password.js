import { validationResult } from "express-validator";

import { createPasswordHash } from "../password.js";

export const passwordController = {
  /**
   * New password request
   * @type {import("express").RequestHandler}
   */
  get(request, response) {
    const { name } = request.app.locals.application;

    response.render("new-password", {
      title: response.locals.__("auth.newPassword.title"),
      notice: request.query.setup
        ? response.locals.__("auth.newPassword.setup.text", { app: name })
        : false,
    });
  },

  /**
   * New password response
   * @type {import("express").RequestHandler}
   */
  async post(request, response) {
    const data = request.body;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("new-password", {
        title: response.locals.__("auth.newPassword.title"),
        errors: errors.mapped(),
      });
    }

    if (data.password) {
      const secret = await createPasswordHash(data.password);

      response.render("new-password", {
        title: response.locals.__("auth.newPassword.title"),
        data,
        secret,
      });
    }
  },
};
