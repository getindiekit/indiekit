const request = require('supertest');
const app = require('./server');

module.exports = request(app);
