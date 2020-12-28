import HttpError from 'http-errors';
import {fileURLToPath} from 'url';
import path from 'path';
import {twitter} from './lib/twitter.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  checked: false
};

export const TwitterSyndicator = class {
  constructor(options = {}) {
    this.id = 'twitter';
    this.name = 'Twitter';
    this.options = {...defaults, ...options};
  }

  get assetsPath() {
    return path.join(__dirname, 'assets');
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
        photo: '/assets/twitter/icon.svg'
      },
      user: {
        name: user,
        url: `https://twitter.com/${user}`
      }
    };
  }

  get uid() {
    return this.info.uid;
  }

  async syndicate(postData) {
    if (!postData) {
      throw new Error('No post data given to syndicate');
    }

    try {
      // Construct syndicated URL
      const syndicatedUrl = await twitter(this.options).post(postData.properties);

      // Ruturn successful syndication message
      return {
        location: syndicatedUrl,
        status: 200,
        json: {
          success: 'syndicate',
          success_description: `Post syndicated to ${syndicatedUrl}`
        }
      };
    } catch (error) {
      throw new HttpError(error);
    }
  }
};
