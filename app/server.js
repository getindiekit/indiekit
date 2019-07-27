const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const nunjucks = require('nunjucks');

const logger = require(process.env.PWD + '/app/logger');
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

app.set('view engine', 'njk');
app.locals.app = config;
(async () => {
  app.locals.pub = await publication.resolveConfig(config['pub-config']);
})();

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
      message: 'Not Found',
      error: 'The requested resource could not be found.'
    });
  }
});

// Errors
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const {message} = error;

  logger.error(`${status}: ${message}. ${req.method} ${req.originalUrl}`);

  // Set locals, only providing error in development
  if (req.accepts('html')) {
    res.render('error', {
      status,
      message,
      error
    });
  }

  res.status(status);
  res.send(`${status}: ${message}. ${error}`);

  next();
});

// Correct reporting of secure connections
app.enable('trust proxy');

app.listen(port, function () {
  logger.info(`Starting ${config.name} on port ${this.address().port}`);
});

module.exports = app;
