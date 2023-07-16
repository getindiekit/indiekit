import { endpoint } from "../endpoint.js";

export const deleteController = {
  /**
   * Confirm file to delete
   * @type {import("express").RequestHandler}
   */
  async get(request, response) {
    const { fileName, filesPath, scope } = response.locals;

    if (scope.includes("delete")) {
      return response.render("file-delete", {
        title: response.locals.__("files.delete.title"),
        filesPath,
        parent: { text: fileName },
      });
    }

    response.redirect(filesPath);
  },

  /**
   * Post delete action to media endpoint
   * @type {import("express").RequestHandler}
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
        title: response.locals.__("files.delete.title"),
        parent: { text: fileName },
        error,
      });
    }
  },
};
