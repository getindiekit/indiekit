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

const getDocument = async (query) => {
  const response = await request
    .get("/posts")
    .query(query)
    .set("cookie", testCookie());

  return new JSDOM(response.text).window.document;
};

describe("endpoint-posts GET /posts?post-type=*&filter=*", () => {
  it("Returns posts filtered by post type and text", async () => {
    const document = await getDocument({
      "post-type": "bookmark",
      filter: "lunch & dinner",
    });

    assert.equal(
      document.querySelector(".card__title a").textContent.trim(),
      "Lunch spots",
    );
    assert.equal(
      document.querySelector('[name="filter"]').value,
      "lunch & dinner",
    );
  });

  it("Checks the chosen post type and no other", async () => {
    const document = await getDocument({ "post-type": "bookmark" });
    const checked = [
      ...document.querySelectorAll('[name="post-type"]:checked'),
    ].map((input) => input.value);

    assert.deepEqual(checked, ["bookmark"]);
  });

  it("Checks nothing when no post type is chosen", async () => {
    const document = await getDocument({});
    const checked = document.querySelectorAll('[name="post-type"]:checked');

    assert.equal(checked.length, 0);
  });

  it("Offers a checkbox for every configured post type", async () => {
    const document = await getDocument({});
    const values = [...document.querySelectorAll('[name="post-type"]')].map(
      (input) => input.value,
    );

    // The publication's post types are the configured ones merged with those
    // the loaded post type plugins bring, keyed in alphabetical order.
    assert.deepEqual(values, [
      "article",
      "bookmark",
      "like",
      "note",
      "photo",
      "reply",
    ]);
  });

  it("Checks several post types at once", async () => {
    const document = await getDocument({ "post-type": ["bookmark", "note"] });
    const checked = [
      ...document.querySelectorAll('[name="post-type"]:checked'),
    ].map((input) => input.value);

    assert.deepEqual(checked, ["bookmark", "note"]);
  });

  it("Carries the post type in the form itself", async () => {
    const document = await getDocument({ "post-type": "bookmark" });
    const input = document.querySelector(
      'form[role="search"] [name="post-type"][value="bookmark"]',
    );

    assert.ok(input, "post-type checkbox not found inside the search form");
    assert.equal(input.checked, true);
  });

  it("Opens the details for either control in use", async () => {
    const unfiltered = await getDocument({});
    const searched = await getDocument({ filter: "lunch & dinner" });
    const byType = await getDocument({ "post-type": "bookmark" });

    assert.equal(
      unfiltered.querySelector("details").hasAttribute("open"),
      false,
    );
    assert.equal(searched.querySelector("details").hasAttribute("open"), true);
    assert.equal(byType.querySelector("details").hasAttribute("open"), true);
  });

  it("Heads the list with the number of posts", async () => {
    const document = await getDocument({});

    assert.equal(
      document.querySelector(".section__title").textContent.trim(),
      "1 post",
    );
  });

  it("Prefixes the heading with the chosen post type", async () => {
    const document = await getDocument({ "post-type": "bookmark" });

    assert.equal(
      document.querySelector(".section__title").textContent.trim(),
      "Custom bookmark post type · 1 post",
    );
  });

  it("Joins several post types in the heading and the title", async () => {
    const document = await getDocument({ "post-type": ["bookmark", "note"] });

    assert.equal(
      document.querySelector(".section__title").textContent.trim(),
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
      document.querySelector(".section__title").textContent.trim(),
      "Custom bookmark post type, Custom note post type · 1 post",
    );
  });

  it("Plays back the search term, whose control is collapsed", async () => {
    const document = await getDocument({ filter: "lunch & dinner" });

    assert.equal(
      document.querySelector(".section__title").textContent.trim(),
      "1 post matching “lunch & dinner”",
    );
  });

  it("Says when no post of a type exists", async () => {
    const document = await getDocument({ "post-type": "photo" });

    assert.equal(document.querySelectorAll(".card").length, 0);
    assert.equal(
      document.querySelector(".section__title").textContent.trim(),
      "Custom photo post type · No posts",
    );
  });

  it("Plays back the search term when nothing matches it", async () => {
    const document = await getDocument({ filter: "zzz" });

    assert.equal(document.querySelectorAll(".card").length, 0);
    assert.equal(
      document.querySelector(".section__title").textContent.trim(),
      "No posts matching “zzz”",
    );
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

    assert.equal(unfiltered.title, "Published posts - Test configuration");
    assert.equal(
      filtered.title,
      "Published posts: Custom bookmark post type · 1 post matching “lunch & dinner” - Test configuration",
    );
    assert.equal(
      unfiltered.querySelector(".heading__title").textContent.trim(),
      "Published posts",
    );
  });

  it("Escapes a search term exactly once, in the heading and the title", async () => {
    const document = await getDocument({ filter: "<script>alert(1)</script>" });
    const heading = document.querySelector(".section__title");

    assert.equal(heading.querySelectorAll("script").length, 0);
    assert.equal(
      heading.textContent.trim(),
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
    const href = document
      .querySelector(".pagination__item--next a")
      .getAttribute("href");
    const next = new URL(href, "https://website.example/posts");

    assert.equal(next.searchParams.get("post-type"), "bookmark");
    assert.equal(next.searchParams.get("filter"), "lunch & dinner");
    assert.equal(next.searchParams.get("after"), "456");
  });

  after(() => server.close());
});
