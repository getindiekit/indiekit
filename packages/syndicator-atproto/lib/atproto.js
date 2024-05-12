import { AtpAgent, RichText } from "@atproto/api";
import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl, isSameOrigin } from "@indiekit/util";

import { getStatusText, getPostParts, uriToPostUrl } from "./utils.js";

/**
 * Syndicate post to an AT Protocol service
 * @param {object} options - Syndicator options
 * @param {string} [options.profileUrl] - Profile URL
 * @param {string} [options.serviceUrl] - Service URL
 * @param {string} options.identifier - User identifier
 * @param {string} options.password - Password
 * @param {boolean} options.includePermalink - Include permalink in status
 * @returns {object} Post functions
 */
export const atproto = ({
  profileUrl,
  serviceUrl,
  identifier,
  password,
  includePermalink,
}) => ({
  async client() {
    const agent = new AtpAgent({ service: serviceUrl });

    await agent.login({ identifier, password });

    return agent;
  },

  /**
   * Post a like
   * @param {string} postUrl - URL of post to like
   * @returns {Promise<string>} Mastodon status URL
   */
  async postLike(postUrl) {
    const client = await this.client();

    const post = getPostParts(postUrl);
    const { uri, cid } = await client.getPost({
      repo: post.did,
      rkey: post.rkey,
    });

    const like = await client.like(uri, cid);

    return uriToPostUrl(profileUrl, like.uri);
  },

  /**
   * Upload media to ATProto service
   * @param {object} media - JF2 media object
   * @param {string} me - Publication URL
   * @returns {Promise<Blob>} Blob reference for the uploaded media
   */
  async uploadMedia(media, me) {
    const client = await this.client();
    const { url } = media;

    if (typeof url !== "string") {
      return;
    }

    try {
      const mediaUrl = getCanonicalUrl(url, me);
      const mediaResponse = await fetch(mediaUrl);

      if (!mediaResponse.ok) {
        throw await IndiekitError.fromFetch(mediaResponse);
      }

      const blob = await mediaResponse.blob();
      const response = await client.api.com.atproto.repo.uploadBlob(blob, {
        encoding: mediaResponse.headers.get("Content-Type"),
      });

      return response.data.blob;
    } catch (error) {
      const message = error.message;
      throw new Error(message);
    }
  },

  /**
   * Post to AT Protocol
   * @param {object} properties - JF2 properties
   * @param {string} me - Publication URL
   * @returns {Promise<string|boolean>} URL of syndicated status
   */
  async post(properties, me) {
    const client = await this.client();
    let mediaItems = [];

    // Upload photos
    if (properties.photo) {
      // Trim to 4 photos as ATProto (or just Bluesky?) doesn’t support more
      const photos = properties.photo.slice(0, 4);
      const uploads = photos.map(async (photo) => {
        const image = await this.uploadMedia(photo, me);
        return {
          alt: photo.alt || "",
          image: image,
        };
      });

      mediaItems = await Promise.all(uploads);
    }

    if (properties["like-of"]) {
      // Syndicate like of AT Proto URL as a like
      if (isSameOrigin(properties["like-of"], profileUrl)) {
        return this.postLike(properties["like-of"]);
      }

      // Do not syndicate likes of other URLs
      return false;
    }

    const text = getStatusText(properties, {
      includePermalink,
      serviceUrl,
    });

    const rt = new RichText({ text });
    await rt.detectFacets(client);

    try {
      const postData = {
        $type: "app.bsky.feed.post",
        text: rt.text,
        facets: rt.facets,
        createdAt: new Date().toISOString(),
      };

      if (mediaItems.length > 0) {
        postData.embed = {
          $type: "app.bsky.embed.images",
          images: mediaItems,
        };
      }

      const post = await client.post(postData);

      return uriToPostUrl(profileUrl, post.uri);
    } catch (error) {
      const message = error.message;
      throw new Error(message);
    }
  },
});
