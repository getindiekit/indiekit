import got from "got";
import parser from "microformats-parser";

/**
 * Return mf2 of a given URL
 *
 * @param {string} url URL path to post
 * @returns {Promise|object} mf2 object
 */
export const url2Mf2 = async (url) => {
  const { body } = await got(url);
  const mf2 = parser.mf2(body, {
    baseUrl: url,
  });

  return mf2;
};
