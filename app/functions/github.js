const fetch = require('node-fetch');

const requestWithOptions = async function (args) {
  const url = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/contents/${args.path}`;
  const body = {
    path: null,
    message: 'Create an entry via micropub',
    branch: process.env.GITHUB_BRANCH || 'master',
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
      authorization: `token ${process.env.GITHUB_TOKEN}`,
      'User-Agent': 'IndieKit'
    },
    body: JSON.stringify(body)
  };

  if (args.method) {
    options.method = args.method;
  }

  return fetch(url, options);
};

exports.createFile = async function (path, content) {
  return requestWithOptions({
    path,
    content: Buffer.from(content).toString('base64')
  }).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw response;
  }).catch(error => {
    return {
      code: error.status,
      body: {
        error: 'create_github_file',
        error_description: error.statusText
      }
    };
  });
};
