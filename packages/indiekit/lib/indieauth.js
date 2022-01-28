import crypto from 'node:crypto';
import got from 'got';
import HttpError from 'http-errors';
import {
  decrypt,
  encrypt,
  getRelationshipsFromUrl,
  randomString,
} from './utils.js';

const iv = crypto.randomBytes(16);

const defaultOptions = {
  me: '',
  authEndpoint: '',
  tokenEndpoint: '',
};

export const IndieAuth = class {
  constructor(options = {}) {
    this.codeVerifier = randomString(100);
    this.options = {...defaultOptions, ...options};
  }

  /**
   * Check if the given options are set
   *
   * @param {Array} requirements An array of option keys to check
   * @returns {object} Object with boolean pass property and array missing
   * property listing missing options
   */
  checkRequiredOptions(requirements) {
    const missing = [];
    let pass = true;
    for (const optionName of requirements) {
      const option = this.options[optionName];
      if (!option) {
        pass = false;
        missing.push(optionName);
      }
    }

    if (!pass) {
      throw new Error('Missing required options: ' + missing.join(', '));
    }

    return true;
  }

  /**
   * Exchange authorization code for an access token
   *
   * @param {string} code Code received from authentication endpoint
   * @returns {Promise|object} Access token
   */
  async authorizationCodeGrant(code) {
    this.checkRequiredOptions([
      'clientId',
      'redirectUri',
      'tokenEndpoint',
    ]);

    try {
      const parameters = {
        client_id: this.options.clientId,
        code,
        code_verifier: this.codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: this.options.redirectUri,
      };

      const {body} = await got.post(this.options.tokenEndpoint, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
          accept: 'application/json, application/x-www-form-urlencoded',
        },
        responseType: 'json',
        searchParams: parameters,
      });

      if (body.error_description) {
        throw new Error(body.error_description);
      } else if (body.error) {
        throw new Error(body.error);
      }

      if (!body.scope || !body.access_token) {
        throw new Error('The token endpoint did not return the expected parameters');
      }

      return body.access_token;
    } catch (error) {
      const message = error.response
        ? error.response.body.error_description
        : 'Error requesting token endpoint';
      throw new HttpError(error.response.statusCode, message);
    }
  }

  /**
   * Get authentication URL
   *
   * @param {string} scope Authorisation scope
   * @returns {Promise|string} Authentication URL
   */
  async getAuthUrl(scope) {
    this.checkRequiredOptions(['me', 'clientId']);

    if (!scope) {
      throw new Error('You need to provide some scopes');
    }

    if (!this.options.state) {
      this.options.state = this.generateState();
    }

    try {
      const relationships = await getRelationshipsFromUrl(this.options.me);

      if (!relationships.authorization_endpoint) {
        throw new Error('No authorization endpoint found');
      }

      this.options.authEndpoint = relationships.authorization_endpoint;

      if (relationships.token_endpoint) {
        this.options.tokenEndpoint = relationships.token_endpoint;
      }

      this.checkRequiredOptions([
        'me',
        'state',
        'clientId',
        'redirectUri',
        'authEndpoint',
      ]);

      // PKCE code challenge
      const base64Digest = crypto.createHash('sha256').update(this.codeVerifier).digest('base64');
      const codeChallenge = base64Digest.toString('base64url');

      const authUrl = new URL(this.options.authEndpoint);
      authUrl.searchParams.append('client_id', this.options.clientId);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('me', this.options.me);
      authUrl.searchParams.append('redirect_uri', this.options.redirectUri);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', scope);
      authUrl.searchParams.append('state', this.options.state);

      return authUrl.toString();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Generate unique encrypted state value
   *
   * @returns {string} State
   */
  generateState() {
    this.checkRequiredOptions(['clientId']);
    let state = {
      clientId: this.options.clientId,
      date: Date.now(),
    };
    state = encrypt(JSON.stringify(state), iv);

    return state;
  }

  /**
   * Validate state value generated using `generateState` method
   *
   * @param {string} state State
   * @returns {object|boolean} Validated state object, returns false on failure
   */
  validateState(state) {
    this.checkRequiredOptions(['clientId']);
    state = JSON.parse(decrypt(state, iv));

    if (
      state.clientId === this.options.clientId
      && state.date > Date.now() - (1000 * 60 * 10)
    ) {
      return state;
    }

    throw new Error('State is invalid');
  }
};
