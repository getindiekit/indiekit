import {client} from '../config/db.js';

export const get = async key => {
  const settings = await getAll();
  return settings[key];
};

export const getAll = async () => {
  const settings = await client.hgetall('settings');
  return settings;
};

export const set = async (key, value) => {
  client.hset('settings', key, value);
};

export const setAll = async values => {
  client.hmset('settings', values);
};
