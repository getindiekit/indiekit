const path = require('path');
const _ = require('lodash');
const express = require('express');
const favicon = require('serve-favicon');
const nunjucks = require('nunjucks');

const logger = require(process.env.PWD + '/app/logger');
const cache = require(process.env.PWD + '/app/lib/cache');
const config = require(process.env.PWD + '/app/config');
const routes = require(process.env.PWD + '/app/routes');
const publication = require(process.env.PWD + '/app/lib/publication');

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

// Save publication configuration to locals
(async () => {
  let pubConfig = null;
  if (config.pub.config) {
    pubConfig = await cache.read(config.pub.config, 'config.json');
    pubConfig = JSON.parse(pubConfig);
  }

  app.locals.pub = await publication.resolveConfig(pubConfig);
  app.locals.pub.url = config.pub.url;
})();

// Save application configuration to locals
app.use((req, res, next) => {
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

  if (req.accepts('html')) {
    res.render('error', {
      status: 404,
      message: {
        error: 'Not Found',
        error_description: 'The requested resource could not be found.'
      }
    });
  }
});

// Errors
app.use((error, req, res, next) => {
  const status = error.message.status || 500;
  const {message} = error;

  res.status(status);

  if (req.accepts('text/html')) {
    return res.render('error', {
      status,
      error: _.startCase(message.error),
      description: _.upperFirst(message.error_description)
    });
  }

  if (req.accepts('application/json')) {
    return res.json({
      error: _.snakeCase(message.error),
      error_description: _.lowerFirst(message.error_description)
    });
  }

  res.send(`${status}: ${message.error}. ${message.error_description}`);

  return next();
});

app.listen(port, function () {
  logger.info(`Starting ${config.name} on port ${this.address().port}`);
});

module.exports = app;
