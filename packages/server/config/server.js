import dotenv from 'dotenv';
dotenv.config();

import Redis from 'ioredis';

export const client = new Redis(process.env.REDIS_URL);
export const expires = 3600;
export const port = process.env.PORT || 3000;
