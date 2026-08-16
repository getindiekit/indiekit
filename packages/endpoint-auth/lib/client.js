import net from "node:net";

import { mf2 } from "microformats-parser";

const FETCH_TIMEOUT = 5000;

/**
 * Check whether a URL may be fetched when discovering client information
 *
 * A client identifier’s host name must be a domain name: IP addresses are not
 * permitted except loopback, and the authorization endpoint is told not to
 * fetch those. So no IP literal is worth fetching, which is why this refuses
 * them outright rather than sorting internal ranges from public ones.
 * @param {URL} url - URL to check
 * @returns {boolean} URL is safe to fetch
 * @see {@link https://indieauth.spec.indieweb.org/#client-identifier}
 * @see {@link https://indieauth.spec.indieweb.org/#client-information-discovery}
 */
const isFetchableOrigin = (url) => {
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return false;
  }

  const hostname = url.hostname.replaceAll(/^\[|]$/g, "").toLowerCase();

  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    return false;
  }

  // Any IP literal, loopback or not: none are valid client identifiers
  if (net.isIP(hostname) !== 0) {
    return false;
  }

  // Decimal, hexadecimal and octal encodings of an address (`2130706433`,
  // `0x7f000001`, `0177.0.0.1`) are resolved by the system resolver but are
  // not recognised by `net.isIP`, so they would otherwise pass as domain names
  if (
    /^\d+$/.test(hostname) ||
    /^0x[\da-f]+$/.test(hostname) ||
    /^[\d.]+$/.test(hostname)
  ) {
    return false;
  }

  // A domain name is trusted without resolving it, so one pointing at an
  // internal address still passes. The specification suggests resolving first
  // and rejecting the loopback range; doing that safely also means connecting
  // to the address that was checked, which needs a custom dispatcher.
  return true;
};

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
        if (Object.hasOwn(properties, [key][0])) {
          /**
           * @type {object|string} Image or string
           */
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
  let clientUrl;
  try {
    clientUrl = new URL(clientId);
  } catch {
    return { id: clientId, name: clientId, url: clientId };
  }

  const client = {
    id: clientId,
    name: clientUrl.host,
    url: clientUrl.href,
  };

  if (!isFetchableOrigin(clientUrl)) {
    return client;
  }

  let clientResponse;
  try {
    clientResponse = await fetch(clientId, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });
  } catch {
    // Unreachable, refused, TLS failure or timed out
    return client;
  }

  if (!clientResponse.ok) {
    // Use information derived from clientId
    return client;
  }

  const body = await clientResponse.text();

  try {
    // Use information from client JSON metadata
    return getClientMetadata(body, client);
  } catch {
    try {
      // Use information from client HTML microformats (deprecated)
      return getApplicationInformation(body, client);
    } catch {
      // Neither client metadata nor parseable HTML. `mf2()` throws on an empty
      // or non-HTML body, which would otherwise fail the whole authorization
      // request over a client that simply serves JSON
      return client;
    }
  }
};
