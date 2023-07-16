import path from "node:path";

/**
 * View uploaded file
 * @type {import("express").RequestHandler}
 */
export const fileController = async (request, response, next) => {
  try {
    const { file, fileName, filesPath, scope } = response.locals;

    response.render("file", {
      title: fileName,
      file,
      parent: {
        href: filesPath,
        text: response.locals.__("files.files.title"),
      },
      actions: [
        scope.includes("delete")
          ? {
              classes: "actions__link--warning",
              href: path.join(request.baseUrl + request.path, "/delete"),
              icon: "delete",
              text: response.locals.__("files.delete.action"),
            }
          : {},
      ],
    });
  } catch (error) {
    next(error);
  }
};
