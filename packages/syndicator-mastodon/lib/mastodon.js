import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl, isSameOrigin } from "@indiekit/util";
import { createRestAPIClient } from "masto";

import { createStatus, getStatusIdFromUrl } from "./utils.js";

/**
 * Syndicate post to Mastodon
 * @param {object} options - Syndicator options
 * @param {string} options.accessToken - Access token
 * @param {number} options.characterLimit - Server character limit
 * @param {boolean} options.includePermalink - Include permalink in status
 * @param {string} options.serverUrl - Server URL
 * @returns {object} Post functions
 */
export const mastodon = ({
  accessToken,
  characterLimit,
  includePermalink,
  serverUrl,
}) => ({
  client() {
    return createRestAPIClient({
      accessToken,
      url: serverUrl,
    });
  },

  /**
   * Post a favourite
   * @param {string} statusUrl - URL of status to favourite
   * @returns {Promise<string>} Mastodon status URL
   */
  async postFavourite(statusUrl) {
    const { v1 } = this.client();
    const statusId = getStatusIdFromUrl(statusUrl);
    const status = await v1.statuses.$select(statusId).favourite();
    return status.url;
  },

  /**
   * Post a reblog
   * @param {string} statusUrl - URL of status to reblog
   * @returns {Promise<string>} Mastodon status URL
   */
  async postReblog(statusUrl) {
    const { v1 } = this.client();
    const statusId = getStatusIdFromUrl(statusUrl);
    const status = await v1.statuses.$select(statusId).reblog();
    return status.url;
  },

  /**
   * Post a status
   * @param {object} parameters - Status parameters
   * @returns {Promise<string>} Mastodon status URL
   */
  async postStatus(parameters) {
    const { v1 } = this.client();
    const status = await v1.statuses.create(parameters);
    return status.url;
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
      const mediaResponse = await fetch(mediaUrl);

      if (!mediaResponse.ok) {
        throw await IndiekitError.fromFetch(mediaResponse);
      }

      const { v2 } = this.client();
      const blob = await mediaResponse.blob();
      const attachment = await v2.media.create({
        file: new Blob([blob]),
        description: alt,
      });

      return attachment.id;
    } catch (error) {
      const message = error.message;
      throw new Error(message);
    }
  },

  /**
   * Post to Mastodon
   * @param {object} properties - JF2 properties
   * @param {string} me - Publication URL
   * @returns {Promise<string|boolean>} URL of syndicated status
   */
  async post(properties, me) {
    let mediaIds = [];

    // Upload photos
    if (properties.photo) {
      const uploads = [];

      // Trim to 4 photos as Mastodon doesn’t support more
      const photos = properties.photo.slice(0, 4);
      for await (const photo of photos) {
        uploads.push(this.uploadMedia(photo, me));
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
      includePermalink,
      mediaIds,
      serverUrl,
    });
    if (status) {
      return this.postStatus(status);
    }
  },
});
