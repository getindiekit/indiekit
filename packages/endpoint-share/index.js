import {fileURLToPath} from 'node:url';
import express from 'express';
import {locales} from './locales/index.js';
import {shareController} from './lib/controllers/share.js';
import {validate} from './lib/middleware/validation.js';

const defaults = {
  mountPath: '/share',
};

export const ShareEndpoint = class {
  constructor(options = {}) {
    this.id = 'endpoint-share';
    this.name = 'Share endpoint';
    this.options = {...defaults, ...options};
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountPath() {
    return this.options.mountPath;
  }

  init(indiekitConfig) {
    const {application, publication} = indiekitConfig;

    indiekitConfig.addLocale('de', locales.de);
    indiekitConfig.addLocale('en', locales.en);
    indiekitConfig.addLocale('fr', locales.fr);

    indiekitConfig.addNavigation({
      href: this.mountPath,
      text: 'share.title',
    });

    indiekitConfig.addRoute({
      mountPath: this.mountPath,
      routes: () => this.routes(application, publication),
    });

    indiekitConfig.addView([
      fileURLToPath(new URL('includes', import.meta.url)),
      fileURLToPath(new URL('views', import.meta.url)),
    ]);

    indiekitConfig.set('application.shareEndpoint', this.mountPath);
  }

  routes(application, publication) {
    const router = this._router;
    const {authenticate} = application.middleware;

    router.get('/:path?', authenticate, shareController(publication).get);
    router.post('/:path?', validate, authenticate, shareController(publication).post);

    return router;
  }
};
