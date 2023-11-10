import { IndiekitError } from "@indiekit/error";

/**
 * Process pending webmentions
 * @type {import("express").RequestHandler}
 */
export const updateController = async (request, response) => {
  const { hander } = response.locals;

  try {
    await hander.processPendingMentions();

    response.sendStatus(200);
  } catch (error) {
    throw new IndiekitError(error.message);
  }
};
