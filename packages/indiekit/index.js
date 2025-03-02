#!/usr/bin/env node
import { createRequire } from "node:module";
import process from "node:process";

import KeyvMongo from "@keyv/mongo";
import makeDebug from "debug";
import Keyv from "keyv";

import { expressConfig } from "./config/express.js";
import { locales } from "./config/locales.js";
import { getCategories } from "./lib/categories.js";
import { getIndiekitConfig } from "./lib/config.js";
import { getLocaleCatalog } from "./lib/locale-catalog.js";
import { getMongodbClient } from "./lib/mongodb.js";
import { getInstalledPlugins } from "./lib/plugins.js";
import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";
import { getMediaStore, getStore } from "./lib/store.js";

const require = createRequire(import.meta.url);
const package_ = require("./package.json");
const debug = makeDebug(`indiekit:index`);

export const Indiekit = class {
  static async initialize(options = {}) {
    const config = await getIndiekitConfig({
      config: options.config,
      configFilePath: options.configFilePath,
    });

    return new Indiekit(config);
  }

  /**
   * @private
   * @param {object} config - Indiekit configuration
   */
  constructor(config) {
    this.config = config;
    this.package = package_;

    this.collections = new Map();
    this.endpoints = new Set();
    this.installedPlugins = new Set();
    this.locale = config.application?.locale;
    this.locales = locales;
    this.mongodbUrl = config.application?.mongodbUrl;
    this.postTypes = new Map();
    this.publication = this.config.publication;
    this.stores = new Set();
    this.validationSchemas = new Map();
  }

  addStore(store) {
    this.stores.add(store);
    debug(`Added content store: ${store.name}`);
  }

  async connectMongodbClient() {
    const mongodbClientOrError = await getMongodbClient(this.mongodbUrl);

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
      ? new Keyv(new KeyvMongo(this.mongodbUrl))
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

  get localeCatalog() {
    return getLocaleCatalog(this);
  }

  async installPlugins() {
    await getInstalledPlugins(this);
  }

  async updatePublicationConfig() {
    if (!this.publication.me) {
      console.error("No publication URL in configuration");
      console.info("https://getindiekit.com/configuration/publication#me");
      process.exit();
    }

    this.publication.categories = await getCategories(this);
    this.publication.mediaStore = getMediaStore(this);
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this);
    this.publication.store = getStore(this);
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
    await this.installPlugins();
    await this.updatePublicationConfig();

    const app = expressConfig(this);
    let { name, port } = this.config.application;
    const { version } = this.package;
    port = options.port || port;

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
