import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {syndicateController} from './lib/controllers/syndicate.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  jf2Feed: false,
  mountpath: '/syndicate'
};

export const SyndicateEndpoint = class {
  constructor(options = {}) {
    this.id = 'syndicate';
    this.name = 'Syndication endpoint';
    this.options = {...defaults, ...options};
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  get namespace() {
    return 'endpoint-syndicate';
  }

  init(indiekitConfig) {
    const {application, publication} = indiekitConfig;

    indiekitConfig.addRoute({
      mountpath: this.mountpath,
      routes: () => this.routes(application, publication)
    });
  }

  routes(application, publication) {
    const router = this._router;

    if (application.hasDatabase) {
      this._router.post('/', syndicateController(publication).post);
    }

    return router;
  }
};
