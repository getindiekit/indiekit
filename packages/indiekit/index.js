import _ from 'lodash';
import path from 'path';
import {fileURLToPath} from 'url';
import {defaultConfig} from './config/defaults.js';
import {mongodbConfig} from './config/mongodb.js';
import {serverConfig} from './config/server.js';
import {Cache} from './lib/cache.js';
import {
  getCategories,
  getPostTemplate,
  getPostTypes,
  getPreset,
  getStore
} from './lib/publication.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const Indiekit = class {
  constructor(config) {
    this._config = config || defaultConfig;
  }

  get application() {
    return this._config.application;
  }

  get publication() {
    return this._config.publication;
  }

  set(key, value) {
    if (typeof key !== 'string') {
      throw new TypeError('Configuration key must be a string');
    }

    if (!value) {
      throw new Error(`No value given for ${key}`);
    }

    _.set(this._config, key, value);
  }

  addEndpoint(endpoint) {
    this.application.endpoints = this.application.endpoints.concat(endpoint);
  }

  addNavigation(item) {
    this.application.navigationItems = this.application.navigationItems.concat(item);
  }

  addPreset(preset) {
    this.application.presets = this.application.presets.concat(preset);
  }

  addRoute(route) {
    this.application.routes = this.application.routes.concat(route);
  }

  addStore(store) {
    this.application.stores = this.application.stores.concat(store);
  }

  addView(view) {
    this.application.views = this.application.views.concat(view);
  }

  async init() {
    const {hasDatabase, locale, presets, stores} = this.application;

    // Setup databases
    if (hasDatabase) {
      const database = await mongodbConfig;
      this.application.cache = await database.collection('cache');
      this.publication.posts = await database.collection('posts');
      this.publication.media = await database.collection('media');
    }

    // Setup cache
    const cache = new Cache(this.application.cache);

    // Update publication configuration
    this.publication.categories = await getCategories(cache, this.publication);
    this.publication.locale = this.publication.locale || locale;
    this.publication.preset = getPreset(presets, this.publication);
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this.publication);
    this.publication.store = getStore(stores, this.publication);

    // Application endpoints
    this.application.endpoints.forEach(
      endpoint => endpoint.init(this)
    );

    return this._config;
  }

  async server(options = {}) {
    try {
      const config = await this.init();
      const server = serverConfig(config);
      const {name, version} = config.application;
      const port = options.port || config.server.port;

      return server.listen(port, () => {
        console.log(`Starting ${name} (v${version}) on port ${port}`);
      });
    } catch (error) {
      console.error(error.message);
    }
  }
};
