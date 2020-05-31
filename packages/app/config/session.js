import expressSession from 'express-session';
import connectRedis from 'connect-redis';
import {client} from './database.js';

const RedisSession = connectRedis(expressSession);

export const secret = process.env.SECRET;
export const session = expressSession({
  name: 'indiekit',
  resave: false,
  saveUninitialized: false,
  secret,
  store: new RedisSession({client})
});
