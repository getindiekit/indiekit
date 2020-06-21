import expressSession from 'express-session';
import connectRedis from 'connect-redis';
import {databaseConfig} from './database.js';

const RedisSession = connectRedis(expressSession);

export const secret = process.env.SECRET;

export const session = indiekitConfig => {
  return expressSession({
    name: indiekitConfig.application.name,
    resave: false,
    saveUninitialized: false,
    secret,
    store: new RedisSession({
      client: databaseConfig.client
    })
  });
};
