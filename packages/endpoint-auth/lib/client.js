import { fetch } from "undici";
import { mf2 } from "microformats-parser";

/**
 * Get client information
 * @param {string} client_id - Client URL
 * @returns {object} Information about the client
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

  const { items } = mf2(body, { baseUrl: client_id });

  for (const item of items) {
    if (item.type.includes("h-app") || item.type.includes("h-x-app")) {
      const { logo, name, url } = item.properties;

      client = {
        ...client,
        ...(logo && { logo: logo[0]?.value || logo[0] }),
        ...(name && { name: name[0] }),
        ...(url && { url: url[0] }),
      };
    }
  }

  return client;
};
