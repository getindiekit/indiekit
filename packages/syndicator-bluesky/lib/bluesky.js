import { AtpAgent } from "@atproto/api";
import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl, isSameOrigin } from "@indiekit/util";

import {
  createRichText,
  getPostImage,
  getPostText,
  getPostParts,
  uriToPostUrl,
} from "./utils.js";

export class Bluesky {
  /**
   * @param {object} options - Syndicator options
   * @param {string} options.identifier - User identifier
   * @param {string} options.password - Password
   * @param {string} options.profileUrl - Profile URL
   * @param {string} options.serviceUrl - Service URL
   * @param {boolean} [options.includePermalink] - Include permalink in status
   */
  constructor(options) {
    this.identifier = options.identifier;
    this.password = options.password;
    this.profileUrl = options.profileUrl;
    this.serviceUrl = options.serviceUrl;
    this.includePermalink = options.includePermalink || false;
  }

  /**
   * Initialise AT Protocol client
   * @access private
   * @returns {Promise<AtpAgent>} AT Protocol agent
   */
  async #client() {
    const { identifier, password, serviceUrl } = this;
    const agent = new AtpAgent({ service: serviceUrl });

    await agent.login({ identifier, password });

    return agent;
  }

  /**
   * Get a post
   * @param {string} postUrl - URL of post to like
   * @returns {Promise<{
   *   uri: string;
   *   cid: string;
   *   value: import("@atproto/api").AppBskyFeedPost.Record;
   * }>} Bluesky post record
   */
  async getPost(postUrl) {
    const client = await this.#client();
    const postParts = getPostParts(postUrl);

    return await client.getPost({
      repo: postParts.did,
      rkey: postParts.rkey,
    });
  }

  /**
   * Post a like
   * @param {string} postUrl - URL of post to like
   * @returns {Promise<string>} Bluesky post URL
   */
  async postLike(postUrl) {
    const client = await this.#client();
    const post = await this.getPost(postUrl);
    const like = await client.like(post.uri, post.cid);

    return uriToPostUrl(this.profileUrl, like.uri);
  }

  /**
   * Post a repost
   * @param {string} postUrl - URL of post to repost
   * @returns {Promise<string>} Bluesky post URL
   */
  async postRepost(postUrl) {
    const client = await this.#client();
    const post = await this.getPost(postUrl);
    const repost = await client.repost(post.uri, post.cid);

    return uriToPostUrl(this.profileUrl, repost.uri);
  }

  /**
   * Post a quote post
   * @param {string} postUrl - URL of post to quote
   * @param {object} richText - Rich text
   * @param {import("@atproto/api").AppBskyEmbedImages.Image[]} [images] - Images
   * @returns {Promise<string>} Bluesky post URL
   */
  async postQuotePost(postUrl, richText, images) {
    const client = await this.#client();
    const post = await this.getPost(postUrl);

    /** @type {import('@atproto/api').AppBskyEmbedRecord.Main} */
    const record = {
      $type: "app.bsky.embed.record",
      record: { uri: post.uri, cid: post.cid },
    };

    /** @type {import('@atproto/api').AppBskyEmbedImages.Main & { $type: "app.bsky.embed.images" }} */
    const media = {
      $type: "app.bsky.embed.images",
      images,
    };

    /** @type {import('@atproto/api').AppBskyEmbedRecordWithMedia.Main} */
    const recordWithMedia = {
      $type: "app.bsky.embed.recordWithMedia",
      record,
      media,
    };

    const embed = images?.length > 0 ? recordWithMedia : record;

    /** @type {import('@atproto/api').AppBskyFeedPost.Record} */
    const postData = {
      $type: "app.bsky.feed.post",
      text: richText.text,
      facets: richText.facets,
      createdAt: new Date().toISOString(),
      embed:
        /** @type {import('@atproto/api').AppBskyFeedPost.Record['embed']} */ (
          embed
        ),
    };

    const quotePost = await client.post(postData);

    return uriToPostUrl(this.profileUrl, quotePost.uri);
  }

  /**
   * Post a post
   * @param {object} richText - Rich text
   * @param {object} [images] - Images
   * @returns {Promise<string>} Bluesky post URL
   */
  async postPost(richText, images) {
    const client = await this.#client();

    /** @type {import('@atproto/api').AppBskyFeedPost.Record} */
    const postData = {
      $type: "app.bsky.feed.post",
      text: richText.text,
      facets: richText.facets,
      createdAt: new Date().toISOString(),
      ...(images?.length > 0 && {
        embed: {
          $type: "app.bsky.embed.images",
          images,
        },
      }),
    };

    const post = await client.post(postData);

    return uriToPostUrl(this.profileUrl, post.uri);
  }

  /**
   * Upload media
   * @param {object} media - JF2 media object
   * @param {string} me - Publication URL
   * @returns {Promise<import("@atproto/api").BlobRef>} Blob reference for the uploaded media
   */
  async uploadMedia(media, me) {
    const client = await this.#client();
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

      let blob = await mediaResponse.blob();
      let encoding = mediaResponse.headers.get("Content-Type");

      // Compress image to meet maximum file size limit
      if (encoding?.startsWith("image/")) {
        const buffer = Buffer.from(await blob.arrayBuffer());
        const image = await getPostImage(buffer, encoding);

        blob = new Blob([new Uint8Array(image.buffer)], {
          type: image.mimeType,
        });
        encoding = image.mimeType;
      }

      const response = await client.com.atproto.repo.uploadBlob(blob, {
        encoding,
      });

      return response.data.blob;
    } catch (error) {
      const message = error.message;
      throw new Error(message);
    }
  }

  /**
   * Post to Bluesky
   * @param {object} properties - JF2 properties
   * @param {string} me - Publication URL
   * @returns {Promise<string|boolean>} URL of syndicated status
   */
  async post(properties, me) {
    try {
      const client = await this.#client();

      // Upload photos
      let images = [];
      if (properties.photo) {
        // Trim to 4 photos as Bluesky doesn’t support more
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
        // Syndicate repost of Bluesky URL with content as a quote post
        if (isSameOrigin(repostUrl, this.profileUrl) && properties.content) {
          const text = getPostText(properties, this.includePermalink);
          const richText = await createRichText(client, text);

          return this.postQuotePost(repostUrl, richText, images);
        }

        // Syndicate repost of Bluesky URL as a repost
        if (isSameOrigin(repostUrl, this.profileUrl)) {
          return this.postRepost(repostUrl);
        }

        // Do not syndicate reposts of other URLs
        return;
      }

      const likeOfUrl = properties["like-of"];
      if (likeOfUrl) {
        // Syndicate like of Bluesky URL as a like
        if (isSameOrigin(likeOfUrl, this.profileUrl)) {
          return this.postLike(likeOfUrl);
        }

        // Do not syndicate likes of other URLs
        return;
      }

      const text = getPostText(properties, this.includePermalink);
      const richText = await createRichText(client, text);

      return this.postPost(richText, images);
    } catch (error) {
      const message = error.message;
      throw new Error(message);
    }
  }
}
