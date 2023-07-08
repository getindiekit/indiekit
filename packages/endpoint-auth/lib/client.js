import { mf2 } from "microformats-parser";

/**
 * Get client information
 * @param {string} client_id - Client URL
 * @returns {Promise<object>} Information about the client
 */
export const getClientInformation = async (client_id) => {
  const hostname = new URL(client_id).host;

  const clientResponse = await fetch(client_id);
  if (!clientResponse.ok) {
    return {
      name: hostname,
      url: client_id,
    };
  }

  const body = await clientResponse.text();

  const { items } = mf2(body, { baseUrl: client_id });

  for (const item of items) {
    if (item.type.includes("h-app") || item.type.includes("h-x-app")) {
      const { logo, name, url } = item.properties;

      return {
        ...(logo && { logo: logo[0]?.value || logo[0] }),
        name: name[0] || hostname,
        url: (url && url[0]) || client_id,
      };
    }
  }
};
