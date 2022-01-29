import express from 'express';
import {syndicateController} from './lib/controllers/syndicate.js';

const defaults = {
  mountPath: '/syndicate',
};

export const SyndicateEndpoint = class {
  constructor(options = {}) {
    this.id = 'endpoint-syndicate';
    this.name = 'Syndication endpoint';
    this.options = {...defaults, ...options};
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountPath() {
    return this.options.mountPath;
  }

  init(Indiekit) {
    const {application, publication} = Indiekit;

    Indiekit.addRoute({
      mountPath: this.mountPath,
      routes: () => this.routes(application, publication),
    });
  }

  routes(application, publication) {
    const router = this._router;
    router.post('/', syndicateController(application, publication).post);

    return router;
  }
};

export default SyndicateEndpoint;
