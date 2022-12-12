import { IndiekitError } from "@indiekit/error";
import { formEncodedToJf2, mf2ToJf2 } from "../jf2.js";
import { post } from "../post.js";
import { postData } from "../post-data.js";
import { checkScope } from "../scope.js";
import { uploadMedia } from "../media.js";

/**
 * Perform requested post action
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const actionController = async (request, response, next) => {
  const { body, files, query } = request;
  const action = query.action || body.action || "create";
  const url = query.url || body.url;
  const { application, publication } = request.app.locals;

  try {
    // Check provided scope
    const { scope, token } = request.session;
    const hasScope = checkScope(scope, action);
    if (!hasScope) {
      throw IndiekitError.insufficientScope(
        response.__("ForbiddenError.insufficientScope"),
        { scope: action }
      );
    }

    // Toggle draft mode if `draft` scope
    const draftMode = hasScope === "draft";

    // Check for URL if not creating a new post
    if (action !== "create" && !url) {
      throw IndiekitError.badRequest(
        response.__("BadRequestError.missingParameter", "url")
      );
    }

    let data;
    let jf2;
    let published;
    switch (action) {
      case "create": {
        // Create and normalise JF2 data
        jf2 = request.is("json")
          ? await mf2ToJf2(body, publication.enrichPostData)
          : formEncodedToJf2(body);

        // Attach files
        jf2 = files
          ? await uploadMedia(application.mediaEndpoint, token, jf2, files)
          : jf2;

        data = await postData.create(publication, jf2, draftMode);
        published = await post.create(publication, data);
        break;
      }

      case "update": {
        // Check for update operations
        if (!(body.replace || body.add || body.remove)) {
          throw IndiekitError.badRequest(
            response.__(
              "BadRequestError.missingProperty",
              "replace, add or remove operations"
            )
          );
        }

        data = await postData.update(publication, url, body);

        // Draft mode: Only update posts that have `draft` post status
        if (draftMode && data.properties["post-status"] !== "draft") {
          throw IndiekitError.insufficientScope(
            response.__("ForbiddenError.insufficientScope"),
            { scope: action }
          );
        }

        published = await post.update(publication, data, url);
        break;
      }

      case "delete": {
        data = await postData.delete(publication, url);
        published = await post.delete(publication, data);
        break;
      }

      case "undelete": {
        data = await postData.undelete(publication, url, draftMode);
        published = await post.undelete(publication, data);
        break;
      }

      default:
    }

    return response
      .status(published.status)
      .location(published.location)
      .json(published.json);
  } catch (error) {
    let nextError = error;

    // Hoist not found error to controller to localise response
    if (error.name === "NotFoundError") {
      nextError = IndiekitError.notFound(
        response.__("NotFoundError.record", error.message)
      );
    }

    // Hoist unsupported post type error to controller to localise response
    if (error.name === "NotImplementedError") {
      nextError = IndiekitError.notImplemented(
        response.__("NotImplementedError.postType", error.message),
        { uri: "https://getindiekit.com/configuration/post-types" }
      );
    }

    return next(nextError);
  }
};
