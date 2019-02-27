const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');
const multer = require('multer');

const config = require(process.env.PWD + '/app/config');
const routes = require(process.env.PWD + '/app/routes');

const app = express();
const {port} = config;
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
app.use(express.static('static'));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

// Routes
app.use('/', routes);

app.listen(port, () => {
  console.info(`Starting ${config.name} on port ${port}`);
});

module.exports = app;
