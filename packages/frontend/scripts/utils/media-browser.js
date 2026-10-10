import { getElement } from "./get-element.js";

/**
 * @typedef {{
 *   url: string,
 *   uid?: string,
 *   "media-type"?: "photo" | "audio" | "video"
 * }} MediaFile
 */

/**
 * Get the name of a file from its URL
 * @param {string} url - File URL
 * @returns {string} File name
 */
const getFilename = (url) => decodeURIComponent(url.split("/").at(-1) || url);

/**
 * Open a dialog to choose a file already uploaded to the media endpoint
 *
 * The dialog’s markup and strings come from a `<template>` rendered by the
 * calling component, so everything a reader sees is localised there.
 * @param {HTMLTemplateElement} template - Media browser template
 * @param {object} options - Options
 * @param {string} options.endpoint - Media endpoint URL
 * @param {(file: MediaFile) => void} options.onSelect - Called with the chosen file
 * @returns {Promise<HTMLDialogElement>} Dialog, once the first page is shown
 */
export const openMediaBrowser = async (template, { endpoint, onSelect }) => {
  const dialog = /** @type {HTMLDialogElement} */ (
    getElement(template.content, ".media-browser").cloneNode(true)
  );
  const $files = getElement(dialog, ".media-browser__files");
  const $empty = /** @type {HTMLElement} */ (
    getElement(dialog, ".media-browser__empty")
  );
  const $error = /** @type {HTMLElement} */ (
    getElement(dialog, ".media-browser__error")
  );
  const $more = /** @type {HTMLButtonElement} */ (
    getElement(dialog, ".media-browser__more")
  );
  const $close = getElement(dialog, ".media-browser__close");

  /**
   * Add a button for each file
   * @param {MediaFile[]} files - Files
   */
  const addFiles = (files) => {
    for (const file of files) {
      const $button = document.createElement("button");
      $button.classList.add("media-browser__file");
      $button.type = "button";

      if (file["media-type"] === "photo") {
        const $image = document.createElement("img");
        $image.src = file.url;
        $image.alt = getFilename(file.url);
        $image.loading = "lazy";
        $button.append($image);
      } else {
        $button.textContent = getFilename(file.url);
      }

      $button.addEventListener("click", () => {
        onSelect(file);
        dialog.close();
      });

      const $item = document.createElement("li");
      $item.append($button);
      $files.append($item);
    }
  };

  /**
   * Show a page of files
   * @param {string} [after] - Show files after this uid
   */
  const showFiles = async (after) => {
    const url = new URL(endpoint, location.href);
    url.searchParams.set("q", "source");
    if (after) {
      url.searchParams.set("after", after);
    }

    try {
      const response = await fetch(url.href, {
        credentials: "same-origin",
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { items = [], paging = {} } = await response.json();
      addFiles(items);
      $empty.hidden = $files.children.length > 0;
      $more.hidden = !paging.after;
      $more.dataset.after = paging.after || "";
    } catch {
      $error.hidden = false;
      $more.hidden = true;
    }
  };

  $more.addEventListener("click", () => showFiles($more.dataset.after));
  $close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => dialog.remove());

  document.body.append(dialog);
  dialog.showModal();
  await showFiles();

  return dialog;
};
