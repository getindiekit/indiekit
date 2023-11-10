import { getCursor } from "@indiekit/util";

/**
 * Query published posts
 * @type {import("express").RequestHandler}
 */
export const queryController = async (request, response, next) => {
  const { application } = request.app.locals;
  const { hander } = response.locals;

  try {
    const limit = Number(request.query.limit) || 0;
    let { after, before, type, target } = request.query;

    if (target) {
      const children = await hander.getMentionsForPage(target, type);
      response.type("application/jf2feed+json").json({
        type: "feed",
        children,
      });
    } else {
      const cursor = await getCursor(
        application.mentions,
        after,
        before,
        limit,
      );

      response.json({
        children: cursor.items,
        paging: {
          ...(cursor.hasNext && { after: cursor.lastItem }),
          ...(cursor.hasPrev && { before: cursor.firstItem }),
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
