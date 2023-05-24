/**
 * Generate pagination data
 * @param {number} currentPage - Current page
 * @param {number} limit - Limit of items per page
 * @param {number} count - Count of all items
 * @returns {object} Options for pagination component
 */
export const pages = (currentPage, limit, count) => {
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
