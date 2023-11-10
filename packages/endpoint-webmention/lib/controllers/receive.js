import { IndiekitError } from "@indiekit/error";

/**
 * Receive a webmention
 * @type {import("express").RequestHandler}
 */
export const receiveController = async (request, response) => {
  const { hander } = response.locals;
  const { source, target } = request.body;

  try {
    const mentionResponse = await hander.addPendingMention(source, target);

    response.status(mentionResponse.code).send("Accepted");
  } catch (error) {
    throw IndiekitError.badRequest(error.message);
  }
};
