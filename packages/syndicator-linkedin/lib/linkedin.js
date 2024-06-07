import makeDebug from "debug";
import { AuthClient, RestliClient } from "linkedin-api-client";

const debug = makeDebug(`indiekit-syndicator:linkedin`);

// TODO: introspecting the token could be useful to show the token expiration
// date somewhere in the Indiekit UI (maybe in the syndicator detail page).
export const introspectToken = async ({
  accessToken,
  clientId,
  clientSecret,
}) => {
  // https://github.com/linkedin-developers/linkedin-api-js-client?tab=readme-ov-file#authclient
  const client = new AuthClient({ clientId, clientSecret });

  debug(`try introspecting LinkedIn access token`);
  return await client.introspectAccessToken(accessToken);
};

export const userInfo = async ({ accessToken }) => {
  const client = new RestliClient();

  // The /v2/userinfo endpoint is unversioned and requires the `openid` OAuth scope
  const response = await client.get({
    accessToken,
    resourcePath: "/userinfo",
  });

  // https://stackoverflow.com/questions/59249318/how-to-get-linkedin-person-id-for-v2-api
  // https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/urns

  const id = response.data.sub;
  // debug(`user info %O`, response.data);

  return { id, name: response.data.name, urn: `urn:li:person:${id}` };
};

export const createPost = async ({
  accessToken,
  authorName,
  authorUrn,
  text,
  versionString,
}) => {
  const client = new RestliClient();
  // client.setDebugParams({ enabled: true });

  // https://stackoverflow.com/questions/59249318/how-to-get-linkedin-person-id-for-v2-api
  // https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/urns

  // Text share or create an article
  // https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
  // https://github.com/linkedin-developers/linkedin-api-js-client/blob/master/examples/create-posts.ts
  debug(
    `create post on behalf of author URN ${authorUrn} (${authorName}) using LinkedIn Posts API version ${versionString}`,
  );
  const response = await client.create({
    accessToken,
    resourcePath: "/posts",
    entity: {
      author: authorUrn,
      commentary: text,
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      visibility: "PUBLIC",
    },
    versionString,
  });

  // LinkedIn share URNs are different from LinkedIn activity URNs
  // https://stackoverflow.com/questions/51857232/what-is-the-distinction-between-share-and-activity-in-linkedin-v2-api
  // https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/urns

  return {
    url: `https://www.linkedin.com/feed/update/${response.createdEntityId}/`,
  };
};
