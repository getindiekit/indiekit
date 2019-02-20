global.__basedir = __dirname;
require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const appConfig = require(__basedir + '/app/config');
const cache = require(__basedir + '/app/functions/cache');
const routes = require(__basedir + '/app/routes');

const app = express();
const {port} = appConfig;

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  cache.clearCache(appConfig.cache.dir);
});

module.exports = app;
