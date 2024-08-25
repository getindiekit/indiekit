import { mf2 } from "microformats-parser";

/**
 * Get client information from application Microformat
 * @param {string} body - Response body
 * @param {object} client - Fallback client information
 * @returns {object} Client information
 * @deprecated since 11 July 2024
 * @see {@link https://indieauth.spec.indieweb.org/20220212/#application-information}
 */
export const getApplicationInformation = (body, client) => {
  const { items } = mf2(body, { baseUrl: client.url });
  for (const item of items) {
    const { properties, type } = item;

    if (/^h-(?:x-)?app$/.test(type[0])) {
      // If no URL property, use baseUrl
      if (!properties.url) {
        properties.url = [client.url];
      }

      // Check that URL property matches `client_id`. Note that this isn’t for
      // authentication, but to ensure only relevant client metadata is returned
      if (!properties.url?.includes(client.url)) {
        continue;
      }

      const keys = ["logo", "name", "url"];
      for (const key of keys) {
        if (properties[key] && properties[key][0]) {
          /** @type {object|string} Image or string */
          const property = properties[key][0];
          client[key] = property.value || property;
        }
      }
    }
  }

  return client;
};

/**
 * Get client information from client metadata
 * @param {string} body - Response body
 * @param {object} client - Fallback client information
 * @returns {object} Client information
 * @see {@link https://indieauth.spec.indieweb.org/#client-metadata}
 */
export const getClientMetadata = (body, client) => {
  const json = JSON.parse(body);

  // Client metadata MUST include `client_id`
  if (!Object.hasOwn(json, "client_id")) {
    throw new Error("Client metadata JSON not valid");
  }

  return {
    ...client,
    logo: json.logo_uri,
    name: json.client_name || client.name,
    url: json.client_uri || client.url,
  };
};

/**
 * Get client information
 * @param {string} clientId - Client ID
 * @returns {Promise<object>} Information about the client
 * @see {@link https://indieauth.spec.indieweb.org/#client-information-discovery}
 */
export const getClientInformation = async (clientId) => {
  let client = {
    id: clientId,
    name: new URL(clientId).host,
    url: new URL(clientId).href,
  };

  const clientResponse = await fetch(clientId);
  if (!clientResponse.ok) {
    // Use information derived from clientId
    return client;
  }

  const body = await clientResponse.text();

  try {
    // Use information from client JSON metadata
    return getClientMetadata(body, client);
  } catch {
    // Use information from client HTML microformats (deprecated)
    return getApplicationInformation(body, client);
  }
};
