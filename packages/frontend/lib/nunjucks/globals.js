/**
 * Render SVG icon
 *
 * @param {string} name Icon name
 * @returns {string} HTML
 */
const icon = (name) => {
  const paths = {
    article:
      "M36 4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm0 6h12v4H12v-4zm0 8h12v4H12v-4zm0 8h24v4H12v-4zm16-16h8v12h-8V14z",
    audio:
      "M36 4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm10 17h-1c-3 0-5 2-5 5s2 5 5 5 5-2 5-5V20l6 1 1-3-11-4v11z",
    bookmark:
      "M20 2v2h16c4 0 8 3 8 8v24c0 5-3 8-8 8H12c-4 0-8-3-8-8V12c0-4 4-8 8-8V2h8zm16 6H20v20l-4-4-4 4V8c-2 0-4 2-4 4v24c0 2 2 4 4 4h24c2 0 4-2 4-4V12c0-2-2-4-4-4zm0 22v4H12v-4h24zm0-8v4H23v-4h13zm0-8v4H23v-4h13z",
    checkin:
      "M36 4H12c-4 0-8 4-8 8v20c0 5 4 8 8 8h5l7 8 7-8h5c5 0 8-3 8-8V12c0-4-3-8-8-8zm0 32h-7l-5 6-5-6h-7c-2 0-4-2-4-4V12c0-2 2-4 4-4h24c2 0 4 2 4 4v20c0 2-2 4-4 4zm-15-6l-7-7 3-3 4 4 10-9 3 3-13 12z",
    event:
      "M40 8h-2V4h-4v8h-2V8H18V4h-4v8h-2V8H8c-2 0-4 2-4 4v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-2-2-4-4-4zm-4 32H12c-2 0-4-2-4-4V16h32v20c0 2-2 4-4 4z",
    like: "M36 4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm12 25s9-7 9-12c0-4-7-6-9 0-2-6-9-4-9 0 0 5 9 12 9 12z",
    next: "M28 7.5 40.5 20c3 3 3 5 0 8L28 40.5l-3-3L35.5 27l1.5-1H6v-4h31l-1.5-1L25 10.5l3-3Z",
    note: "M12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm24-4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 14h24v4H12v-4zm0 8h24v4H12v-4zm0 8h18v4H12v-4z",
    photo:
      "M36 4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm24 24l-9-14-7 11-3-5-5 8h24z",
    previous:
      "m23.8 10.5-3-3L8.2 20c-3 3-3 5 0 8l12.6 12.5 3-3L13.2 27l-1.4-1h31v-4h-31l1.4-1 10.6-10.5Z",
    reply:
      "M12 48V38c-4 0-8-3-8-8V12c0-4 4-8 8-8h24c4 0 8 4 8 8v18c0 5-3 8-8 8H25L12 48zM8 12v18c0 2 2 4 4 4h4v6l7-6h13c2 0 4-2 4-4V12c0-2-2-4-4-4H12c-2 0-4 2-4 4z",
    repost:
      "M35 7c5 0 8 4 8 8v18c0 5-3 8-8 8h-7v6l-8-8 8-8v6h7c2 0 4-2 4-4V15c0-2-2-4-4-4h-4V7zM20 1l8 8-8 8v-6h-7c-2 0-4 2-4 4v18c0 2 2 4 4 4h4v4h-4c-4 0-8-3-8-8V15c0-4 4-8 8-8h7V1z",
    rsvp: "M36 4c4 0 8 4 8 8v18c0 5-3 8-8 8H25L12 48V38c-4 0-8-3-8-8V12c0-4 4-8 8-8h24zm0 4H12c-2 0-4 2-4 4v18c0 2 2 4 4 4h4v6l7-6h13c2 0 4-2 4-4V12c0-2-2-4-4-4zm-5 6l3 3-13 12-7-7 3-3 4 4 10-9z",
    video:
      "M36 4H12c-4.5 0-8 3.5-8 8v24c0 4.5 3.5 8 8 8h24c4.5 0 8-3.5 8-8V12c0-4.5-3.5-8-8-8zM12 8h24a4 4 0 014 4v24a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4zm8 22l12-6-12-6v12zm-8-20h2v4h-4v-2c0-1.1.9-2 2-2zm6 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h2a2 2 0 012 2v2h-4v-4zM10 34h4v4h-2a2 2 0 01-2-2v-2zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v2a2 2 0 01-2 2h-2v-4z",
  };

  const svg = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 48 48">
    <path d="${paths[name]}"/>
  </svg>`;

  const icon = svg.replace(/(\s{2,}|\r\n\t|\n|\r\t)/gm, "");

  return icon;
};

/**
 * Generate pagination data
 *
 * @param {number} currentPage Current page
 * @param {limit} limit Limit of items per page
 * @param {count} count Count of all items
 * @returns {object} Options for pagination component
 */
const pages = (currentPage, limit, count) => {
  // Pagination pages
  const totalPages = Math.ceil(count / limit);
  const nextPage = currentPage < totalPages ? currentPage + 1 : false;
  const previousPage = currentPage > 0 ? currentPage - 1 : false;
  // eslint-disable-next-line unicorn/no-new-array
  const pages = [...new Array(totalPages).keys()]; // [0, 1, 2]
  const pageItems = pages.map((item) => ({
    current: item + 1 === currentPage,
    href: `?${new URLSearchParams({ page: item + 1, limit })}`,
    text: item + 1,
  }));

  // Pagination results
  const resultsFrom = (currentPage - 1) * limit + 1;
  let resultsTo = resultsFrom - 1 + limit;
  resultsTo = resultsTo > count ? count : resultsTo;

  return {
    items: pageItems.length > 1 ? pageItems : false,
    next: nextPage
      ? {
          href: `?${new URLSearchParams({ page: nextPage, limit })}`,
        }
      : false,
    previous: previousPage
      ? {
          href: `?${new URLSearchParams({ page: previousPage, limit })}`,
        }
      : false,
    results: {
      from: resultsFrom,
      to: resultsTo,
      count,
    },
  };
};

module.exports = {
  icon,
  pages,
};
