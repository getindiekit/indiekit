import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {JekyllPreset} from '@indiekit/preset-jekyll';
import {MediaEndpoint} from '@indiekit/endpoint-media';
import {MicropubEndpoint} from '@indiekit/endpoint-micropub';
import {ShareEndpoint} from '@indiekit/endpoint-share';
import {authenticate} from '../middleware/authentication.js';
import {indieauth} from '../middleware/indieauth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '..', 'package.json');
const package_ = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const jekyll = new JekyllPreset();
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
