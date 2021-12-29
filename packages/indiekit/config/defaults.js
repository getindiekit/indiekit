import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';

dotenv.config();

const require = createRequire(import.meta.url);
const package_ = require('../package.json');

const mongodbUrl = (process.env.NODE_ENV === 'production')
  ? process.env.MONGODB_URL
  : false;

export const defaultConfig = {
  application: {
    hasDatabase: false,
    installedPlugins: [],
    localesAvailable: ['de', 'en', 'fr', 'nl', 'pt'],
    mongodbUrl,
    name: 'Indiekit',
    navigationItems: [],
    repository: package_.repository,
    routes: [],
    themeColor: '#0055ee',
    themeColorScheme: 'automatic',
    version: package_.version,
    views: [
      fileURLToPath(new URL('../views', import.meta.url)),
    ],
  },
  plugins: [
    '@indiekit/endpoint-media',
    '@indiekit/endpoint-micropub',
    '@indiekit/endpoint-share',
    '@indiekit/endpoint-syndicate',
  ],
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

defaultConfig.application.sessionMiddleware = cookieSession({
  name: defaultConfig.application.name,
  secret: crypto.randomBytes(16),
});
