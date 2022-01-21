import _ from 'lodash';
import {defaultConfig} from './config/defaults.js';
import {expressConfig} from './config/express.js';
import {getMongodbConfig} from './lib/mongodb.js';
import {Cache} from './lib/cache.js';
import {
  getCategories,
  getPostTemplate,
  getPostTypes,
} from './lib/publication.js';

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
    endpoint = Array.isArray(endpoint) ? endpoint : [endpoint];
    this.application.endpoints = [...this.application.endpoints, ...endpoint];
  }

  addLocale(language, translations) {
    this.application.locales[language] = _.merge(this.application.locales[language], translations);
  }

  addNavigation(item) {
    item = Array.isArray(item) ? item : [item];
    this.application.navigationItems = [...this.application.navigationItems, ...item];
  }

  addRoute(route) {
    route = Array.isArray(route) ? route : [route];
    this.application.routes = [...this.application.routes, ...route];
  }

  addView(view) {
    view = Array.isArray(view) ? view : [view];
    this.application.views = [...this.application.views, ...view];
  }

  async bootstrap() {
    const database = await getMongodbConfig(this.application.mongodbUrl);

    // Setup databases
    if (database) {
      this.application.hasDatabase = true;
      this.application.cache = database.collection('cache');
      this.publication.posts = database.collection('posts');
      this.publication.media = database.collection('media');
    }

    // Setup cache
    const cache = new Cache(this.application.cache);

    // Application endpoints
    for (const endpoint of this.application.endpoints) {
      endpoint.init(this);
    }

    // Update publication configuration
    this.publication.categories = await getCategories(cache, this.publication);
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this.publication);

    return this._config;
  }

  async createApp() {
    try {
      const config = await this.bootstrap();
      const app = expressConfig(config);

      return app;
    } catch (error) {
      console.error(error.message);
    }
  }

  async server(options = {}) {
    const {application, server} = this._config;

    // Merge options with default server config
    options = {...server, ...options};

    const {name, version} = application;
    const {port} = options;
    const app = await this.createApp();

    return app.listen(port, () => {
      console.info(`Starting ${name} (v${version}) on port ${port}`);
    });
  }
};
