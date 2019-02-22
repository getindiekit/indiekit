const templateDir = __basedir + '/app/templates';

module.exports = {
  name: 'IndieKit',
  port: process.env.PORT || 3000,
  cache: {
    dir: __basedir + '/.cache',
    'max-age': process.env.INDIEKIT_CACHE_EXPIRES || 86400
  },
  config: {
    path: process.env.INDIEKIT_CONFIG_PATH || 'indiekit.json',
    file: 'config.json'
  },
  defaults: {
    'post-types': [{
      article: {
        template: `${templateDir}/article.njk`,
        file: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: '{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      },
      note: {
        template: `${templateDir}/note.njk`,
        file: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      },
      photo: {
        template: `${templateDir}/photo.njk`,
        file: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    }],
    'slug-separator': '-'
  },
  github: {
    user: process.env.INDIEKIT_GITHUB_USER,
    repo: process.env.INDIEKIT_GITHUB_REPO,
    branch: process.env.INDIEKIT_GITHUB_BRANCH || 'master',
    token: process.env.INDIEKIT_GITHUB_TOKEN
  },
  indieauth: {
    'token-endpoint': process.env.TOKEN_ENDPOINT || 'https://tokens.indieauth.com/token'
  }
};
