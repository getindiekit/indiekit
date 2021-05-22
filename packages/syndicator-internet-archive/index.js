import Debug from 'debug';
import {fileURLToPath} from 'node:url';
import {internetArchive} from './lib/internet-archive.js';

export const debug = new Debug('indiekit:syndicator-internet-archive');

const defaults = {
  checked: false,
  name: 'Internet Archive',
  uid: 'https://web.archive.org/'
};

export const InternetArchiveSyndicator = class {
  constructor(options = {}) {
    this.id = 'internet-archive';
    this.name = 'Internet Archive';
    this.options = {...defaults, ...options};
  }

  get assetsPath() {
    return fileURLToPath(new URL('assets', import.meta.url));
  }

  get info() {
    return {
      checked: this.options.checked,
      name: this.options.name,
      uid: this.options.uid,
      service: {
        name: 'Internet Archive',
        url: 'https://web.archive.org/',
        photo: '/assets/internet-archive/icon.svg'
      }
    };
  }

  get uid() {
    return this.info.uid;
  }

  async syndicate(properties) {
    return internetArchive(this.options).save(properties);
  }
};
