import { Buffer } from "node:buffer";
import { getCanonicalUrl, isSameOrigin } from "@indiekit/util";
import Twitter from "twitter-lite";
import { createStatus, getStatusIdFromUrl } from "./utils.js";

export const twitter = (options) => ({
  client: (subdomain = "api") =>
    new Twitter({
      subdomain,
      consumer_key: options.apiKey,
      consumer_secret: options.apiKeySecret,
      access_token_key: options.accessToken,
      access_token_secret: options.accessTokenSecret,
    }),

  /**
   * Post a like
   * @param {string} tweetUrl - URL of tweet to like
   * @returns {Promise<string>} Twitter status URL
   */
  async postLike(tweetUrl) {
    try {
      const statusId = getStatusIdFromUrl(tweetUrl);
      const { user, id_str } = await this.client().post("favorites/create", {
        id: statusId,
      });
      const url = `https://twitter.com/${user.screen_name}/status/${id_str}`;
      return url;
    } catch (error) {
      const errorObject = error.errors ? error.errors[0] : error;
      throw new Error(errorObject.message);
    }
  },

  /**
   * Post a retweet
   * @param {string} tweetUrl - URL of tweet to retweet
   * @returns {Promise<string>} Twitter status URL
   */
  async postRetweet(tweetUrl) {
    try {
      const statusId = getStatusIdFromUrl(tweetUrl);
      const { user, id_str } = await this.client().post(
        `statuses/retweet/${statusId}`
      );
      const url = `https://twitter.com/${user.screen_name}/status/${id_str}`;
      return url;
    } catch (error) {
      const errorObject = error.errors ? error.errors[0] : error;
      throw new Error(errorObject.message);
    }
  },

  /**
   * Post a status
   * @param {object} parameters - Status parameters
   * @returns {Promise<string>} Twitter status URL
   */
  async postStatus(parameters) {
    try {
      const { user, id_str } = await this.client().post(
        "statuses/update",
        parameters
      );
      const url = `https://twitter.com/${user.screen_name}/status/${id_str}`;
      return url;
    } catch (error) {
      const errorObject = error.errors ? error.errors[0] : error;
      throw new Error(errorObject.message);
    }
  },

  /**
   * Upload media and return Twitter media id
   * @param {object} media - JF2 media object
   * @param {string} me - Publication URL
   * @returns {Promise<string>} Twitter media id
   */
  async uploadMedia(media, me) {
    const { alt, url } = media;

    if (typeof url !== "string") {
      return;
    }

    try {
      const mediaUrl = getCanonicalUrl(url, me);
      const response = await fetch(mediaUrl);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const body = await response.arrayBuffer();
      const buffer = Buffer.from(body).toString("base64");
      const { media_id_string } = await this.client("upload").post(
        "media/upload",
        { media_data: buffer }
      );

      if (alt) {
        await this.client("upload").post("media/metadata/create", {
          media_id: media_id_string,
          alt_text: { text: alt },
        });
      }

      return media_id_string;
    } catch (error) {
      const errorObject = error.errors ? error.errors[0] : error;
      throw new Error(errorObject.message);
    }
  },

  /**
   * Post to Twitter
   * @param {object} properties - JF2 properties object
   * @param {string} me - Publication URL
   * @returns {Promise<string|boolean>} URL of syndicated tweet
   */
  async post(properties, me) {
    let mediaIds = [];

    // Upload photos
    if (properties.photo) {
      const uploads = [];

      // Trim to 4 photos as Twitter doesn’t support more
      const photos = properties.photo.slice(0, 4);
      for await (const photo of photos) {
        uploads.push(this.uploadMedia(photo, me));
      }

      mediaIds = await Promise.all(uploads);
    }

    if (properties["repost-of"]) {
      // Syndicate repost of Twitter URL with content as a quote tweet
      if (
        isSameOrigin(properties["repost-of"], "https://twitter.com") &&
        properties.content
      ) {
        const status = createStatus(properties, mediaIds);
        return this.postStatus(status);
      }

      // Syndicate repost of Twitter URL as a retweet
      if (isSameOrigin(properties["repost-of"], "https://twitter.com")) {
        return this.postRetweet(properties["repost-of"]);
      }

      // Do not syndicate reposts of other URLs
      return false;
    }

    if (properties["like-of"]) {
      // Syndicate like of Twitter URL as a like
      if (isSameOrigin(properties["like-of"], "https://twitter.com")) {
        return this.postLike(properties["like-of"]);
      }

      // Do not syndicate likes of other URLs
      return false;
    }

    const status = createStatus(properties, mediaIds);
    if (status) {
      return this.postStatus(status);
    }
  },
});
