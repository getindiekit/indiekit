import Debug from 'debug';
import HttpError from 'http-errors';
import {internetArchive} from './lib/internet-archive.js';

export const debug = new Debug('indiekit:syndicator-internet-archive');

const defaults = {
  name: 'Internet Archive',
  uid: 'https://web.archive.org/'
};

export const InternetArchiveSyndicator = class {
  constructor(options = {}) {
    this.id = 'internet-archive';
    this.name = 'Internet Archive';
    this.options = {...defaults, ...options};
  }

  get info() {
    return {
      name: this.options.name,
      uid: this.options.uid,
      service: {
        name: 'Internet Archive',
        url: 'https://web.archive.org/'
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
      // Make a capture request
      const {url} = postData.properties;
      debug(`Syndicating ${url} to the Internet Archive`);
      const capture = await internetArchive(this.options).capture(url);

      // Make a status request
      const {job_id} = capture;
      debug(`Capture of ${url} assigned to job ${job_id}`);
      const archive = await internetArchive(this.options).status(job_id);

      // Construct syndidated URL
      const {original_url, timestamp} = archive;
      const syndicatedUrl = `https://web.archive.org/web/${timestamp}/${original_url}`;

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
