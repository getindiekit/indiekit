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
  constructor(options) {
    this.id = 'media';
    this.name = 'Micropub media endpoint';
    this.options = options || defaults;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  routes(application, publication) {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage()
    });

    this._router.get('/', queryController(publication));
    this._router.post('/', multipartParser.single('file'), uploadController(publication));

    return router;
  }
};
