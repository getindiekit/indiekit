import path from "node:path";

/**
 * View previously uploaded file
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const fileController = async (request, response, next) => {
  try {
    const { back, file, fileName, scope } = response.locals;

    response.render("file", {
      title: fileName,
      file,
      parent: {
        href: back,
        text: response.__("files.files.title"),
      },
      actions: [
        scope.includes("delete")
          ? {
              classes: "actions__link--warning",
              href: path.join(request.baseUrl + request.path, "/delete"),
              icon: "delete",
              text: response.__("files.delete.action"),
            }
          : {},
      ],
    });
  } catch (error) {
    next(error);
  }
};
