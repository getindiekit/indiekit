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

  it("Marks the chosen post type as the current filter", async () => {
    const document = await getDocument({ "post-type": "bookmark" });
    const current = document.querySelectorAll(
      '.navigation--filters a[aria-current="true"]',
    );

    assert.equal(current.length, 1);
    assert.equal(current[0].textContent.trim(), "Custom bookmark post type");
  });

  it("Marks every post type as current when none is chosen", async () => {
    const document = await getDocument({});
    const current = document.querySelectorAll(
      '.navigation--filters a[aria-current="true"]',
    );

    assert.equal(current.length, 1);
    assert.equal(current[0].textContent.trim(), "All post types");
  });

  it("Keeps the search term in the post type links and drops the cursor", async () => {
    const document = await getDocument({
      "post-type": "bookmark",
      filter: "lunch & dinner",
    });
    const links = [...document.querySelectorAll(".navigation--filters a")];
    const note = links.find(
      (link) => link.textContent.trim() === "Custom note post type",
    );
    const url = new URL(
      note.getAttribute("href"),
      "https://website.example/posts",
    );

    assert.equal(url.searchParams.get("post-type"), "note");
    assert.equal(url.searchParams.get("filter"), "lunch & dinner");
    assert.equal(url.searchParams.has("after"), false);
    assert.equal(url.searchParams.has("before"), false);
  });

  it("Links to the unfiltered list from the all post types pill", async () => {
    const document = await getDocument({ "post-type": "bookmark" });
    const links = [...document.querySelectorAll(".navigation--filters a")];
    const all = links.find(
      (link) => link.textContent.trim() === "All post types",
    );

    assert.equal(all.getAttribute("href"), "/posts/");
  });

  it("Keeps the post type when the search form is submitted", async () => {
    const document = await getDocument({ "post-type": "bookmark" });

    assert.equal(
      document.querySelector('form[role="search"] [name="post-type"]').value,
      "bookmark",
    );
  });

  it("Collapses the search unless a search term is in use", async () => {
    const unfiltered = await getDocument({});
    const searched = await getDocument({ filter: "lunch & dinner" });

    assert.equal(
      unfiltered.querySelector("details").hasAttribute("open"),
      false,
    );
    assert.equal(searched.querySelector("details").hasAttribute("open"), true);
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

  it("Plays back the search term, whose control is collapsed", async () => {
    const document = await getDocument({ filter: "lunch & dinner" });

    assert.equal(
      document.querySelector(".section__title").textContent.trim(),
      "1 post matching “lunch & dinner”",
    );
  });

  it("Says when nothing matches", async () => {
    const document = await getDocument({ "post-type": "photo" });

    assert.equal(document.querySelectorAll(".card").length, 0);
    assert.equal(
      document.querySelector(".section__title").textContent.trim(),
      "No posts match these filters",
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
