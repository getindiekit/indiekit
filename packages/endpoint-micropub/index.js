import express from 'express';
import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';
import {actionController} from './controllers/action.js';
import {postsController} from './controllers/posts.js';
import {queryController} from './controllers/query.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  mountpath: '/micropub'
};

export const MicropubEndpoint = class {
  constructor(options) {
    this.id = 'micropub';
    this.name = 'Micropub endpoint';
    this.options = options || defaults;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  init(indiekitConfig) {
    const {application, publication} = indiekitConfig;

    indiekitConfig.addNavigation({
      href: `${this.mountpath}/posts`,
      text: 'Posts'
    });

    indiekitConfig.addRoute({
      mountpath: this.mountpath,
      routes: () => this.routes(application, publication)
    });

    indiekitConfig.addView(path.join(__dirname, 'views'));

    indiekitConfig.set(publication['micropub-endpoint'], this.mountpath);
  }

  routes(application, publication) {
    const router = this._router;
    const {authenticate, indieauth} = application.middleware;
    const multipartParser = multer({
      storage: multer.memoryStorage()
    });

    this._router.get('/', queryController(publication));
    this._router.post('/', indieauth(publication), multipartParser.any(), actionController(publication));
    this._router.get('/posts', authenticate, postsController(publication).view);

    return router;
  }
};
