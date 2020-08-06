import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {JekyllPreset} from '@indiekit/preset-jekyll';
import {MediaEndpoint} from '@indiekit/endpoint-media';
import {MicropubEndpoint} from '@indiekit/endpoint-micropub';
import {ShareEndpoint} from '@indiekit/endpoint-share';
import {authenticate} from '../middleware/authentication.js';
import {indieauth} from '../middleware/indieauth.js';
import {databaseConfig} from './database.js';
import {Cache} from '../lib/cache.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jekyll = new JekyllPreset();
const package_ = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const mediaEndpoint = new MediaEndpoint();
const micropubEndpoint = new MicropubEndpoint();
const shareEndpoint = new ShareEndpoint();

// Default post template returns JSON
const postTemplate = properties => {
  return JSON.stringify(properties);
};

export const defaultConfig = {
  application: {
    name: 'Indiekit',
    locale: 'en',
    themeColor: '#0000ee',
    repository: package_.repository,
    version: package_.version,
    cache: new Cache(databaseConfig.client),
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
    presets: [
      jekyll
    ],
    routes: [],
    stores: [],
    views: [
      path.join(__dirname, '..', 'views')
    ]
  },
  publication: {
    config: {},
    locale: 'en-GB',
    me: null,
    postTemplate,
    presetId: 'jekyll',
    storeId: null,
    timezone: 'UTC',
    tokenEndpoint: 'https://tokens.indieauth.com/token'
  },
  server: {
    port: process.env.PORT || '3000',
    secret: process.env.SECRET
  }
};
