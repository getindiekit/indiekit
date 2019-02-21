const templateDir = __basedir + '/app/templates';

module.exports = {
  name: 'IndieKit',
  port: process.env.PORT || 3000,
  cache: {
    dir: __basedir + '/.cache',
    'max-age': 86400
  },
  config: {
    path: process.env.CONFIG_PATH || 'indiekit.json',
    file: 'config.json'
  },
  defaults: {
    'post-types': [{
      article: {
        template: `${templateDir}/article.njk`,
        file: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: '{{ published | date(\'yyyy/MM\') }}/{{ slug }}'
      },
      note: {
        template: `${templateDir}/note.njk`,
        file: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'notes/{{ published | date(\'yyyy/MM\') }}/{{ slug }}'
      },
      photo: {
        template: `${templateDir}/photo.njk`,
        file: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'photos/{{ published | date(\'yyyy/MM\') }}/{{ slug }}'
      }
    }],
    'slug-separator': '_'
  },
  github: {
    user: process.env.GITHUB_USER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || 'master',
    token: process.env.GITHUB_TOKEN
  },
  indieauth: {
    'token-endpoint': process.env.TOKEN_ENDPOINT || 'https://tokens.indieauth.com/token'
  }
};
