import makeDebug from "debug";
import express from "express";
import { AuthorizationCode } from "simple-oauth2";

const debug = makeDebug(`indiekit:endpoint-linkedin:index`);

const DEFAULTS = {
  callbackUrl: undefined,
  // Client ID and Client Secret of the LinkedIn OAuth app you are using for
  // publishing on your LinkedIn account.
  // This LinkedIn OAuth app could be the official Indiekit app or a custom one.
  // TODO:
  // 1. create a LinkedIn page for Indiekit
  // 2. create a Linkedin OAuth app
  // 3. associate the Linkedin OAuth app to the LinkedIn page
  // 4. submit the Linkedin OAuth app for verification
  clientId: undefined,
  clientSecret: undefined,
  mountPath: "/oauth/linkedin",
  // OAuth 2.0 scopes. When making requests to the LinkedIn APIs, scopes must be
  // URL-encoded and space-delimited
  // https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?tabs=HTTPS1
  scopes: ["openid", "profile", "w_member_social"],
};

const AUTH = {
  authorizeHost: "https://www.linkedin.com",
  authorizePath: "/oauth/v2/authorization",
  tokenHost: "https://www.linkedin.com",
  tokenPath: "/oauth/v2/accessToken",
};

const persistTokens = async ({ access_token, id_token }) => {
  // store the tokens somewhere, maybe in an environment variable, in a database, etc
  process.env.LINKEDIN_ACCESS_TOKEN = access_token;
  debug(
    `LinkedIn access token persisted in environment variable LINKEDIN_ACCESS_TOKEN`,
  );
  process.env.LINKEDIN_ID_TOKEN = id_token;
  debug(
    `LinkedIn ID token persisted in environment variable LINKEDIN_ID_TOKEN`,
  );
};

const ROUTER_OPTIONS = { caseSensitive: true, mergeParams: true };
debug(`instantiate Express router with these options %O`, ROUTER_OPTIONS);
const router = express.Router(ROUTER_OPTIONS);

export default class LinkedInEndpoint {
  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.callbackUrl] - URL that LinkedIn will redirect to after the user grants or denies permission
   * @param {string} [options.clientId] - LinkedIn OAuth app Client ID
   * @param {string} [options.clientSecret] - LinkedIn OAuth app Client Secret
   * @param {string} [options.mountPath] - Path where to mount the routes defined in this plugin
   * @param {Array.<string>} [options.scopes] - OAuth 2.0 scopes
   */
  constructor(options = {}) {
    this.name = "LinkedIn endpoint";
    this.options = { ...DEFAULTS, ...options };
    debug(
      `${this.name} configuration (defaults + user-provided options) %O`,
      this.options,
    );

    this.mountPath = this.options.mountPath;

    if (!this.options.clientId) {
      throw new Error(`LinkedIn OAuth app clientId not set`);
    }
    if (!this.options.clientSecret) {
      throw new Error(`LinkedIn OAuth app clientSecret not set`);
    }
    if (!this.options.callbackUrl) {
      throw new Error(`LinkedIn OAuth app callbackUrl not set`);
    }

    // https://github.com/lelylan/simple-oauth2/blob/master/example/linkedin.js
    this.oauthClient = new AuthorizationCode({
      client: {
        id: this.options.clientId,
        secret: this.options.clientSecret,
      },
      options: {
        authorizationMethod: "body",
      },
      auth: AUTH,
    });

    const state = "random123"; // TODO: how to generate this?

    const qs = [
      `response_type=code`,
      `client_id=${this.options.clientId}`,
      `redirect_uri=${encodeURIComponent(this.options.callbackUrl)}`,
      `scope=${encodeURIComponent(this.options.scopes.join(" "))}`,
      `state=${state}`,
    ].join("&");
    this.authorizationUri = `${AUTH.authorizeHost}${AUTH.authorizePath}?${qs}`;

    // This doesn't work. It doesn't encode the OAuth scopes correctly.
    //   this.authorizationUri = this.oauthClient.authorizeURL({
    //     redirect_uri,
    //     scope,
    //     state,
    //   });
  }

  get routes() {
    router.get(`/`, async (request, response) => {
      debug(`GET ${this.mountPath}${request.path}`);
      const linkOAuthFlowPath = `${this.mountPath}/start`;

      const viewName = `authorize-linkedin-app`;
      debug(`render view ${viewName}`);

      return response.render(viewName, {
        back: {
          href: "/",
        },
        linkOAuthFlow: {
          href: linkOAuthFlowPath,
          text: "Start OAuth 2.0 Authorization Code Flow (3-legged OAuth)",
        },
        links: [
          {
            href: "https://www.linkedin.com/developers/tools/oauth",
            text: "LinkedIn OAuth 2.0 tools",
          },
          {
            href: "https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api",
            text: "LinkedIn Posts API",
          },
        ],
        title: "Authorize Indiekit to post on LinkedIn",
      });
    });

    router.get("/start", (request, response) => {
      debug(`GET ${this.mountPath}${request.path}`);

      debug(`redirect to ${this.authorizationUri}`);
      response.redirect(this.authorizationUri);
    });

    // https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?tabs=HTTPS1#member-approves-request
    router.get("/callback", async (request, response) => {
      debug(`GET ${this.mountPath}${request.path}`);

      const { code, error, error_description, state } = request.query;
      if (error) {
        // TODO: display error page
        return response.status(400).json({ error, error_description });
      }

      debug(`state received from LinkedIn: ${state}`);
      // TODO: should we check that `state` is the same as the one we sent in
      // the initial request?

      const parameters = {
        code,
        redirect_uri: this.options.callbackUrl,
        scope: encodeURIComponent(this.options.scopes.join(" ")),
      };

      try {
        debug(
          `exchange the authorization code received from LinkedIn for an access token that has these OAuth 2.0 scopes: ${this.options.scopes.join(", ")}`,
        );
        // The checkJs property in jsconfig.json is set to true, so it type-checks
        // all JS files in this project. Here it is complaining that `code` might
        // not be a string. But it is, so we ignore the error.
        // @ts-ignore
        const accessToken = await this.oauthClient.getToken(parameters);
        // @ts-ignore
        await persistTokens(accessToken.token);
        // TODO: redirect to success page
        debug(`TODO: redirect to success page`);
        return response.status(200).json(accessToken);
      } catch (error) {
        // TODO: display error page
        debug("could not obtain access token from LinkedIn %O", error);
        return response.status(401).json({ message: "Authentication failed" });
      }
    });

    return router;
  }

  // use routesPublic for unprotected routes
  // get routesPublic() {
  //   return router;
  // }

  init(Indiekit) {
    debug(`${this.name} init`);
    Indiekit.addEndpoint(this);
  }
}
