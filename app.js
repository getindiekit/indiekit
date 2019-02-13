global.__basedir = __dirname;

console.log(__basedir);

const bodyParser = require('body-parser');
const express = require('express');

const routes = require(__basedir + '/app/routes');

const app = express();
const port = process.env.PORT || 3000;

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
