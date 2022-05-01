import deepmerge from "deepmerge";
import { expressConfig } from "./config/express.js";
import { getIndiekitConfig } from "./lib/config.js";
import { getMongodbConfig } from "./lib/mongodb.js";
import { Cache } from "./lib/cache.js";
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

  extend(type, extension) {
    const extensionTypes = ["navigationItems", "routes", "routesPublic"];

    if (!extensionTypes.includes(type)) {
      throw new TypeError(`${type} is not a valid extension type`);
    }

    extension = Array.isArray(extension) ? extension : [extension];
    this.application[type] = [...this.application[type], ...extension];
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

    // Register application localisations
    this.application.locales = new Map();
    for await (const locale of this.application.localesAvailable) {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const { default: translation } = await import(`./locales/${locale}.js`);
      this.application.locales.set(locale, translation);
    }

    // Init plug-ins
    for await (const pluginName of this.plugins) {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const { default: IndiekitPlugin } = await import(pluginName);
      const plugin = new IndiekitPlugin(this.config[pluginName]);

      // Register plug-in localisations
      for await (const locale of this.application.localesAvailable) {
        try {
          const appLocale = this.application.locales.get(locale);
          // eslint-disable-next-line node/no-unsupported-features/es-syntax
          const { default: translation } = await import(
            `../${plugin.id}/locales/${locale}.js`
          );
          this.application.locales.set(
            locale,
            deepmerge(appLocale, translation)
          );
        } catch {}
      }

      // Register plug-in functions
      if (plugin.init) {
        await plugin.init(this);
        this.application.installedPlugins.push(plugin);
      }
    }

    // Update publication configuration
    this.publication.categories = await getCategories(cache, this.publication);
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this.publication);

    return {
      application: this.application,
      publication: this.publication,
    };
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

    return app.listen(port, () => {
      console.info(`Starting ${name} (v${version}) on port ${port}`);
    });
  }
};
