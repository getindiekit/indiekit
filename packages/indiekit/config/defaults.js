import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {JekyllConfig} from '@indiekit/config-jekyll';
import {MediaEndpoint} from '@indiekit/endpoint-media';
import {MicropubEndpoint} from '@indiekit/endpoint-micropub';
import {ShareEndpoint} from '@indiekit/endpoint-share';
import {authenticate} from '../middleware/authentication.js';
import {indieauth} from '../middleware/indieauth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jekyllConfig = new JekyllConfig();
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
    configs: [jekyllConfig],
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
    routes: [],
    stores: [],
    views: [
      path.join(__dirname, '..', 'views')
    ]
  },
  publication: {
    config: {},
    configPresetId: 'jekyll',
    locale: 'en-GB',
    me: null,
    postTemplate,
    storeId: null,
    timezone: 'UTC',
    tokenEndpoint: 'https://tokens.indieauth.com/token'
  },
  server: {
    port: process.env.PORT || '3000',
    secret: process.env.SECRET
  }
};
