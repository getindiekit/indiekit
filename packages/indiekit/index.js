import https from "node:https";
import { expressConfig } from "./config/express.js";
import { getIndiekitConfig } from "./lib/config.js";
import { getMongodbConfig } from "./lib/mongodb.js";
import { Cache } from "./lib/cache.js";
import { getInstalledPlugins, getLocales } from "./lib/application.js";
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
      this.application.cache = database.collection("cache");
      this.publication.posts = database.collection("posts");
      this.publication.media = database.collection("media");
    }

    // Setup cache
    const cache = new Cache(this.application.cache);

    // Configure image endpoint
    // Express Sharp middleware requires that can only be provided via options
    this.config["@indiekit/endpoint-image"] = {
      me: this.config.publication.me,
      mongodbUrl: this.config.application.mongodbUrl,
    };

    // Update application configuration
    this.application.installedPlugins = await getInstalledPlugins(this);
    this.application.locales = await getLocales(this.application);

    // Update publication configuration
    this.publication.categories = await getCategories(cache, this.publication);
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
    const { application, server } = this.config;

    // Merge options with default server configuration
    options = { ...server, ...options };

    const { name, version } = application;
    const { port } = options;
    const app = await this.createApp();

    return https.createServer(options, app).listen(port, () => {
      console.info(`Starting ${name} (v${version}) on port ${port}`);
    });
  }
};
