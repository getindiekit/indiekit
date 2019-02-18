const fetch = require('node-fetch');

const appConfig = require(__basedir + '/app/config.js');
const utils = require(__basedir + '/app/functions/utils');

const requestWithOptions = async function (args) {
  const url = `https://api.github.com/repos/${appConfig.github.user}/${appConfig.github.repo}/contents/${args.path}`;
  const body = {
    path: null,
    message: null,
    branch: appConfig.github.branch,
    content: null
  };

  if (args.path) {
    body.path = args.path;
  }

  if (args.content) {
    body.content = args.content;
  }

  if (args.message) {
    body.message = args.message;
  }

  if (args.sha) {
    body.sha = args.sha;
  }

  const options = {
    method: 'put',
    headers: {
      'content-type': 'application/json',
      authorization: `token ${appConfig.github.token}`,
      'User-Agent': `${appConfig.name}`
    },
    body: JSON.stringify(body)
  };

  if (args.method) {
    options.method = args.method;
  }

  return fetch(url, options);
};

exports.createFile = async function (path, content, postType) {
  return requestWithOptions({
    path,
    content: Buffer.from(content).toString('base64'),
    message: `:robot: New ${postType} created via ${appConfig.name}`
  }).then(response => {
    return response.json();
  }).then(json => {
    return json;
  }).catch(error => {
    console.error(error);
  });
};
