import express from 'express';
import multer from 'multer';
import {fileURLToPath} from 'url';
import path from 'path';
import {queryController} from './controllers/query.js';
import {uploadController} from './controllers/upload.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  mountpath: '/media'
};

export const MediaEndpoint = class {
  constructor(options = {}) {
    this.id = 'media';
    this.name = 'Micropub media endpoint';
    this.options = {...defaults, ...options};
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  init(indiekitConfig) {
    const {application, publication} = indiekitConfig;

    indiekitConfig.addRoute({
      mountpath: this.mountpath,
      routes: () => this.routes(application, publication)
    });

    indiekitConfig.set(publication['media-endpoint'], this.mountpath);
  }

  routes(application, publication) {
    const router = this._router;
    const {indieauth} = application.middleware;
    const multipartParser = multer({
      storage: multer.memoryStorage()
    });

    this._router.get('/', queryController(publication));
    this._router.post('/', indieauth(publication), multipartParser.single('file'), uploadController(publication));

    return router;
  }
};
