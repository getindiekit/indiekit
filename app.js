global.__basedir = __dirname;
require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const appConfig = require(__basedir + '/app/config.js');
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
});

module.exports = app;
