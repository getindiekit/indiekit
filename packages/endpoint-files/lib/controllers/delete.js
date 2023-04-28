import { endpoint } from "../endpoint.js";

export const deleteController = {
  /**
   * Confirm file to delete
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async get(request, response) {
    const { back, fileName, scope } = response.locals;

    if (scope.includes("delete")) {
      return response.render("file-delete", {
        title: response.__("files.delete.title"),
        back,
        parent: { text: fileName },
      });
    }

    response.redirect(back);
  },

  /**
   * Post delete action to media endpoint
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async post(request, response) {
    const { mediaEndpoint } = request.app.locals.application;
    const { accessToken, file, fileName } = response.locals;

    const mediaUrl = new URL(mediaEndpoint);
    mediaUrl.searchParams.append("action", "delete");
    mediaUrl.searchParams.append("url", file.url);

    try {
      const mediaResponse = await endpoint.post(mediaUrl.href, accessToken);
      const message = encodeURIComponent(mediaResponse.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("file-delete", {
        title: response.__("files.delete.title"),
        parent: { text: fileName },
        error: error.message,
      });
    }
  },
};
