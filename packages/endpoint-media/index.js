import express from 'express';
import multer from 'multer';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {uploadController} from './lib/controllers/upload.js';
import {filesController} from './lib/controllers/files.js';
import {queryController} from './lib/controllers/query.js';
import {locales} from './locales/index.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  mountpath: '/media'
};

export const MediaEndpoint = class {
  constructor(options = {}) {
    this.id = 'endpoint-media';
    this.name = 'Micropub media endpoint';
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
        href: `${this.mountpath}/files`,
        text: 'media.title'
      });
    }

    indiekitConfig.addRoute({
      mountpath: this.mountpath,
      routes: () => this.routes(application, publication)
    });

    indiekitConfig.addView(path.join(__dirname, 'views'));

    indiekitConfig.set('publication.mediaEndpoint', this.mountpath);
  }

  routes(application, publication) {
    const router = this._router;
    const {authenticate, indieauth} = application.middleware;
    const multipartParser = multer({
      storage: multer.memoryStorage()
    });

    this._router.get('/', queryController(publication));
    this._router.post('/', indieauth(publication), multipartParser.single('file'), uploadController(publication));

    if (application.hasDatabase) {
      this._router.get('/files', authenticate, filesController(publication).list);
      this._router.get('/files/:id', authenticate, filesController(publication).view);
    }

    return router;
  }
};
