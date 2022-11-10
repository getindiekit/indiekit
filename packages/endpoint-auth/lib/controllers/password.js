import { validationResult } from "express-validator";
import { createPasswordHash } from "../password.js";

export const passwordController = {
  /**
   * New password request
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  get(request, response) {
    response.render("new-password", {
      title: response.__("auth.newPassword.title"),
      setup: request.query.setup,
    });
  },

  /**
   * New password response
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  post(request, response) {
    const { password } = request.body;
    const { setup } = request.query;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("new-password", {
        title: response.__("auth.newPassword.title"),
        errors: errors.mapped(),
        setup,
      });
    }

    if (password) {
      const secret = createPasswordHash(password);

      response.render("new-password", {
        title: response.__("auth.newPassword.title"),
        password,
        secret,
        setup,
      });
    }
  },
};
