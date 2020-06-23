import fs from 'fs';
import {JekyllConfig} from '@indiekit/config-jekyll';
import {MicropubEndpoint} from '@indiekit/endpoint-micropub';

const jekyllConfig = new JekyllConfig();
const micropubEndpoint = new MicropubEndpoint();
const package_ = JSON.parse(fs.readFileSync('package.json', 'utf8'));

export const defaultConfig = {
  application: {
    name: 'Indiekit',
    locale: 'en',
    themeColor: '#0000ee',
    repository: package_.repository,
    version: package_.version,
    configs: [jekyllConfig],
    endpoints: [micropubEndpoint],
    stores: []
  },
  publication: {
    config: {},
    configPresetId: 'jekyll',
    locale: 'en-GB',
    me: null,
    storeId: null,
    timezone: 'UTC'
  },
  server: {
    port: process.env.PORT || '3000'
  }
};
