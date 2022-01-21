import {fileURLToPath} from 'node:url';
import express from 'express';
import multer from 'multer';
import {actionController} from './lib/controllers/action.js';
import {postsController} from './lib/controllers/posts.js';
import {queryController} from './lib/controllers/query.js';
import {locales} from './locales/index.js';

const defaults = {
  mountPath: '/micropub',
};

export const MicropubEndpoint = class {
  constructor(options = {}) {
    this.id = 'endpoint-micropub';
    this.name = 'Micropub endpoint';
    this.options = {...defaults, ...options};
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountPath() {
    return this.options.mountPath;
  }

  init(Indiekit) {
    const {application, publication} = Indiekit;

    Indiekit.addLocale('de', locales.de);
    Indiekit.addLocale('en', locales.en);
    Indiekit.addLocale('fr', locales.fr);

    if (application.hasDatabase) {
      Indiekit.addNavigation({
        href: `${this.mountPath}/posts`,
        text: 'micropub.title',
      });
    }

    Indiekit.addRoute({
      mountPath: this.mountPath,
      routes: () => this.routes(application, publication),
    });

    Indiekit.addView(fileURLToPath(new URL('views', import.meta.url)));

    Indiekit.set('publication.micropubEndpoint', this.mountPath);
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

export default MicropubEndpoint;
