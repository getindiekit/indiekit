import { BskyAgent, RichText } from "@atproto/api";
import { getStatusText } from "./utils.js";

/**
 * Syndicate post to an AT Protocol service
 * @param {object} options - Syndicator options
 * @param {string} options.identifier - User identifier
 * @param {string} options.password - Password
 * @param {boolean} options.includePermalink - Include permalink in status
 * @param {string} options.service - Service URL
 * @returns {object} Post functions
 */
export const atproto = ({
  identifier,
  password,
  includePermalink,
  service,
}) => ({
  async client() {
    const agent = new BskyAgent({ service });

    await agent.login({ identifier, password });

    return agent;
  },

  /**
   * Post to AT Protocol
   * @param {object} properties - JF2 properties
   * @returns {Promise<string|boolean>} URL of syndicated status
   */
  async post(properties) {
    const client = await this.client();
    const text = getStatusText(properties, {
      includePermalink,
      service,
    });

    const rt = new RichText({ text });
    await rt.detectFacets(client);

    return client.post({
      $type: "app.bsky.feed.post",
      text: rt.text,
      facets: rt.facets,
      createdAt: new Date().toISOString(),
    });
  },
});
