global.__basedir = __dirname;
require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');
const multer = require('multer');

const appConfig = require(__basedir + '/app/config');
const routes = require(__basedir + '/app/routes');

const app = express();
const {port} = appConfig;
const storage = multer.memoryStorage();
const upload = multer({storage});

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// Parse multipart/form-data
app.use(upload.any());

// Static files
app.use(express.static('www'));
app.use(favicon(path.join(__dirname, 'www', 'favicon.ico')));

// Routes
app.use('/', routes);

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});

module.exports = app;
