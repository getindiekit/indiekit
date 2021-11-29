import {fileURLToPath} from 'node:url';
import express from 'express';
import multer from 'multer';
import {actionController} from './lib/controllers/action.js';
import {postsController} from './lib/controllers/posts.js';
import {queryController} from './lib/controllers/query.js';
import {locales} from './locales/index.js';

const defaults = {
  mountpath: '/micropub',
};

export const MicropubEndpoint = class {
  constructor(options = {}) {
    this.id = 'endpoint-micropub';
    this.name = 'Micropub endpoint';
    this.options = {...defaults, ...options};
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  init(indiekitConfig) {
    const {application, publication} = indiekitConfig;

    indiekitConfig.addLocale('de', locales.de);
    indiekitConfig.addLocale('en', locales.en);
    indiekitConfig.addLocale('fr', locales.fr);

    if (application.hasDatabase) {
      indiekitConfig.addNavigation({
        href: `${this.mountpath}/posts`,
        text: 'micropub.title',
      });
    }

    indiekitConfig.addRoute({
      mountpath: this.mountpath,
      routes: () => this.routes(application, publication),
    });

    indiekitConfig.addView(fileURLToPath(new URL('views', import.meta.url)));

    indiekitConfig.set('publication.micropubEndpoint', this.mountpath);
  }

  routes(application, publication) {
    const router = this._router;
    const {authenticate, indieauth} = application.middleware;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get('/', queryController(publication));
    router.post('/', indieauth(publication), multipartParser.any(), actionController(publication));
    router.get('/posts', authenticate, postsController(application, publication).list);
    router.get('/posts/:id', authenticate, postsController(application, publication).view);

    return router;
  }
};
