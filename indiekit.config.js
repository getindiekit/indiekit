import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {Indiekit} from './packages/indiekit/index.js';
import {GithubStore} from './packages/store-github/index.js';

// New indiekit instance
const indiekit = new Indiekit();

// Configure content store
const githubStore = new GithubStore({
  user: process.env.GITHUB_USER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH,
  token: process.env.GITHUB_TOKEN
});

// Publication settings
indiekit.set('publication.me', process.env.PUBLICATION_URL);
indiekit.set('publication.storeId', 'github');
indiekit.set('publication.configPresetId', 'jekyll');
indiekit.set('publication.config.categories', {
  url: 'https://paulrobertlloyd.com/categories/index.json'
});

indiekit.set('publication.config.post-types', [{
  type: 'note',
  name: 'Note (Config)',
  // TODO: User configured template locations
  // template: 'etc/templates/note.njk',
  post: {
    path: '_notes/{{ published | date(\'X\') }}.md',
    url: 'notes/{{ published | date(\'X\') }}'
  }
}, {
  type: 'photo',
  name: 'Photo (Config)',
  post: {
    path: '_photos/{{ published | date(\'X\') }}.md',
    url: '_photos/{{ published | date(\'X\') }}'
  },
  media: {
    path: 'src/media/photos/{{ filedate | date(\'X\') }}.{{ fileext }}',
    url: 'media/photos/{{ filedate | date(\'X\') }}.{{ fileext }}'
  }
}, {
  type: 'reply',
  name: 'Reply (Config)',
  post: {
    path: '_replies/{{ published | date(\'X\') }}.md',
    url: 'replies/{{ published | date(\'X\') }}'
  }
}]);

// Register extensions
indiekit.addStore(githubStore);

// Server
const server = indiekit.server();

export default server;
