import { mf2 } from "microformats-parser";

import { isFetchableOrigin } from "./client.js";

const FETCH_TIMEOUT = 5000;

/**
 * Get first value of a microformats property, as a string
 * @param {MicroformatProperty[]} [values] - Property values
 * @returns {string|undefined} Value
 */
const getValue = (values) => {
  const value = values?.[0];
  if (typeof value === "object") {
    return typeof value.value === "string" ? value.value : undefined;
  }

  return value;
};

/**
 * Discover profile information from the representative h-card on a user’s
 * site, preferring an h-card whose URL is the profile URL
 * @param {string} me - Profile URL
 * @returns {Promise<IndieAuthProfile>} Discovered profile information
 * @see {@link https://microformats.org/wiki/representative-h-card-parsing}
 */
const discoverProfile = async (me) => {
  if (!URL.canParse(me) || !isFetchableOrigin(new URL(me))) {
    return {};
  }

  let body;
  try {
    const response = await fetch(me, {
      headers: { accept: "text/html" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      return {};
    }

    body = await response.text();
  } catch {
    return {};
  }

  let items;
  try {
    ({ items } = mf2(body, { baseUrl: me }));
  } catch {
    return {};
  }

  const cards = items.filter((item) => item.type?.includes("h-card"));
  const canonical = me.replace(/\/$/, "");
  const card =
    cards.find((item) =>
      item.properties.url?.some((url) => getValue([url]) === canonical),
    ) || cards[0];

  if (!card) {
    return {};
  }

  return {
    name: getValue(card.properties.name),
    url: getValue(card.properties.url) || me,
    photo: getValue(card.properties.photo),
  };
};

/**
 * Get profile information for a user, using configured values first and
 * filling in anything missing from the h-card on their site
 * @param {string} me - Profile URL
 * @param {IndieAuthProfile} [configured] - Configured profile information
 * @returns {Promise<IndieAuthProfile|undefined>} Profile information, if any
 * @see {@link https://indieauth.spec.indieweb.org/#profile-information}
 */
export const getProfileInformation = async (me, configured = {}) => {
  const discovered = await discoverProfile(me);
  /**
   * @type {IndieAuthProfile}
   */
  const profile = {};

  /**
   * @type {Array<"name"|"url"|"photo">}
   */
  const keys = ["name", "url", "photo"];
  for (const key of keys) {
    const value = configured[key] || discovered[key];
    if (value) {
      profile[key] = value;
    }
  }

  return Object.keys(profile).length > 0 ? profile : undefined;
};
