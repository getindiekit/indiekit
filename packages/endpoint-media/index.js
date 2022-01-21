import {fileURLToPath} from 'node:url';
import express from 'express';
import multer from 'multer';
import {uploadController} from './lib/controllers/upload.js';
import {filesController} from './lib/controllers/files.js';
import {queryController} from './lib/controllers/query.js';
import {locales} from './locales/index.js';

const defaults = {
  mountPath: '/media',
};

export const MediaEndpoint = class {
  constructor(options = {}) {
    this.id = 'endpoint-media';
    this.name = 'Micropub media endpoint';
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
        href: `${this.mountPath}/files`,
        text: 'media.title',
      });
    }

    Indiekit.addRoute({
      mountPath: this.mountPath,
      routes: () => this.routes(application, publication),
    });

    Indiekit.addView(fileURLToPath(new URL('views', import.meta.url)));

    Indiekit.set('publication.mediaEndpoint', this.mountPath);
  }

  routes(application, publication) {
    const router = this._router;
    const {authenticate, indieauth} = application.middleware;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get('/', queryController(publication));
    router.post('/', indieauth(publication), multipartParser.single('file'), uploadController(publication));
    router.get('/files', authenticate, filesController(application, publication).list);
    router.get('/files/:id', authenticate, filesController(application, publication).view);

    return router;
  }
};

export default MediaEndpoint;
