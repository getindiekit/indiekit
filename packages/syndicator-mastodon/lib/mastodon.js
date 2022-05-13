/* eslint-disable camelcase */
import axios from "axios";
import HttpError from "http-errors";
import megalodon from "megalodon";
import {
  createStatus,
  getAbsoluteUrl,
  getStatusIdFromUrl,
  isTootUrl,
} from "./utils.js";

export const mastodon = (options) => ({
  client() {
    const generator = megalodon.default;
    return generator("mastodon", options.url, options.accessToken);
  },

  /**
   * Post a favourite
   *
   * @param {string} tootUrl URL of toot to favourite
   * @returns {string} Mastodon status URL
   */
  async postFavourite(tootUrl) {
    const statusId = getStatusIdFromUrl(tootUrl);
    const { data } = await this.client().favouriteStatus(statusId);
    return data.url;
  },

  /**
   * Post a reblog
   *
   * @param {string} tootUrl URL of toot to reblog
   * @returns {string} Mastodon status URL
   */
  async postReblog(tootUrl) {
    const statusId = getStatusIdFromUrl(tootUrl);
    const { data } = await this.client().reblogStatus(statusId);
    return data.url;
  },

  /**
   * Post a status
   *
   * @param {object} parameters Status parameters
   * @returns {string} Mastodon status URL
   */
  async postStatus(parameters) {
    const { data } = await this.client().postStatus(parameters.status, {
      in_reply_to_id: parameters.in_reply_to_status_id,
      media_ids: parameters.media_ids,
    });
    return data.url;
  },

  /**
   * Upload media and return Mastodon media id
   *
   * @param {string} media JF2 media object
   * @param {string} me Publication URL
   * @returns {string} Mastodon media id
   */
  async uploadMedia(media, me) {
    const { alt, url } = media;

    if (typeof url !== "string") {
      return;
    }

    try {
      const mediaUrl = getAbsoluteUrl(url, me);
      const response = await axios(mediaUrl, {
        responseType: "stream",
      });
      const { data } = await this.client().uploadMedia(response.data, {
        description: alt,
      });
      return data.id;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data?.error || error.message;
      throw new HttpError(statusCode, message);
    }
  },

  /**
   * Post to Mastodon
   *
   * @param {object} properties JF2 properties object
   * @param {object} publication Publication configuration
   * @returns {string} URL of syndicated toot
   */
  async post(properties, publication) {
    let mediaIds = [];

    // Upload photos
    if (properties.photo) {
      const uploads = [];

      // Trim to 4 photos as Mastodon doesn’t support more
      const photos = properties.photo.slice(0, 4);
      for await (const photo of photos) {
        uploads.push(this.uploadMedia(photo, publication.me));
      }

      mediaIds = await Promise.all(uploads);
    }

    if (properties["repost-of"]) {
      // Syndicate repost of Mastodon URL with content as a reblog
      if (
        isTootUrl(properties["repost-of"], options.url) &&
        properties.content
      ) {
        const status = createStatus(properties, mediaIds);
        return this.postStatus(status);
      }

      // Syndicate repost of Mastodon URL as a reblog
      if (isTootUrl(properties["repost-of"], options.url)) {
        return this.postReblog(properties["repost-of"]);
      }

      // Do not syndicate reposts of other URLs
      return false;
    }

    if (properties["like-of"]) {
      // Syndicate like of Mastodon URL as a like
      if (isTootUrl(properties["like-of"], options.url)) {
        return this.postFavourite(properties["like-of"]);
      }

      // Do not syndicate likes of other URLs
      return false;
    }

    const status = createStatus(properties, options.url, mediaIds);
    if (status) {
      return this.postStatus(status);
    }
  },
});
