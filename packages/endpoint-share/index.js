import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {shareController} from './controllers/share.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  mountpath: '/share'
};

export const ShareEndpoint = class {
  constructor(options) {
    this.id = 'share';
    this.name = 'Share endpoint';
    this.options = options || defaults;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  get navigationItems() {
    return [{
      href: this.options.mountpath,
      text: 'Share'
    }];
  }

  get views() {
    return [
      path.join(__dirname, 'views'),
      path.join(__dirname, 'components')
    ];
  }

  routes(application) {
    const router = this._router;
    const {authenticate} = application.middleware;

    this._router.get('/:path?', authenticate, shareController(application).edit);
    this._router.post('/:path?', authenticate, shareController(application).save);

    return router;
  }
};
