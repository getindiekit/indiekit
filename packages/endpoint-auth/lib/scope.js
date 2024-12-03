export const scopes = {
  // IndieAuth scopes
  email: { supported: false },
  profile: { supported: false },
  // Micropub scopes
  create: { supported: true },
  draft: { supported: true },
  update: { supported: true },
  delete: { supported: true },
  media: { supported: true },
  // Microsub scopes
  read: { supported: true },
  follow: { supported: true },
  mute: { supported: true },
  block: { supported: true },
  channels: { supported: true },
};

export const supportedScopes = Object.entries(scopes)
  .filter(([, value]) => value.supported)
  .map(([key]) => key);

/**
 * Get `items` object for checkboxes component
 * @param {Array|string} scope - Selected scope(s)
 * @param {import("express").Response} response - Response
 * @returns {object|undefined} Items for checkboxes component
 */
export function getScopeItems(scope, response) {
  if (!scope) {
    return;
  }

  const localisedScopes = Object.keys(scopes);
  const requestedScopes = typeof scope === "string" ? scope.split(" ") : scope;

  return requestedScopes.map((value) => ({
    label: localisedScopes.includes(value)
      ? response.locals.__(`scope.${value}.label`)
      : value,
    checked: supportedScopes.includes(value) && requestedScopes.includes(value),
    ...(!supportedScopes.includes(value) && {
      disabled: true,
      hint: response.locals.__("scope.notSupported.hint"),
    }),
    value,
  }));
}
