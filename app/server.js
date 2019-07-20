const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');
const multer = require('multer');
const nunjucks = require('nunjucks');

const logger = require(process.env.PWD + '/app/logger');
const config = require(process.env.PWD + '/app/config');
const routes = require(process.env.PWD + '/app/routes');

const app = express();
const {port} = config;
const storage = multer.memoryStorage();
const upload = multer({storage});

// Parse Nunjucks templates
nunjucks.configure(['./app/views', './app/static'], {
  autoescape: true,
  express: app,
  watch: true
});

app.set('view engine', 'njk');

// Parse application/json
app.use(bodyParser.json({
  limit: '10mb'
}));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Parse multipart/form-data
app.use(upload.any());

// Static files and paths
app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

// Routes
app.use('/', routes);

// 404
app.use((request, response) => {
  response.status(404);

  if (request.accepts('html')) {
    response.locals.status = 404;
    response.locals.message = 'Not Found';
    response.locals.error = 'The requested resource could not be found.';
    response.render('error', config);
  }
});

// Errors
app.use((error, request, response, next) => {
  const status = error.status || 500;
  const {message} = error;

  logger.error(`${status}: ${message}. ${request.method} ${request.originalUrl}`);

  // Set locals, only providing error in development
  if (request.accepts('html')) {
    response.locals.status = status;
    response.locals.message = message;
    response.locals.error = error;
    response.render('error', config);
  }

  response.status(status);
  response.send(`${status}: ${message}. ${error}`);

  next();
});

// Correct reporting of secure connections
app.enable('trust proxy');

app.listen(port, function () {
  logger.info(`Starting ${config.name} on port ${this.address().port}`);
});

module.exports = app;
