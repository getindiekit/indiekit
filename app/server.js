const path = require('path');
const _ = require('lodash');
const express = require('express');
const favicon = require('serve-favicon');
const nunjucks = require('nunjucks');

const logger = require(process.env.PWD + '/app/logger');
const config = require(process.env.PWD + '/app/config');
const routes = require(process.env.PWD + '/app/routes');
const publication = require(process.env.PWD + '/lib/publication');

const app = express();
const {port} = config;

// Parse Nunjucks templates
nunjucks.configure(['./app/views', './app/static'], {
  autoescape: true,
  express: app,
  watch: true
});

// Correct reporting of secure connections
app.enable('trust proxy');

app.set('view engine', 'njk');

// Save application and publication configuration to locals
app.use(async (req, res, next) => {
  let pubConfig;
  if (config.pub.config) {
    pubConfig = await publication.getFiles(config.pub.config).catch(error => {
      next(error);
    });
    pubConfig = JSON.parse(pubConfig);
  }

  app.locals.pub = await publication.resolveConfig(pubConfig);
  app.locals.pub.url = config.pub.url;

  app.locals.app = config;
  app.locals.app.url = `${req.protocol}://${req.headers.host}`;
  next();
});

// Parse application/json
app.use(express.json({
  limit: '10mb'
}));

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Static files and paths
app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

// Log requests
app.use((req, res, done) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query
  });
  done();
});

// Routes
app.use('/', routes);

// 404
app.use((req, res) => {
  res.status(404);

  if (req.accepts('text/html')) {
    res.render('error', {
      status: 404,
      error: 'Not Found',
      error_description: 'The requested resource could not be found.'
    });
  }
});

// Errors
app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = error.message.status || 500;
  const {message} = error;

  res.status(status);

  if (req.accepts('text/html')) {
    return res.render('error', {
      status,
      error: _.startCase(message.error),
      error_description: _.upperFirst(message.error_description),
      error_uri: message.error_uri
    });
  }

  if (req.accepts('application/json')) {
    return res.json({
      error: _.snakeCase(message.error),
      error_description: _.lowerFirst(message.error_description),
      error_uri: message.error_uri
    });
  }
});

app.listen(port, function () {
  logger.info(`Starting ${config.name} on port ${this.address().port}`);
});

module.exports = app;
