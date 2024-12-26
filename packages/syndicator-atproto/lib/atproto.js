import { AtpAgent, RichText } from "@atproto/api";
import { isSameOrigin } from "@indiekit/util";

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
   * Post to AT Protocol
   * @param {object} properties - JF2 properties
   * @returns {Promise<string|boolean>} URL of syndicated status
   */
  async post(properties) {
    const client = await this.client();

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
      const post = await client.post({
        $type: "app.bsky.feed.post",
        text: rt.text,
        facets: rt.facets,
        createdAt: new Date().toISOString(),
      });

      return uriToPostUrl(profileUrl, post.uri);
    } catch (error) {
      const message = error.message;
      throw new Error(message);
    }
  },
});
