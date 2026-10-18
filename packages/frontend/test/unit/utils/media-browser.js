import { strict as assert } from "node:assert";
import { afterEach, before, describe, it, mock } from "node:test";

import { JSDOM } from "jsdom";

const { window } = new JSDOM("<!doctype html><body></body>", {
  url: "https://website.example/posts/create",
});
for (const name of ["window", "document", "location", "HTMLElement"]) {
  Object.defineProperty(globalThis, name, {
    value: name === "window" ? window : window[name],
    configurable: true,
  });
}

// jsdom has no modal dialogs; enough of one to open and close
class DialogStub extends HTMLElement {
  showModal() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new window.Event("close"));
  }
}
for (const name of /** @type {const} */ (["showModal", "close"])) {
  window.HTMLDialogElement.prototype[name] = DialogStub.prototype[name];
}

// What the media browser template renders, strings already localised
document.body.innerHTML = `
  <template id="media-browser">
    <dialog class="media-browser">
      <h2 class="media-browser__title">Choose a file</h2>
      <ul class="media-browser__files" role="list"></ul>
      <p class="media-browser__empty" hidden>No files uploaded yet</p>
      <p class="media-browser__error" hidden>Unable to load files</p>
      <div class="button-group">
        <button class="media-browser__more" type="button" hidden>Show more</button>
        <button class="media-browser__close" type="button">Cancel</button>
      </div>
    </dialog>
  </template>
`;

/**
 * Stub the media endpoint: one response per call, in order
 * @param {...object} pages - `q=source` response bodies
 * @returns {Mock<typeof fetch>} Mock function, to inspect the requests
 */
const mockMediaEndpoint = (...pages) =>
  mock.method(globalThis, "fetch", async () =>
    Response.json(pages.shift() ?? { items: [], paging: {} }),
  );

/**
 * Find an element in the media browser dialog
 * @param {HTMLDialogElement} dialog - Media browser dialog
 * @param {string} selector - Element selector
 * @returns {HTMLElement|null} Element, if found
 */
const find = (dialog, selector) => dialog.querySelector(selector);

const photo = {
  "media-type": "photo",
  uid: "01a1",
  url: "https://website.example/media/photos/cheese.jpg",
};
const audio = {
  "media-type": "audio",
  uid: "01a2",
  url: "https://website.example/media/audio/podcast.mp3",
};

describe("frontend/scripts/utils/media-browser", () => {
  /**
   * @type {typeof import("../../../scripts/utils/media-browser.js").openMediaBrowser}
   */
  let openMediaBrowser;

  /**
   * @type {HTMLTemplateElement}
   */
  let template;

  before(async () => {
    ({ openMediaBrowser } =
      await import("../../../scripts/utils/media-browser.js"));
    template = /** @type {HTMLTemplateElement} */ (
      document.querySelector("#media-browser")
    );
  });

  afterEach(() => {
    mock.restoreAll();
    for (const dialog of document.querySelectorAll("dialog")) {
      dialog.remove();
    }
  });

  it("Lists files from the media endpoint in a dialog", async () => {
    const fetch = mockMediaEndpoint({ items: [photo, audio], paging: {} });

    const dialog = await openMediaBrowser(template, {
      endpoint: "/media",
      onSelect: () => {},
    });

    const request = new URL(
      /** @type {string} */ (fetch.mock.calls[0].arguments[0]),
    );
    assert.equal(request.pathname, "/media");
    assert.equal(request.searchParams.get("q"), "source");
    assert.equal(dialog.hasAttribute("open"), true);
    assert.equal(dialog.querySelectorAll(".media-browser__file").length, 2);
    assert.equal(dialog.querySelector("img")?.getAttribute("src"), photo.url);
    assert.match(dialog.textContent, /podcast\.mp3/);
  });

  it("Hands back the chosen file and closes", async () => {
    mockMediaEndpoint({ items: [photo], paging: {} });
    const onSelect = mock.fn();

    const dialog = await openMediaBrowser(template, {
      endpoint: "/media",
      onSelect,
    });
    find(dialog, ".media-browser__file")?.click();

    assert.deepEqual(onSelect.mock.calls[0].arguments, [photo]);
    assert.equal(dialog.isConnected, false);
  });

  it("Shows more files from the next page", async () => {
    const fetch = mockMediaEndpoint(
      { items: [photo], paging: { after: photo.uid } },
      { items: [audio], paging: {} },
    );

    const dialog = await openMediaBrowser(template, {
      endpoint: "/media",
      onSelect: () => {},
    });
    const more = find(dialog, ".media-browser__more");
    assert.equal(more?.hidden, false);

    more?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const request = new URL(
      /** @type {string} */ (fetch.mock.calls[1].arguments[0]),
    );
    assert.equal(request.searchParams.get("after"), photo.uid);
    assert.equal(dialog.querySelectorAll(".media-browser__file").length, 2);
    assert.equal(more?.hidden, true);
  });

  it("Says so when there are no files", async () => {
    mockMediaEndpoint({ items: [], paging: {} });

    const dialog = await openMediaBrowser(template, {
      endpoint: "/media",
      onSelect: () => {},
    });

    assert.equal(find(dialog, ".media-browser__empty")?.hidden, false);
  });

  it("Says so when files can’t be loaded", async () => {
    mock.method(
      globalThis,
      "fetch",
      async () => new Response("", { status: 500 }),
    );

    const dialog = await openMediaBrowser(template, {
      endpoint: "/media",
      onSelect: () => {},
    });

    assert.equal(find(dialog, ".media-browser__error")?.hidden, false);
  });

  it("Removes the dialog when cancelled", async () => {
    mockMediaEndpoint({ items: [photo], paging: {} });

    const dialog = await openMediaBrowser(template, {
      endpoint: "/media",
      onSelect: () => {},
    });
    find(dialog, ".media-browser__close")?.click();

    assert.equal(dialog.isConnected, false);
  });
});

/**
 * @import { Mock } from "node:test"
 * @import mediaBrowser from "../../../scripts/utils/media-browser.js"
 */
