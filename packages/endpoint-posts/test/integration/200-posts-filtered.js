import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-posts");
const server = await testServer({
  application: { micropubEndpoint: "https://micropub-endpoint.example" },
});
const request = supertest.agent(server);

/**
 * @param {object} query - Query string parameters
 * @returns {Promise<Document>} Rendered page
 */
const getDocument = async (query) => {
  const response = await request
    .get("/posts")
    .query(query)
    .set("cookie", testCookie());

  return new JSDOM(response.text).window.document;
};

/**
 * @param {Document} document - Rendered page
 * @returns {string|undefined} Heading above the list of posts
 */
const getHeading = (document) => {
  const $heading = document.querySelector(".section__title");
  assert.ok($heading, "heading element not found");

  return $heading.textContent?.trim();
};

/**
 * @param {Document} document - Rendered page
 * @param {string} [selector] - Post type checkboxes to read
 * @returns {string[]} Values of the matching checkboxes
 */
const getPostTypeValues = (document, selector = '[name="post-type"]') => {
  const $$inputs = /** @type {NodeListOf<HTMLInputElement>} */ (
    document.querySelectorAll(selector)
  );

  return [...$$inputs].map((input) => input.value);
};

/**
 * @param {Document} document - Rendered page
 * @returns {boolean} Whether the filter details is open
 */
const isFilterOpen = (document) => {
  const $details = document.querySelector("details");
  assert.ok($details, "details element not found");

  return $details.hasAttribute("open");
};

describe("endpoint-posts GET /posts?post-type=*&filter=*", () => {
  it("Returns posts filtered by post type and text", async () => {
    const document = await getDocument({
      "post-type": "bookmark",
      filter: "lunch & dinner",
    });
    const $title = document.querySelector(".card__title a");
    const $filter = /** @type {HTMLInputElement} */ (
      document.querySelector('[name="filter"]')
    );

    assert.ok($title, "card title not found");
    assert.equal($title.textContent?.trim(), "Lunch spots");
    assert.ok($filter, "filter input not found");
    assert.equal($filter.value, "lunch & dinner");
  });

  it("Checks the chosen post type and no other", async () => {
    const document = await getDocument({ "post-type": "bookmark" });

    assert.deepEqual(
      getPostTypeValues(document, '[name="post-type"]:checked'),
      ["bookmark"],
    );
  });

  it("Checks nothing when no post type is chosen", async () => {
    const document = await getDocument({});

    assert.deepEqual(
      getPostTypeValues(document, '[name="post-type"]:checked'),
      [],
    );
  });

  it("Offers a checkbox for every configured post type", async () => {
    const document = await getDocument({});

    // The publication's post types are the configured ones merged with those
    // the loaded post type plugins bring, keyed in alphabetical order.
    assert.deepEqual(getPostTypeValues(document), [
      "article",
      "bookmark",
      "like",
      "note",
      "photo",
      "reply",
    ]);
  });

  it("Lays the post type checkboxes out inline", async () => {
    const document = await getDocument({});
    const $checkboxes = document.querySelector(".checkboxes");

    // A publication can configure a dozen or more post types, which stack to
    // most of a screen in the component's default column layout.
    assert.ok($checkboxes, "checkboxes not found");
    assert.equal($checkboxes.classList.contains("checkboxes--inline"), true);
  });

  it("Checks several post types at once", async () => {
    const document = await getDocument({ "post-type": ["bookmark", "note"] });

    assert.deepEqual(
      getPostTypeValues(document, '[name="post-type"]:checked'),
      ["bookmark", "note"],
    );
  });

  it("Carries the post type in the form itself", async () => {
    const document = await getDocument({ "post-type": "bookmark" });
    const $input = /** @type {HTMLInputElement} */ (
      document.querySelector(
        'form[role="search"] [name="post-type"][value="bookmark"]',
      )
    );

    assert.ok($input, "post-type checkbox not found inside the search form");
    assert.equal($input.checked, true);
  });

  it("Opens the details for either control in use", async () => {
    const unfiltered = await getDocument({});
    const searched = await getDocument({ filter: "lunch & dinner" });
    const byType = await getDocument({ "post-type": "bookmark" });

    assert.equal(isFilterOpen(unfiltered), false);
    assert.equal(isFilterOpen(searched), true);
    assert.equal(isFilterOpen(byType), true);
  });

  it("Heads the list with the number of posts", async () => {
    const document = await getDocument({});

    assert.equal(getHeading(document), "1 post");
  });

  it("Prefixes the heading with the chosen post type", async () => {
    const document = await getDocument({ "post-type": "bookmark" });

    assert.equal(getHeading(document), "Custom bookmark post type · 1 post");
  });

  it("Joins several post types in the heading and the title", async () => {
    const document = await getDocument({ "post-type": ["bookmark", "note"] });

    assert.equal(
      getHeading(document),
      "Custom bookmark post type, Custom note post type · 1 post",
    );
    assert.equal(
      document.title,
      "Published posts: Custom bookmark post type, Custom note post type · 1 post - Test configuration",
    );
  });

  it("Joins post types in the publication's order, not the query's", async () => {
    const document = await getDocument({ "post-type": ["note", "bookmark"] });

    assert.equal(
      getHeading(document),
      "Custom bookmark post type, Custom note post type · 1 post",
    );
  });

  it("Plays back the search term, whose control is collapsed", async () => {
    const document = await getDocument({ filter: "lunch & dinner" });

    assert.equal(getHeading(document), "1 post matching “lunch & dinner”");
  });

  it("Says when no post of a type exists", async () => {
    const document = await getDocument({ "post-type": "photo" });

    assert.equal(document.querySelectorAll(".card").length, 0);
    assert.equal(getHeading(document), "Custom photo post type · No posts");
  });

  it("Plays back the search term when nothing matches it", async () => {
    const document = await getDocument({ filter: "zzz" });

    assert.equal(document.querySelectorAll(".card").length, 0);
    assert.equal(getHeading(document), "No posts matching “zzz”");
    assert.equal(
      document.title,
      "Published posts: No posts matching “zzz” - Test configuration",
    );
  });

  it("Plays the heading back in the document title", async () => {
    const unfiltered = await getDocument({});
    const filtered = await getDocument({
      "post-type": "bookmark",
      filter: "lunch & dinner",
    });
    const $pageHeading = unfiltered.querySelector(".heading__title");

    assert.equal(unfiltered.title, "Published posts - Test configuration");
    assert.equal(
      filtered.title,
      "Published posts: Custom bookmark post type · 1 post matching “lunch & dinner” - Test configuration",
    );
    assert.ok($pageHeading, "page heading not found");
    assert.equal($pageHeading.textContent?.trim(), "Published posts");
  });

  it("Escapes a search term exactly once, in the heading and the title", async () => {
    const document = await getDocument({ filter: "<script>alert(1)</script>" });
    const $heading = document.querySelector(".section__title");

    assert.ok($heading, "heading element not found");
    assert.equal($heading.querySelectorAll("script").length, 0);
    assert.equal(
      $heading.textContent?.trim(),
      "1 post matching “<script>alert(1)</script>”",
    );
    assert.equal(
      document.title,
      "Published posts: 1 post matching “<script>alert(1)</script>” - Test configuration",
    );
  });

  it("Keeps filters in pagination links", async () => {
    const document = await getDocument({
      "post-type": "bookmark",
      filter: "lunch & dinner",
    });
    const $next = document.querySelector(".pagination__item--next a");

    assert.ok($next, "next page link not found");

    const next = new URL(
      $next.getAttribute("href") ?? "",
      "https://website.example/posts",
    );

    assert.equal(next.searchParams.get("post-type"), "bookmark");
    assert.equal(next.searchParams.get("filter"), "lunch & dinner");
    assert.equal(next.searchParams.get("after"), "456");
  });

  after(() => server.close());
});
