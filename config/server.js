require('dotenv').config();
const Redis = require('ioredis');

module.exports = {
  client: new Redis(process.env.REDIS_URL),
  expires: 3600,
  port: process.env.PORT || 3000
};
