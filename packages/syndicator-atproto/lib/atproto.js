import { AtpAgent } from "@atproto/api";
import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl, isSameOrigin } from "@indiekit/util";

import {
  createRichText,
  getPostText,
  getPostParts,
  uriToPostUrl,
} from "./utils.js";

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
   * @returns {Promise<string>} AT Protocol post URL
   */
  async postLike(postUrl) {
    const client = await this.client();

    const postParts = getPostParts(postUrl);
    const { uri, cid } = await client.getPost({
      repo: postParts.did,
      rkey: postParts.rkey,
    });

    const like = await client.like(uri, cid);

    return uriToPostUrl(profileUrl, like.uri);
  },

  /**
   * Post a repost
   * @param {string} postUrl - URL of post to repost
   * @returns {Promise<string>} AT Protocol post URL
   */
  async postRepost(postUrl) {
    const client = await this.client();

    const postParts = getPostParts(postUrl);

    const { uri, cid } = await client.getPost({
      repo: postParts.did,
      rkey: postParts.rkey,
    });

    const repost = await client.repost(uri, cid);

    return uriToPostUrl(profileUrl, repost.uri);
  },

  /**
   * Post a repost
   * @param {string} postUrl - URL of post to quote
   * @param {object} richText - Rich text
   * @param {object} [images] - Images
   * @returns {Promise<string>} AT Protocol post URL
   */
  async postQuotePost(postUrl, richText, images) {
    const client = await this.client();

    const postParts = getPostParts(postUrl);
    const { uri, cid } = await client.getPost({
      repo: postParts.did,
      rkey: postParts.rkey,
    });

    const postData = {
      $type: "app.bsky.feed.post",
      text: richText.text,
      facets: richText.facets,
      createdAt: new Date().toISOString(),
    };

    const record = {
      $type: "app.bsky.embed.record",
      record: { uri, cid },
    };

    const media = {
      $type: "app.bsky.embed.images",
      images,
    };

    const recordWithMedia = {
      $type: "app.bsky.embed.recordWithMedia",
      record,
      media,
    };

    postData.embed = images.length > 0 ? recordWithMedia : record;

    const post = await client.post(postData);

    return uriToPostUrl(profileUrl, post.uri);
  },

  /**
   * Post a post
   * @param {object} richText - Rich text
   * @param {object} [images] - Images
   * @returns {Promise<string>} AT Protocol post URL
   */
  async postPost(richText, images) {
    const client = await this.client();

    const postData = {
      $type: "app.bsky.feed.post",
      text: richText.text,
      facets: richText.facets,
      createdAt: new Date().toISOString(),
    };

    const media = {
      $type: "app.bsky.embed.images",
      images,
    };

    postData.embed = images.length > 0 && media;

    const post = await client.post(postData);

    return uriToPostUrl(profileUrl, post.uri);
  },

  /**
   * Upload media to AT Protocol service
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
    try {
      const client = await this.client();

      // Upload photos
      let images = [];
      if (properties.photo) {
        // Trim to 4 photos as AT Protocol (or just Bluesky?) doesn’t support more
        const photos = properties.photo.slice(0, 4);
        const uploads = photos.map(async (photo) => {
          return {
            alt: photo.alt || "",
            image: await this.uploadMedia(photo, me),
          };
        });

        images = await Promise.all(uploads);
      }

      const repostUrl = properties["repost-of"];
      if (repostUrl) {
        // Syndicate repost of AT Protocol URL with content as a quote post
        if (isSameOrigin(repostUrl, profileUrl) && properties.content) {
          const text = getPostText(properties, {
            includePermalink,
            serviceUrl,
          });
          const richText = await createRichText(client, text);

          return this.postQuotePost(repostUrl, richText, images);
        }

        // Syndicate repost of AT Protocol URL as a repost
        if (isSameOrigin(repostUrl, profileUrl)) {
          return this.postRepost(repostUrl);
        }

        // Do not syndicate reposts of other URLs
        return false;
      }

      const likeOfUrl = properties["like-of"];
      if (likeOfUrl) {
        // Syndicate like of AT Protocol URL as a like
        if (isSameOrigin(likeOfUrl, profileUrl)) {
          return this.postLike(likeOfUrl);
        }

        // Do not syndicate likes of other URLs
        return false;
      }

      const text = getPostText(properties, {
        includePermalink,
        serviceUrl,
      });
      const richText = await createRichText(client, text);

      return this.postPost(richText, images);
    } catch (error) {
      const message = error.message;
      throw new Error(message);
    }
  },
});
