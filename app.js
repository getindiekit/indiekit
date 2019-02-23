global.__basedir = __dirname;
require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');

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

// Static files
app.use(express.static('www'));
app.use(favicon(path.join(__dirname, 'www', 'favicon.ico')));

// Routes
app.use('/', routes);

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
  cache.clear(appConfig.cache.dir);
});

module.exports = app;
