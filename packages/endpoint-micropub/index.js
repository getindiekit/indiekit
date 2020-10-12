import express from 'express';
import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';
import {actionController} from './controllers/action.js';
import {postsController} from './controllers/posts.js';
import {queryController} from './controllers/query.js';
import {locales} from './locales/index.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  mountpath: '/micropub'
};

export const MicropubEndpoint = class {
  constructor(options = {}) {
    this.id = 'micropub';
    this.name = 'Micropub endpoint';
    this.options = {...defaults, ...options};
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  get namespace() {
    return 'endpoint-micropub';
  }

  init(indiekitConfig) {
    const {application, publication} = indiekitConfig;

    indiekitConfig.addLocale('de', locales.de);
    indiekitConfig.addLocale('en', locales.en);
    indiekitConfig.addLocale('fr', locales.fr);

    if (application.hasDatabase) {
      indiekitConfig.addNavigation({
        href: `${this.mountpath}/posts`,
        text: 'micropub.title'
      });
    }

    indiekitConfig.addRoute({
      mountpath: this.mountpath,
      routes: () => this.routes(application, publication)
    });

    indiekitConfig.addView(path.join(__dirname, 'views'));

    indiekitConfig.set('publication.micropubEndpoint', this.mountpath);
  }

  routes(application, publication) {
    const router = this._router;
    const {authenticate, indieauth} = application.middleware;
    const multipartParser = multer({
      storage: multer.memoryStorage()
    });

    this._router.get('/', queryController(publication));
    this._router.post('/', indieauth(publication), multipartParser.any(), actionController(publication));

    if (application.hasDatabase) {
      this._router.get('/posts', authenticate, postsController(publication).list);
      this._router.get('/posts/:id', authenticate, postsController(publication).view);
    }

    return router;
  }
};
