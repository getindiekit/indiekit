import { mf2 } from "microformats-parser";

/**
 * Get client information
 * @param {string} client_id - Client URL
 * @returns {Promise<object>} Information about the client
 * @see {@link https://indieauth.spec.indieweb.org/#client-information-discovery}
 */
export const getClientInformation = async (client_id) => {
  let client = {
    name: new URL(client_id).host,
    url: client_id,
  };

  const clientResponse = await fetch(client_id);
  if (!clientResponse.ok) {
    return client;
  }

  const body = await clientResponse.text();

  // If response contains microformats, use available derived values
  const { items } = mf2(body, { baseUrl: client_id });
  for (const item of items) {
    const { properties, type } = item;

    if (/^h-(?:x-)?app$/.test(type[0])) {
      // If no URL property, use `client_id`
      if (!properties.url) {
        properties.url = [client_id];
      }

      // If has URL property, only continue if matches `client_id`
      if (!properties.url?.includes(client_id)) {
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
