#!/usr/bin/env node
import process from "node:process";
import makeDebug from "debug";
import { default as Keyv } from "keyv";
import { default as KeyvMongo } from "@keyv/mongo";
import { expressConfig } from "./config/express.js";
import { getCategories } from "./lib/categories.js";
import { getIndiekitConfig } from "./lib/config.js";
import { getLocaleCatalog } from "./lib/locale-catalog.js";
import { getMongodbClient } from "./lib/mongodb.js";
import { getInstalledPlugins } from "./lib/plugins.js";
import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";
import { getMediaStore, getStore } from "./lib/store.js";

const debug = makeDebug(`indiekit:index`);

export const Indiekit = class {
  /**
   * @private
   * @param {object} config - Indiekit configuration
   */
  constructor(config) {
    this.config = config;
    this.collections = new Map();
    this.application = this.config.application;
    this.plugins = this.config.plugins;
    this.publication = this.config.publication;
  }

  static async initialize(options = {}) {
    const config = await getIndiekitConfig({
      config: options.config,
      configFilePath: options.configFilePath,
    });

    return new Indiekit(config);
  }

  addCollection(name) {
    if (this.collections.has(name)) {
      console.warn(`Collection ‘${name}’ already added`);
    } else if (this.database) {
      this.collections.set(name, this.database.collection(name));
      debug(`Added database collection: ${name}`);
    }
  }

  addEndpoint(endpoint) {
    this.application.endpoints.push(endpoint);
  }

  addPostType(type, postType) {
    if (postType.config) {
      this.application.postTypes[type] = {
        ...this.application.postTypes[type],
        ...postType.config,
      };
    }

    if (postType.validationSchemas) {
      this.application.validationSchemas = {
        ...this.application.validationSchemas,
        ...postType.validationSchemas,
      };
    }
  }

  addPreset(preset) {
    this.publication.preset = preset;
    debug(`Added publication preset: ${preset.name}`);
  }

  addStore(store) {
    this.application.stores.push(store);
    debug(`Added content store: ${store.name}`);
  }

  addSyndicator(syndicator) {
    syndicator = Array.isArray(syndicator) ? syndicator : [syndicator];
    this.publication.syndicationTargets = [
      ...this.publication.syndicationTargets,
      ...syndicator,
    ];
    const names = this.publication.syndicationTargets.map(
      (target) => target.name,
    );
    debug(`Added ${names.length} syndication target/s: ${names.join(", ")}`);
  }

  async connectMongodbClient() {
    const mongodbClientOrError = await getMongodbClient(
      this.application.mongodbUrl,
    );

    if (mongodbClientOrError?.client) {
      this.mongodbClient = mongodbClientOrError.client;
    }

    if (mongodbClientOrError?.error) {
      this.mongodbClientError = mongodbClientOrError.error;
    }
  }

  closeMongodbClient() {
    if (this.mongodbClient) {
      console.info(`Closing MongoDB client`);
      this.mongodbClient.close();
    }
  }

  get cache() {
    return this.mongodbClient
      ? new Keyv(new KeyvMongo(this.application.mongodbUrl))
      : false;
  }

  get database() {
    if (this.mongodbClient) {
      // Get database name from connection string
      let { databaseName } = this.mongodbClient.db();

      // If no database given, use ‘indiekit’ as default database, not ‘test’
      databaseName = databaseName === "test" ? "indiekit" : databaseName;

      debug(`Connect to MongoDB database ${databaseName}`);
      return this.mongodbClient.db(databaseName);
    }

    return false;
  }

  async bootstrap() {
    debug(`Bootstrap: check for required configuration options`);
    // Check for required configuration options
    if (!this.publication.me) {
      console.error("No publication URL in configuration");
      console.info("https://getindiekit.com/configuration/publication#me");
      process.exit();
    }

    // Update application configuration
    this.application.installedPlugins = await getInstalledPlugins(this);
    this.application.localeCatalog = await getLocaleCatalog(this.application);

    // Update publication configuration
    this.publication.categories = await getCategories(this);
    this.publication.mediaStore = getMediaStore(this);
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this);
    this.publication.store = getStore(this);

    return this;
  }

  stop(server, name) {
    server.close(() => {
      console.info(`Stopping ${name}`);

      this.closeMongodbClient();

      process.exit(0);
    });
  }

  async server(options = {}) {
    await this.connectMongodbClient();
    const config = await this.bootstrap();
    const { name, version } = config.application;
    const port = options.port || config.application.port;
    const app = expressConfig(config);

    const server = app.listen(port, () => {
      debug(`Start ${name} (v${version}) on port ${port}`);
      console.info(`Starting ${name} (v${version}) on port ${port}`);
    });

    debug(`Attach SIGINT handler`);
    process.on("SIGINT", () => this.stop(server, name));
    debug(`Attach SIGTERM handler`);
    process.on("SIGTERM", () => this.stop(server, name));

    return server;
  }
};
