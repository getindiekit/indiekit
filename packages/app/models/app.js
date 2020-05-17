import fs from 'fs';
import {client} from '../config/app.js';

export const get = async key => {
  const app = await getAll();
  return app[key];
};

export const getAll = async () => {
  const app = await client.hgetall('app');
  const pkg = JSON.parse(fs.readFileSync('package.json'));

  return {
    name: app.name || 'IndieKit',
    version: pkg.version,
    description: pkg.description,
    repository: pkg.repository,
    locale: app.locale || 'en',
    themeColor: app.themeColor || '#0000ee',
    defaultConfigType: app.defaultConfigType || 'jekyll',
    customConfigUrl: app.customConfigUrl || false
  };
};

export const set = async (key, value) => {
  client.hset('app', key, value);
};

export const setAll = async values => {
  client.hmset('app', values);
};
