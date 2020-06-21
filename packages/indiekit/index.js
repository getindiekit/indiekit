import _ from 'lodash';
import path from 'path';
import {fileURLToPath} from 'url';
import {databaseConfig} from './config/database.js';
import {defaultConfig} from './config/defaults.js';
import {serverConfig} from './config/server.js';
import {getConfig, getConfigPreset, getStore, getCategories} from './services/publication.js';

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
    _.set(this._config, key, value);
  }

  addConfig(host) {
    this.application.configs.push(host);
  }

  addEndpoint(host) {
    this.application.endpoints.push(host);
  }

  addStore(store) {
    this.application.stores.push(store);
  }

  async init() {
    const {configs, stores} = this.application;
    const {config, configPresetId, storeId} = this.publication;
    const categories = await getCategories(databaseConfig.client, config.categories);
    const preset = getConfigPreset(configs, configPresetId);

    this.publication.preset = preset;
    this.publication.config = getConfig(config, preset.config);
    this.publication.config.categories = categories;
    this.publication.store = getStore(stores, storeId);
    return this;
  }

  server(options = {}) {
    this.init();
    const server = serverConfig(this._config);
    const port = options.port || this._config.server.port;

    return server.listen(port, () => {
      console.log(`Starting ${this.application.name} (v${this.application.version}) on port ${port}`);
    });
  }
};
