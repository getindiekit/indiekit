import {fileURLToPath} from 'node:url';
import {twitter} from './lib/twitter.js';

const defaults = {
  checked: false,
};

export const TwitterSyndicator = class {
  constructor(options = {}) {
    this.id = 'twitter';
    this.name = 'Twitter';
    this.options = {...defaults, ...options};
  }

  get assetsPath() {
    return fileURLToPath(new URL('assets', import.meta.url));
  }

  get info() {
    const {checked, user} = this.options;

    return {
      checked,
      name: `${user} on Twitter`,
      uid: `https://twitter.com/${user}`,
      service: {
        name: 'Twitter',
        url: 'https://twitter.com/',
        photo: '/assets/twitter/icon.svg',
      },
      user: {
        name: user,
        url: `https://twitter.com/${user}`,
      },
    };
  }

  get uid() {
    return this.info.uid;
  }

  async syndicate(properties, publication) {
    return twitter(this.options).post(properties, publication);
  }
};
