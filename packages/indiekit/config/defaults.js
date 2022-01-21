import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {MediaEndpoint} from '@indiekit/endpoint-media';
import {MicropubEndpoint} from '@indiekit/endpoint-micropub';
import {ShareEndpoint} from '@indiekit/endpoint-share';
import {SyndicateEndpoint} from '@indiekit/endpoint-syndicate';
import {authenticate} from '../lib/middleware/authentication.js';
import {indieauth} from '../lib/middleware/indieauth.js';
import {locales} from '../locales/index.js';

const mediaEndpoint = new MediaEndpoint();
const micropubEndpoint = new MicropubEndpoint();
const shareEndpoint = new ShareEndpoint();
const syndicateEndpoint = new SyndicateEndpoint();

export const defaultConfig = {
  application: {
    endpoints: [
      mediaEndpoint,
      micropubEndpoint,
      shareEndpoint,
      syndicateEndpoint,
    ],
    hasDatabase: false,
    locales,
    mongodbUrl: false,
    middleware: {
      authenticate,
      indieauth,
    },
    name: 'Indiekit',
    navigationItems: [],
    repository: process.env.npm_package_repository,
    routes: [],
    themeColor: '#0055ee',
    themeColorScheme: 'automatic',
    version: process.env.npm_package_version,
    views: [
      fileURLToPath(new URL('../views', import.meta.url)),
    ],
  },
  publication: {
    categories: [],
    locale: 'en',
    me: null,
    postTemplate: null,
    postTypes: [],
    preset: null,
    slugSeparator: '-',
    storeMessageTemplate: metaData => `${metaData.action} ${metaData.postType} ${metaData.fileType}`,
    syndicationTargets: [],
    timeZone: 'UTC',
    tokenEndpoint: 'https://tokens.indieauth.com/token',
  },
  server: {
    port: process.env.PORT || '3000',
  },
};
