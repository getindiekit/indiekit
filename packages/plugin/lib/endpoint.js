import makeDebug from "debug";
import express from "express";

import { IndiekitPlugin } from "./base.js";

const debug = makeDebug(`indiekit:plugin`);

/**
 * @typedef NavigationItem
 * @property {string} href - Navigation path
 * @property {string} text - Text shown in the navigation item
 * @property {boolean} [requiresDatabase] - Points to feature requiring database
 */

/**
 * @typedef ShortcutItem
 * @property {string} url - Shortcut URL
 * @property {string} name - Text shown in shortcut item
 * @property {string} [iconName] - Icon to use for shortcut item
 * @property {boolean} [requiresDatabase] - Points to feature requiring database
 */

/**
 * Endpoint plugin
 * @class
 * @augments {IndiekitPlugin}
 */
export class IndiekitEndpointPlugin extends IndiekitPlugin {
  /**
   * Path to mount plug-in routes onto
   * @type {string}
   */
  mountPath = undefined;

  /**
   * Navigation item(s) to show in application navigation menu
   * @type {Array<NavigationItem>|NavigationItem}
   */
  navigationItems = undefined;

  /**
   * Express router
   * @type {import("express").Router}
   */
  router = express.Router({ caseSensitive: true, mergeParams: true });

  /**
   * Shortcut item(s) to add to application’s manifest
   * @type {Array<ShortcutItem>|ShortcutItem}
   */
  shortcutItems = undefined;

  #addEndpoint() {
    debug("Adding endpoint at", this.mountPath);
    this.indiekit.endpoints.add(this);
  }

  async init() {
    await super.init();

    this.#addEndpoint();
  }
}
