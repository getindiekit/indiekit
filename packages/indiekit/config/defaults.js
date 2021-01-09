import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {MediaEndpoint} from '@indiekit/endpoint-media';
import {MicropubEndpoint} from '@indiekit/endpoint-micropub';
import {ShareEndpoint} from '@indiekit/endpoint-share';
import {SyndicateEndpoint} from '@indiekit/endpoint-syndicate';
import {authenticate} from '../lib/middleware/authentication.js';
import {indieauth} from '../lib/middleware/indieauth.js';
import {locales} from '../locales/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '..', 'package.json');
const package_ = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const mediaEndpoint = new MediaEndpoint();
const micropubEndpoint = new MicropubEndpoint();
const shareEndpoint = new ShareEndpoint();
const syndicateEndpoint = new SyndicateEndpoint();

const application = {
  endpoints: [
    mediaEndpoint,
    micropubEndpoint,
    shareEndpoint,
    syndicateEndpoint
  ],
  hasDatabase: false,
  locales,
  mongodbUrl: false,
  middleware: {
    authenticate,
    indieauth
  },
  name: 'Indiekit',
  navigationItems: [],
  repository: package_.repository,
  routes: [],
  themeColor: '#0055ee',
  themeColorScheme: 'automatic',
  version: package_.version,
  views: [
    path.join(__dirname, '..', 'views')
  ]
};

const publication = {
  categories: [],
  locale: 'en',
  jf2Feed: false,
  me: null,
  postTemplate: null,
  postTypes: [],
  preset: null,
  slugSeparator: '-',
  storeMessageTemplate: metaData => {
    return `${metaData.action} ${metaData.postType} ${metaData.fileType}`;
  },
  syndicationTargets: [],
  timeZone: 'UTC',
  tokenEndpoint: 'https://tokens.indieauth.com/token'
};

const server = {
  port: process.env.PORT || '3000'
};

export const defaultConfig = {application, publication, server};
