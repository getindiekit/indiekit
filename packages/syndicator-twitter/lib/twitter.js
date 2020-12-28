/* eslint-disable camelcase */
import brevity from 'brevity';
import got from 'got';
import path from 'path';
import Twitter from 'twitter-lite';

export const twitter = options => ({
  client: (subdomain = 'api') => new Twitter({
    subdomain,
    consumer_key: options.apiKey,
    consumer_secret: options.apiKeySecret,
    access_token_key: options.accessToken,
    access_token_secret: options.accessTokenSecret
  }),

  /**
   * Test if string is a Twitter status URL
   *
   * @param {string} string URL
   * @returns {boolean} Twitter status URL?
   */
  isTweetUrl: string => {
    const parsedUrl = new URL(string);
    return parsedUrl.hostname === 'twitter.com';
  },

  /**
   * Get status ID from Twitter status URL
   *
   * @param {string} url Twitter status URL
   * @returns {string} Status ID
   */
  getStatusIdFromUrl: url => {
    const parsedUrl = new URL(url);
    const statusId = path.basename(parsedUrl.pathname);
    return statusId;
  },

  /**
   * Post a like
   *
   * @param {string} tweetUrl URL of tweet to like
   * @returns {string} Twitter status URL
   */
  async postLike(tweetUrl) {
    try {
      const statusId = this.getStatusIdFromUrl(tweetUrl);
      const {user, id_str} = await this.client().post('favorites/create', {id: statusId});
      const url = `https://twitter.com/${user.screen_name}/status/${id_str}`;
      return url;
    } catch (error) {
      const errorObject = error.errors ? error.errors[0] : error;
      throw new Error(errorObject.message);
    }
  },

  /**
   * Post a retweet
   *
   * @param {string} tweetUrl URL of tweet to retweet
   * @returns {string} Twitter status URL
   */
  async postRetweet(tweetUrl) {
    try {
      const statusId = this.getStatusIdFromUrl(tweetUrl);
      const {user, id_str} = await this.client().post(`statuses/retweet/${statusId}`);
      const url = `https://twitter.com/${user.screen_name}/status/${id_str}`;
      return url;
    } catch (error) {
      const errorObject = error.errors ? error.errors[0] : error;
      throw new Error(errorObject.message);
    }
  },

  /**
   * Post a status
   *
   * @param {object} parameters Status parameters
   * @returns {string} Twitter status URL
   */
  async postStatus(parameters) {
    try {
      const {user, id_str} = await this.client().post('statuses/update', parameters);
      const url = `https://twitter.com/${user.screen_name}/status/${id_str}`;
      return url;
    } catch (error) {
      const errorObject = error.errors ? error.errors[0] : error;
      throw new Error(errorObject.message);
    }
  },

  /**
   * Upload media and return Twitter media id
   *
   * @param {string} url Media URL
   * @returns {string} Twitter media id
   */
  async uploadMedia(url) {
    if (typeof url !== 'string') {
      return;
    }

    try {
      const response = await got(url, {responseType: 'buffer'});
      const buffer = Buffer.from(response.body).toString('base64');
      const {media_id_string} = await this.client('upload').post('media/upload', {media_data: buffer});
      return media_id_string;
    } catch (error) {
      const errorObject = error.errors ? error.errors[0] : error;
      throw new Error(errorObject.message);
    }
  },

  /**
   * Get status parameters from given JF2 properties
   *
   * @param {object} properties A JF2 properties object
   * @returns {object} Status parameters
   */
  async createStatus(properties) {
    const parameters = {};

    let status;

    if (properties['post-type'] === 'article') {
      status = `${properties.name}\n\n${properties.url}`;
    } else if (properties.name) {
      status = properties.name;
    } else if (properties.content && properties.content.text) {
      status = properties.content.text;
    } else if (properties.content) {
      status = properties.content;
    }

    // If repost of Twitter URL with content, create a quote tweet
    if (properties['post-type'] === 'repost') {
      status = `${properties.content}\n\n${properties['repost-of']}`;
    }

    // If post is in reply to a tweet, add respective parameter
    if (properties['in-reply-to']) {
      const replyTo = properties['in-reply-to'];
      if (replyTo.includes('twitter.com')) {
        const statusId = this.getStatusIdFromUrl(replyTo);
        parameters.in_reply_to_status_id = statusId;
      }
    }

    // Add location parameters
    if (properties.location) {
      parameters.lat = properties.location.properties.latitude;
      parameters.long = properties.location.properties.longitude;
    }

    // Add photos
    if (properties.photo) {
      const uploads = [];

      // Trim to 4 photos as Twitter doesn’t support more
      const photos = properties.photo.slice(0, 4);
      for await (const photo of photos) {
        uploads.push(this.uploadMedia(photo.url));
      }

      const mediaIds = await Promise.all(uploads);

      parameters.media_ids = mediaIds.join(',');
    }

    // Truncate status if longer than 280 characters
    parameters.status = brevity.shorten(
      status,
      properties.url,
      false, // https://indieweb.org/permashortlink
      false, // https://indieweb.org/permashortcitation
      280
    );

    return parameters;
  },

  /**
   * Post to Twitter
   *
   * @param {object} properties JF2 properties object
   * @returns {string} URL of syndicated tweet
   */
  async post(properties) {
    if (properties['repost-of']) {
      // Syndicate repost of Twitter URL with content as a quote tweet
      if (this.isTweetUrl(properties['repost-of']) && properties.content) {
        const status = await this.createStatus(properties);
        return this.postStatus(status);
      }

      // Syndicate repost of Twitter URL as a retweet
      if (this.isTweetUrl(properties['repost-of'])) {
        return this.postRetweet(properties['repost-of']);
      }

      // Do not syndicate reposts of other URLs
      return false;
    }

    if (properties['like-of']) {
      // Syndicate like of Twitter URL as a like
      if (this.isTweetUrl(properties['like-of'])) {
        return this.postLike(properties['like-of']);
      }

      // Do not syndicate likes of other URLs
      return false;
    }

    const status = await this.createStatus(properties);
    if (status) {
      return this.postStatus(status);
    }
  }
});
