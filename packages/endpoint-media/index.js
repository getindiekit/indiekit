import express from 'express';
import multer from 'multer';
import {fileURLToPath} from 'node:url';
import {uploadController} from './lib/controllers/upload.js';
import {filesController} from './lib/controllers/files.js';
import {queryController} from './lib/controllers/query.js';
import {locales} from './locales/index.js';

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

    indiekitConfig.addView(fileURLToPath(new URL('views', import.meta.url)));

    indiekitConfig.set('publication.mediaEndpoint', this.mountpath);
  }

  routes(application, publication) {
    const router = this._router;
    const {authenticate, indieauth} = application.middleware;
    const multipartParser = multer({
      storage: multer.memoryStorage()
    });

    router.get('/', queryController(publication));
    router.post('/', indieauth(publication), multipartParser.single('file'), uploadController(publication));
    router.get('/files', authenticate, filesController(application, publication).list);
    router.get('/files/:id', authenticate, filesController(application, publication).view);

    return router;
  }
};
