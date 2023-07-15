import { mf2 } from "microformats-parser";

/**
 * Get client information
 * @param {string} client_id - Client URL
 * @returns {Promise<object>} Information about the client
 */
export const getClientInformation = async (client_id) => {
  const client = {
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
    if (item.type.includes("h-x-app") || item.type.includes("h-app")) {
      const { logo, name } = item.properties;

      return {
        ...client,
        ...(logo && { logo: logo[0]?.value || logo[0] }),
        ...(name && { name: name[0] }),
      };
    }
  }
  return client;
};
