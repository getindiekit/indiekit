import sanitize from "sanitize-html";

/**
 * Get mention type from `wm-property`
 * @param {string} wmProperty - Webmention.io `wm-property` value
 * @returns {string} Icon name
 */
export const getMentionType = (wmProperty) => {
  switch (true) {
    case wmProperty === "in-reply-to": {
      return "reply";
    }
    case wmProperty === "like-of": {
      return "like";
    }
    case wmProperty === "repost-of": {
      return "repost";
    }
    case wmProperty === "bookmark-of": {
      return "bookmark";
    }
    case wmProperty === "rsvp": {
      return "rsvp";
    }
    default: {
      return "mention";
    }
  }
};

const upperFirst = (string) => {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
};

/**
 * Get mention title
 * @param {object} jf2 - JF2
 * @returns {string} Mention title
 */
export const getMentionTitle = (jf2) => {
  let type = getMentionType(jf2["wm-property"]);
  type = upperFirst(type).replace("Rsvp", "RSVP");

  return jf2.name || type;
};

/**
 * Get author name
 * @param {object} jf2 - JF2
 * @returns {string} Mention title
 */
export const getAuthorName = (jf2) => {
  let url = jf2.author?.url || jf2.url;
  url = new URL(url);
  url = url.hostname + url.pathname.replace(/\/$/, "");

  return jf2.author?.name || url;
};

/**
 * Normalise paragraphs
 * @example `One<br><br>Two` => <p>One</p><p>Two</p>
 * @param {string} html - HTML
 * @returns {string} HTML with normalised paragraphs
 */
export const normaliseParagraphs = (html) => {
  html = `<p>${html}</p>`;
  html = html.replaceAll(/<br\s*\/?>\s*<br\s*\/?>/g, "</p><p>");
  return html;
};

/**
 * Sanitise incoming mention HTML
 * @param {string} html - HTML
 * @returns {string} Sanitised HTML
 */
export const sanitiseHtml = (html) => {
  html = normaliseParagraphs(html);
  html = sanitize(html, {
    exclusiveFilter: function (frame) {
      // Remove empty Brid.gy links, for example
      // <p><a href="https://brid.gy/publish/mastodon"></a></p>
      return (
        (frame.tag === "a" &&
          frame.attribs?.href?.includes("brid.gy") &&
          !frame.text.trim()) ||
        (frame.tag === "p" && !frame.text.trim())
      );
    },
    transformTags: {
      h1: "h3",
      h2: "h4",
      h3: "h5",
      h4: "h6",
      h5: "h6",
      h6: "h6",
    },
  });

  return html;
};
