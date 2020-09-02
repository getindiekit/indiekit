import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {MediaEndpoint} from '@indiekit/endpoint-media';
import {MicropubEndpoint} from '@indiekit/endpoint-micropub';
import {ShareEndpoint} from '@indiekit/endpoint-share';
import {authenticate} from '../middleware/authentication.js';
import {indieauth} from '../middleware/indieauth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '..', 'package.json');
const package_ = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const mediaEndpoint = new MediaEndpoint();
const micropubEndpoint = new MicropubEndpoint();
const shareEndpoint = new ShareEndpoint();

export const defaultConfig = {
  application: {
    name: 'Indiekit',
    locale: 'en',
    themeColor: '#0000ee',
    repository: package_.repository,
    version: package_.version,
    hasDatabase: typeof process.env.MONGODB_URL !== 'undefined',
    endpoints: [
      mediaEndpoint,
      micropubEndpoint,
      shareEndpoint
    ],
    middleware: {
      authenticate,
      indieauth
    },
    navigationItems: [],
    presets: [],
    routes: [],
    stores: [],
    views: [
      path.join(__dirname, '..', 'views')
    ]
  },
  publication: {
    categories: [],
    me: null,
    postTemplate: null,
    postTypes: [],
    preset: null,
    slugSeparator: '-',
    store: null,
    syndicationTargets: [],
    timezone: 'UTC',
    tokenEndpoint: 'https://tokens.indieauth.com/token'
  },
  server: {
    port: process.env.PORT || '3000'
  }
};
