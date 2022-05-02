import httpError from "http-errors";
import { formEncodedToJf2, mf2ToJf2 } from "../jf2.js";
import { post } from "../post.js";
import { postData } from "../post-data.js";
import { checkScope } from "../scope.js";
import { uploadMedia } from "../media.js";

/**
 * Perform requested post action
 *
 * @param {object} request HTTP request
 * @param {object} response HTTP response
 * @param {Function} next Next middleware callback
 * @returns {object} HTTP response
 */
export const actionController = async (request, response, next) => {
  const { body, files, query } = request;
  const action = query.action || body.action || "create";
  const url = query.url || body.url;
  const { publication } = request.app.locals;
  const { scope, token } = request.session;

  try {
    checkScope(scope, action);

    let data;
    let jf2;
    let published;
    switch (action) {
      case "create":
        // Create and normalise JF2 data
        // TODO: Attached photos don’t appear with correct alt text
        jf2 = request.is("json") ? mf2ToJf2(body) : formEncodedToJf2(body);
        jf2 = files ? await uploadMedia(token, publication, jf2, files) : jf2;

        data = await postData.create(publication, jf2);
        published = await post.create(publication, data);
        break;
      case "update":
        data = await postData.update(publication, url, body);
        published = await post.update(publication, data, url);
        break;
      case "delete":
        data = await postData.read(publication, url);
        published = await post.delete(publication, data);
        break;
      case "undelete":
        data = await postData.read(publication, url);
        published = await post.undelete(publication, data);
        break;
      default:
    }

    return response
      .status(published.status)
      .location(published.location)
      .json(published.json);
  } catch (error) {
    next(httpError(error));
  }
};
