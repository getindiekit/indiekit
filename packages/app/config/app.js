import Redis from 'ioredis';

export const client = new Redis(process.env.REDIS_URL);
export const expires = 3600;
