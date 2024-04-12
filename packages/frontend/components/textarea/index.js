import EasyMDE from "easymde";

const paths = {
  bold: "M17 30c6.1 0 10-3 10-8 0-3.5-2.7-6.3-6.5-6.5V15c3-.4 5-3 5-6 0-4.5-3.5-7-9-7H5v28h12ZM12 7h2c2.5 0 4 1 4 3 0 1.5-1.5 3-4 3h-2V7Zm0 18v-7h2.3c3.1 0 4.7 1.1 4.7 3.4 0 2.5-1.4 3.6-4.8 3.6H12Z",
  code: "m13.5 8.5-3-3L2 14C.5 15.5.5 16.5 2 18l8.5 8.5 3-3L6 16l7.5-7.5Zm5 0 3-3L30 14c1.5 1.5 1.5 2.5 0 4l-8.5 8.5-3-3L26 16l-7.5-7.5Z",
  fullscreen:
    "M4 20H0v10c0 1.1.9 2 2 2h10v-4H4v-8Zm-4-8h4V4h8V0H2a2 2 0 0 0-2 2v10Zm28 16h-8v4h10a2 2 0 0 0 2-2V20h-4v8ZM20 0v4h8v8h4V2a2 2 0 0 0-2-2H20Z",
  heading: "M27 30h-6V18H11v12H5V2h6v11h10V2h6z",
  italic: "m21.5 30 .8-4h-6l4-20h6l.7-4H10l-.7 4h6l-4 20h-6l-.8 4z",
  link: "M14 8v4H8a4 4 0 1 0 0 8h6v4H8A8 8 0 1 1 8 8h6Zm10 0a8 8 0 1 1 0 16h-6v-4h6a4 4 0 1 0 0-8h-6V8h6Zm-2 6v4H10v-4h12Z",
  "ordered-list":
    "M10 2h22v4H10Zm0 12h22v4H10Zm0 12h22v4H10ZM0 0h4v8H2V2H0V0Zm5 12h1v2l-3 4h3v2H0v-2l3.3-4H0v-2h5ZM0 26v-2h6v8H0v-2h4v-1H2v-2h2v-1H0Z",
  quote:
    "M4 6h7a3 3 0 0 1 3 3v6.6a4 4 0 0 1-1 2.5L6.6 26h-3l3-8H4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Zm17 0h7a3 3 0 0 1 3 3v6.6a4 4 0 0 1-1 2.5L23.6 26h-3l3-8H21a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z",
  "side-by-side":
    "M16 6c7 0 13.5 4 16 10-2.5 6-9 10-16 10S2.5 22 0 16C2.5 10 9 6 16 6Zm0 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
  table:
    "M32 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2C0 .9.9 0 2 0h28a2 2 0 0 1 2 2Zm-4 2H4v6h24V4ZM14 14H4v5h10v-5Zm0 9H4v5h10v-5Zm14-9H18v5h10v-5Zm0 9H18v5h10v-5Z",
  undo: "M2 24h-.1A2 2 0 0 1 0 22V9h4v7.5A15 15 0 0 1 32 24h-4a11 11 0 0 0-21.2-4H15v4H2Z",
  "unordered-list":
    "M9 2h22v4H9Zm0 12h22v4H9Zm0 12h22v4H9ZM3 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  "upload-image":
    "M2 0h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2C0 .9.9 0 2 0Zm26 24-9-14-7 11-3-4.8L4 24h24Z",
};

/**
 * Get SVG icon
 * @param {string} name - Icon name
 * @returns {string} SVG
 */
const getButtonSvg = (name) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 32 32" focusable="false" aria-hidden="true">
  <path fill="currentColor" d="${paths[name]}"/>
</svg>`;
};

export const TextareaFieldComponent = class extends HTMLElement {
  connectedCallback() {
    this.editor = this.getAttribute("editor");
    if (this.editor !== "") {
      return;
    }

    this.editorId = this.getAttribute("editor-id");
    this.editorImageUpload = this.getAttribute("editor-image-upload");
    this.editorLocale = this.getAttribute("editor-locale");
    this.editorStatus = this.getAttribute("editor-status");
    this.editorToolbar = this.getAttribute("editor-toolbar");
    this.$label = this.querySelector("label");
    this.$textarea = this.querySelector("textarea");

    const status =
      this?.editorStatus === "false"
        ? false
        : [
            ...(this.editorImageUpload === "false" ? [] : ["upload-image"]),
            "words",
            "characters",
            "autosave",
          ];

    const toolbar =
      this?.editorToolbar === "false"
        ? false
        : [
            "bold",
            "italic",
            "heading",
            "quote",
            "ordered-list",
            "unordered-list",
            "table",
            "code",
            "link",
            ...(this.editorImageUpload === "false" ? [] : ["upload-image"]),
            "|",
            "undo",
            "side-by-side",
            "fullscreen",
          ];

    const editor = new EasyMDE({
      autoDownloadFontAwesome: false,
      autosave: {
        enabled: true,
        uniqueId: this.editorId || this.$textarea.id,
        timeFormat: { locale: this.editorLocale || "en" },
      },
      blockStyles: {
        bold: "**",
        italic: "_",
      },
      element: this.$textarea,
      imageUploadFunction: this.uploadFile,
      minHeight: "6rem",
      previewClass: ["editor-preview", "s-flow"],
      status,
      // @ts-ignore
      toolbar,
      unorderedListStyle: "-",
    });

    // Restore label behaviour
    /** @type {HTMLTextAreaElement} */
    const $codeMirrorTextarea = this.querySelector(".CodeMirror textarea");
    this.$label.addEventListener("click", () => {
      $codeMirrorTextarea.focus();
    });

    // Update character count
    /** @type {HTMLElement} */
    const $characters = this.querySelector(".editor-statusbar .characters");
    editor.codemirror.on("update", () => {
      if ($characters) {
        $characters.innerHTML = String(editor.value().length);
      }
    });

    const $editorToolbar = this.querySelector(".editor-toolbar");
    if ($editorToolbar) {
      // Use custom SVG icons
      const buttons = $editorToolbar.querySelectorAll("button");
      for (const button of buttons) {
        button.innerHTML = getButtonSvg(button.classList[0]);
      }

      // Get toolbar height to offset editor and preview in fullscreen mode
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.style.setProperty(
            "--toolbar-height",
            `${entry.contentRect.height}px`,
          );
        }
      });

      resizeObserver.observe($editorToolbar);
    }
  }

  /**
   * Upload file
   * @param {object} file - File
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   * @returns {Promise<string>} - File URL or error message
   */
  async uploadFile(file, onSuccess, onError) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpointResponse = await fetch("http://localhost:3000/media", {
        method: "POST",
        body: formData,
      });

      return endpointResponse.ok
        ? onSuccess(endpointResponse.headers.get("location"))
        : onError(endpointResponse.statusText);
    } catch (error) {
      onError(error.message);
    }
  }
};
