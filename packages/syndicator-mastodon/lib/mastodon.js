import { getCanonicalUrl, isSameOrigin } from "@indiekit/util";
import axios from "axios";
import megalodon from "megalodon";
import { createStatus, getStatusIdFromUrl } from "./utils.js";

export const mastodon = ({ accessToken, characterLimit, serverUrl }) => ({
  client() {
    const generator = megalodon.default;
    return generator("mastodon", serverUrl, accessToken);
  },

  /**
   * Post a favourite
   * @param {string} tootUrl - URL of toot to favourite
   * @returns {Promise<string>} Mastodon status URL
   */
  async postFavourite(tootUrl) {
    const statusId = getStatusIdFromUrl(tootUrl);
    const { data } = await this.client().favouriteStatus(statusId);
    return data.url;
  },

  /**
   * Post a reblog
   * @param {string} tootUrl - URL of toot to reblog
   * @returns {Promise<string>} Mastodon status URL
   */
  async postReblog(tootUrl) {
    const statusId = getStatusIdFromUrl(tootUrl);
    const { data } = await this.client().reblogStatus(statusId);
    return data.url;
  },

  /**
   * Post a status
   * @param {object} parameters - Status parameters
   * @returns {Promise<string>} Mastodon status URL
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
   * @param {object} media - JF2 media object
   * @param {string} me - Publication URL
   * @returns {Promise<string>} Mastodon media id
   */
  async uploadMedia(media, me) {
    const { alt, url } = media;

    if (typeof url !== "string") {
      return;
    }

    try {
      const mediaUrl = getCanonicalUrl(url, me);
      const response = await axios(mediaUrl, {
        responseType: "stream",
      });
      const { data } = await this.client().uploadMedia(response.data, {
        description: alt,
      });
      return data.id;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      throw new Error(message);
    }
  },

  /**
   * Post to Mastodon
   * @param {object} properties - JF2 properties object
   * @param {object} publication - Publication configuration
   * @returns {Promise<string|boolean>} URL of syndicated toot
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
        isSameOrigin(properties["repost-of"], serverUrl) &&
        properties.content
      ) {
        const status = createStatus(properties, {
          characterLimit,
          mediaIds,
          serverUrl,
        });
        return this.postStatus(status);
      }

      // Syndicate repost of Mastodon URL as a reblog
      if (isSameOrigin(properties["repost-of"], serverUrl)) {
        return this.postReblog(properties["repost-of"]);
      }

      // Do not syndicate reposts of other URLs
      return false;
    }

    if (properties["like-of"]) {
      // Syndicate like of Mastodon URL as a like
      if (isSameOrigin(properties["like-of"], serverUrl)) {
        return this.postFavourite(properties["like-of"]);
      }

      // Do not syndicate likes of other URLs
      return false;
    }

    const status = createStatus(properties, {
      characterLimit,
      mediaIds,
      serverUrl,
    });
    if (status) {
      return this.postStatus(status);
    }
  },
});
