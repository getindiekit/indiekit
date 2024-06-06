import makeDebug from "debug";
import { IndiekitError } from "@indiekit/error";
import { createPost, userInfo } from "./lib/linkedin.js";

const debug = makeDebug(`indiekit-syndicator:linkedin`);

const DEFAULTS = {
  // The character limit for a LinkedIn post is 3000 characters.
  // https://www.linkedin.com/help/linkedin/answer/a528176
  characterLimit: 3000,

  checked: false,

  // https://learn.microsoft.com/en-us/linkedin/marketing/versioning
  // https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
  postsAPIVersion: "202401",
};

const retrieveAccessToken = async () => {
  // the access token could be stored in an environment variable, in a database, etc
  debug(
    `retrieve LinkedIn access token from environment variable LINKEDIN_ACCESS_TOKEN`,
  );

  return process.env.LINKEDIN_ACCESS_TOKEN === undefined
    ? {
        error: new Error(`environment variable LINKEDIN_ACCESS_TOKEN not set`),
      }
    : { value: process.env.LINKEDIN_ACCESS_TOKEN };
};

export default class LinkedInSyndicator {
  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.authorName] - Full name of the author
   * @param {string} [options.authorProfileUrl] - LinkedIn profile URL of the author
   * @param {number} [options.characterLimit] - LinkedIn post character limit
   * @param {boolean} [options.checked] - Check syndicator in UI
   * @param {string} [options.postsAPIVersion] - Version of the Linkedin /posts API to use
   */
  constructor(options = {}) {
    this.name = "LinkedIn syndicator";
    this.options = { ...DEFAULTS, ...options };
  }

  get environment() {
    return ["LINKEDIN_ACCESS_TOKEN", "LINKEDIN_AUTHOR_PROFILE_URL"];
  }

  get info() {
    const service = {
      name: "LinkedIn",
      photo: "/assets/@indiekit-syndicator-linkedin/icon.svg",
      url: "https://www.linkedin.com/",
    };

    const name = this.options.authorName || "unknown LinkedIn author name";
    const uid = this.options.authorProfileUrl || "https://www.linkedin.com/";
    const url =
      this.options.authorProfileUrl || "unknown LinkedIn author profile URL";

    return {
      checked: this.options.checked,
      name,
      service,
      uid,
      user: { name, url },
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "postsAPIVersion",
        message: "What is the LinkedIn Posts API version you want to use?",
        description: "e.g. 202401",
      },
    ];
  }

  async syndicate(properties, publication) {
    // debug(`syndicate properties %O`, properties);
    debug(`syndicate publication %O: `, {
      categories: publication.categories,
      me: publication.me,
    });

    const { error: tokenError, value: accessToken } =
      await retrieveAccessToken();

    if (tokenError) {
      throw new IndiekitError(tokenError.message, {
        cause: tokenError,
        plugin: this.name,
        status: 500,
      });
    }

    let authorName;
    // LinkedIn URN of the author. See https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/urns
    let authorUrn;
    try {
      const userinfo = await userInfo({ accessToken });
      authorName = userinfo.name;
      authorUrn = userinfo.urn;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.statusCode || 500,
      });
    }

    // TODO: switch on properties['post-type'] // e.g. article, note
    const text = properties.content.text;

    try {
      const { url } = await createPost({
        accessToken,
        authorName,
        authorUrn,
        text,
        versionString: this.options.postsAPIVersion,
      });
      debug(`post created, now online at ${url}`);
      return url;
    } catch (error) {
      // Axios Error
      // https://axios-http.com/docs/handling_errors
      const status = error.response.status;
      const message = `could not create LinkedIn post: ${error.response.statusText}`;
      throw new IndiekitError(message, {
        cause: error,
        plugin: this.name,
        status,
      });
    }
  }

  init(Indiekit) {
    Indiekit.addSyndicator(this);
  }
}
