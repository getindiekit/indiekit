import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl, isSameOrigin } from "@indiekit/util";
import { createRestAPIClient } from "masto";

import { createStatus, getStatusIdFromUrl } from "./utils.js";

export class Mastodon {
  /**
   * @param {object} options - Mastodon options
   * @param {string} options.accessToken - Access token
   * @param {string} options.serverUrl - Server URL
   * @param {number} options.characterLimit - Server character limit
   * @param {boolean} [options.includePermalink] - Include permalink in status
   */
  constructor(options) {
    this.accessToken = options.accessToken;
    this.characterLimit = options.characterLimit;
    this.serverUrl = options.serverUrl;
    this.includePermalink = options.includePermalink || false;
  }

  /**
   * Initialise Mastodon client
   * @access private
   * @returns {object} Mastodon client
   */
  #client() {
    return createRestAPIClient({
      accessToken: this.accessToken,
      url: this.serverUrl,
    });
  }

  /**
   * Post a favourite
   * @param {string} statusUrl - URL of status to favourite
   * @returns {Promise<string>} Mastodon status URL
   */
  async postFavourite(statusUrl) {
    const { v1 } = this.#client();
    const statusId = getStatusIdFromUrl(statusUrl);
    const status = await v1.statuses.$select(statusId).favourite();
    return status.url;
  }

  /**
   * Post a reblog
   * @param {string} statusUrl - URL of status to reblog
   * @returns {Promise<string>} Mastodon status URL
   */
  async postReblog(statusUrl) {
    const { v1 } = this.#client();
    const statusId = getStatusIdFromUrl(statusUrl);
    const status = await v1.statuses.$select(statusId).reblog();
    return status.url;
  }

  /**
   * Post a status
   * @param {object} parameters - Status parameters
   * @returns {Promise<string>} Mastodon status URL
   */
  async postStatus(parameters) {
    const { v1 } = this.#client();
    const status = await v1.statuses.create(parameters);
    return status.url;
  }

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

      const { v2 } = this.#client();
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
  }

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
        isSameOrigin(properties["repost-of"], this.serverUrl) &&
        properties.content
      ) {
        const status = createStatus(properties, {
          characterLimit: this.characterLimit,
          mediaIds,
          serverUrl: this.serverUrl,
        });
        return this.postStatus(status);
      }

      // Syndicate repost of Mastodon URL as a reblog
      if (isSameOrigin(properties["repost-of"], this.serverUrl)) {
        return this.postReblog(properties["repost-of"]);
      }

      // Do not syndicate reposts of other URLs
      return;
    }

    if (properties["like-of"]) {
      // Syndicate like of Mastodon URL as a like
      if (isSameOrigin(properties["like-of"], this.serverUrl)) {
        return this.postFavourite(properties["like-of"]);
      }

      // Do not syndicate likes of other URLs
      return;
    }

    const status = createStatus(properties, {
      characterLimit: this.characterLimit,
      includePermalink: this.includePermalink,
      mediaIds,
      serverUrl: this.serverUrl,
    });

    if (status) {
      return this.postStatus(status);
    }
  }
}
