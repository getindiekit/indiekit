#!/usr/bin/env node
import process from "node:process";
import Keyv from "keyv";
import { expressConfig } from "./config/express.js";
import { getCategories } from "./lib/categories.js";
import { getIndiekitConfig } from "./lib/config.js";
import { getInstalledPlugins } from "./lib/installed-plugins.js";
import { getLocaleCatalog } from "./lib/locale-catalog.js";
import { getMongodbClient } from "./lib/mongodb.js";
import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export const Indiekit = class {
  /**
   * @private
   * @param {object} config - Indiekit configuration
   */
  constructor(config) {
    this.config = config;
    this.application = this.config.application;
    this.plugins = this.config.plugins;
    this.publication = this.config.publication;
    this.client = getMongodbClient(this.application.mongodbUrl);
  }

  static async initialize(options = {}) {
    const config = await getIndiekitConfig({
      config: options.config,
      configFilePath: options.configFilePath,
    });

    return new Indiekit(config);
  }

  addEndpoint(endpoint) {
    this.application.endpoints.push(endpoint);
  }

  addPreset(preset) {
    this.publication.preset = preset;
  }

  addStore(store) {
    this.publication.store = store;
  }

  addSyndicator(syndicator) {
    syndicator = Array.isArray(syndicator) ? syndicator : [syndicator];
    this.publication.syndicationTargets = [
      ...this.publication.syndicationTargets,
      ...syndicator,
    ];
  }

  async bootstrap() {
    // Check for required configuration options
    if (!this.publication.me) {
      console.error("No publication URL in configuration");
      console.info("https://getindiekit.com/configuration/#publication-me-url");
      process.exit();
    }

    // Setup database
    if (this.client) {
      const database = this.client.db("indiekit");

      this.application.hasDatabase = true;
      this.application.cache = new Keyv(this.application.mongodbUrl);
      this.application.posts = database.collection("posts");
      this.application.media = database.collection("media");
    }

    // Update application configuration
    this.application.installedPlugins = await getInstalledPlugins(this);
    this.application.localeCatalog = await getLocaleCatalog(this.application);

    // Update publication configuration
    this.publication.categories = await getCategories(this);
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this.publication);

    return this;
  }

  stop(server, name) {
    server.close(() => {
      console.info(`Stopping ${name}`);
      this.client.close();
      process.exit(0);
    });
  }

  async server(options = {}) {
    const config = await this.bootstrap();
    const { name, version } = config.application;
    const port = options.port || config.application.port;
    const app = expressConfig(config);

    const server = app.listen(port, () => {
      console.info(`Starting ${name} (v${version}) on port ${port}`);
    });

    process.on("SIGINT", () => this.stop(server, name));
    process.on("SIGTERM", () => this.stop(server, name));

    return server;
  }
};
