#!/usr/bin/env node
import process from "node:process";
import Keyv from "keyv";
import KeyvMongoDB from "keyv-mongodb";
import { expressConfig } from "./config/express.js";
import { getIndiekitConfig } from "./lib/config.js";
import { getMongodbConfig } from "./lib/mongodb.js";
import { getInstalledPlugins, getLocaleCatalog } from "./lib/application.js";
import {
  getCategories,
  getPostTemplate,
  getPostTypes,
} from "./lib/publication.js";

export const Indiekit = class {
  constructor(options = {}) {
    this.config = getIndiekitConfig({
      config: options.config,
      configFilePath: options.configFilePath,
    });
    this.application = this.config.application;
    this.plugins = this.config.plugins;
    this.publication = this.config.publication;
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
    const database = await getMongodbConfig(this.application.mongodbUrl);

    // Setup databases
    if (database) {
      this.application.hasDatabase = true;
      this.application.cache = new Keyv({
        collectionName: "cache",
        store: new KeyvMongoDB({ db: database }),
        ttl: this.application.ttl,
      });
      this.publication.posts = database.collection("posts");
      this.publication.media = database.collection("media");
    }

    // Configure image endpoint
    // Express Sharp middleware requires that can only be provided via options
    this.config["@indiekit/endpoint-image"] = {
      cache: this.application.cache,
      me: this.publication.me,
    };

    // Update application configuration
    this.application.installedPlugins = await getInstalledPlugins(this);
    this.application.localeCatalog = await getLocaleCatalog(this.application);

    // Update publication configuration
    this.publication.categories = await getCategories(
      this.application.cache,
      this.publication
    );
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this.publication);

    return this;
  }

  async createApp() {
    const config = await this.bootstrap();
    const app = expressConfig(config);

    return app;
  }

  async server(options = {}) {
    const { application, publication, server } = this.config;

    // Check for required configuration options
    if (!publication.me) {
      console.error("No publication URL in configuration");
      console.info("See https://getindiekit.com/options/#publicationmeurl");
      process.exit();
    }

    // Merge options with default server configuration
    options = { ...server, ...options };

    const { name, version } = application;
    const { port } = options;
    const app = await this.createApp();

    return app.listen(port, () => {
      console.info(`Starting ${name} (v${version}) on port ${port}`);
    });
  }
};
