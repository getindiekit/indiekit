import makeDebug from "debug";

import { IndiekitPlugin } from "./base.js";

const debug = makeDebug(`indiekit:plugin`);

/**
 * @typedef SyndicationTarget
 * @property {string} name - Name of syndication target
 * @property {string} uid - Unique identifier
 * @property {boolean} [checked] - Use syndication target by default
 * @property {object} [service] - Service information
 * @property {string} [service.name] - Service name
 * @property {string} [service.url] - Service URL
 * @property {string} [service.photo] - Service logo
 * @property {object} [user] - User information
 * @property {string} [user.name] - User name
 * @property {string} [user.url] - User URL
 * @property {string} [user.photo] - User photo
 * @see {@link https://micropub.spec.indieweb.org/#syndication-targets}
 */

/**
 * Syndicator plug-in
 * @class
 * @augments {IndiekitPlugin}
 */
export class IndiekitSyndicatorPlugin extends IndiekitPlugin {
  /**
   * Syndication target information
   * @type {SyndicationTarget}
   */
  info = undefined;

  /**
   * Syndicate post
   * @param {object} properties - JF2 properties
   * @returns {Promise<string|boolean>} URL of syndicated status
   */
  async syndicate(properties) {
    debug(`Syndicating ${properties.url} to ${this.name}`);
    return;
  }

  #addSyndicator() {
    const syndicationTargets = new Set(
      this.indiekit.publication.syndicationTargets,
    );

    debug(`Adding syndication target: ${this.name}`);
    syndicationTargets.add(this);

    this.indiekit.publication.syndicationTargets = [...syndicationTargets];
  }

  async init() {
    await super.init();

    this.#addSyndicator();
  }
}
