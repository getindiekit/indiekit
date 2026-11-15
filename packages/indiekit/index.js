import { createRequire } from "node:module";
import process from "node:process";

import { getMongodbClient } from "@indiekit/util";
import KeyvMongo from "@keyv/mongo";
import makeDebug from "debug";
import Keyv from "keyv";

import { expressConfig } from "./config/express.js";
import { locales } from "./config/locales.js";
import { getCategories } from "./lib/categories.js";
import { getIndiekitConfig } from "./lib/config.js";
import { getLocaleCatalog } from "./lib/locale-catalog.js";
import { backfillUids } from "./lib/migrate-uid.js";
import { getInstalledPlugins } from "./lib/plugins.js";
import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";
import { getMediaStore, getStore } from "./lib/store.js";

const require = createRequire(import.meta.url);
const package_ = require("./package.json");
const debug = makeDebug(`indiekit:index`);

export const Indiekit = class {
  /**
   * Create an Indiekit instance from configuration
   * @param {object} [options] - Options
   * @param {IndiekitConfig} [options.config] - Configuration object
   * @param {string} [options.configFilePath] - Configuration file path
   * @returns {Promise<Indiekit>} Indiekit instance
   */
  static async initialize(options = {}) {
    const config = await getIndiekitConfig({
      config: options.config,
      configFilePath: options.configFilePath,
    });

    return new Indiekit(config);
  }

  /**
   * @type {MongoClient|undefined}
   */
  mongodbClient;

  /**
   * @type {Error|undefined}
   */
  mongodbClientError;

  /**
   * @private
   * @param {IndiekitResolvedConfig} config - Indiekit configuration
   */
  constructor(config) {
    this.config = config;
    this.package = package_;

    // Captured before any request is served: `locals` middleware assigns to
    // `config.application.url`, so the configured value has to be read here to
    // stay distinguishable from one derived from a request.
    this.applicationUrl = config.application?.url;
    this.collections = new Map();
    this.collectionIndexes = new Map();
    this.endpoints = new Set();
    this.installedPlugins = new Set();
    this.locale = config.application?.locale;
    this.locales = locales;
    this.mongodbUrl = config.application?.mongodbUrl;
    this.postTypes = new Map();
    // The same object as `config.publication`, which holds configuration until
    // `updatePublicationConfig()` completes it, before any request is served
    this.publication = /** @type {IndiekitPublication} */ (config.publication);
    this.stores = new Set();
    this.validationSchemas = new Map();
  }

  /**
   * Add a database collection
   * @param {string} name - Collection name
   * @param {Array<{key: Record<string, 1|-1>, unique?: boolean}>} [indexes] - Indexes to create on it, each
   *   a `key` plus any `createIndex` options, such as `unique`
   */
  addCollection(name, indexes = []) {
    if (this.collections.has(name)) {
      console.warn(`Collection ‘${name}’ already added`);
    } else if (this.database) {
      this.collections.set(name, this.database.collection(name));
      this.collectionIndexes.set(name, indexes);
      debug(`Added database collection: ${name}`);
    }
  }

  /**
   * Create the indexes collections declared
   *
   * Creating an index that already exists is a no-op, so this runs on every
   * start. A plug-in declares its indexes where it adds the collection; the
   * core creates them once the database is connected and before serving.
   * @returns {Promise<void>}
   */
  async createIndexes() {
    for (const [name, indexes] of this.collectionIndexes) {
      const collection = this.collections.get(name);
      for (const { key, ...options } of indexes) {
        await collection.createIndex(key, options);
        debug(`Indexed ${JSON.stringify(key)} on ‘${name}’`);
      }
    }
  }

  /**
   * Add an endpoint
   * @param {IndiekitEndpoint} endpoint - Endpoint plug-in
   */
  addEndpoint(endpoint) {
    this.endpoints.add(endpoint);
    debug(`Added endpoint: ${endpoint.name}`);
  }

  /**
   * Add a post type
   *
   * A plug-in that only adds validation schemas passes `false` as the type.
   * @param {string|false} type - Post type
   * @param {IndiekitPostTypePlugin} postType - Post type plug-in
   */
  addPostType(type, postType) {
    if (postType.config) {
      this.postTypes.set(type, {
        ...this.postTypes.get(type),
        ...postType.config,
      });
    }

    if (postType.validationSchemas) {
      for (const [field, schema] of Object.entries(
        postType.validationSchemas,
      )) {
        this.validationSchemas.set(field, schema);
      }
    }
  }

  /**
   * Add a publication preset
   * @param {IndiekitPreset} preset - Preset plug-in
   */
  addPreset(preset) {
    this.publication.preset = preset;
    debug(`Added publication preset: ${preset.name}`);
  }

  /**
   * Add a content store
   * @param {IndiekitStore} store - Content store plug-in
   */
  addStore(store) {
    this.stores.add(store);
    debug(`Added content store: ${store.name}`);
  }

  /**
   * Add one or more syndication targets
   * @param {IndiekitSyndicationTarget|IndiekitSyndicationTarget[]} syndicator - Syndicator plug-in(s)
   */
  addSyndicator(syndicator) {
    const syndicationTargets = [
      ...this.publication.syndicationTargets,
      ...(Array.isArray(syndicator) ? syndicator : [syndicator]),
    ];
    this.publication.syndicationTargets = syndicationTargets;
    const names = syndicationTargets.map((target) => target.name);
    debug(`Added ${names.length} syndication target/s: ${names.join(", ")}`);
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
    if (!this.mongodbClient) {
      return;
    }

    console.info(`Closing MongoDB client`);
    this.mongodbClient.close();
  }

  get cache() {
    return this.mongodbClient && this.mongodbUrl
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
      throw new Error(
        "No publication URL in configuration. See https://getindiekit.com/configuration/publication#me",
      );
    }

    // A publication can start without a content store, but can’t save posts
    this.publication.categories = await getCategories(this);
    this.publication.mediaStore = /** @type {IndiekitStore} */ (
      getMediaStore(this)
    );
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this);
    this.publication.store = /** @type {IndiekitStore} */ (getStore(this));
  }

  /**
   * Stop server and close database connection
   * @param {Server} server - HTTP server
   * @param {string} [name] - Application name
   */
  stop(server, name) {
    server.close(() => {
      console.info(`Stopping ${name}`);
      this.closeMongodbClient();

      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0);
    });
  }

  /**
   * Start server
   * @param {object} [options] - Options
   * @param {string|number} [options.port] - Port to listen on
   * @returns {Promise<Server>} HTTP server
   */
  async server(options = {}) {
    await this.connectMongodbClient();
    await this.installPlugins();

    // Posts and media created before `properties.uid` existed have no
    // identifier to look them up by. Backfill before serving: a half-migrated
    // collection would answer some lookups and 404 others.
    // @todo Remove with `migrate-uid.js` once every existing database has
    // been backfilled: at v1.0.0 or the move off MongoDB (#821).
    //
    // The list is deliberately literal, not `this.collections`: the backfill's
    // `$set: { "properties.uid": ... }` CREATES a `properties` subdocument, so
    // running it against any other collection a plugin registers — a cache, a
    // token store, a queue — would silently graft an unrelated field onto data
    // this migration has no business touching.
    for (const name of ["posts", "media"]) {
      const collection = this.collections.get(name);
      if (collection) {
        const updated = await backfillUids(collection);
        debug(`Checked ‘${name}’ for missing uids: ${updated} added`);
        if (updated > 0) {
          console.info(`Added a uid to ${updated} items in ‘${name}’`);
        }
      }
    }

    await this.createIndexes();

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

/**
 * @import { MongoClient } from "@indiekit/util"
 * @import { Server } from "node:http"
 */
