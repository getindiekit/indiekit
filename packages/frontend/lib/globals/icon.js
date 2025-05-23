/**
 * Render SVG icon
 * @param {string} name - Icon name
 * @param {string} [title] - Accessible title
 * @returns {string|undefined} HTML
 */
export const icon = (name, title) => {
  const paths = {
    article:
      "M36 4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm0 6h12v4H12v-4zm0 8h12v4H12v-4zm0 8h24v4H12v-4zm16-16h8v12h-8V14z",
    audio:
      "M36 4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm10 17h-1c-3 0-5 2-5 5s2 5 5 5 5-2 5-5V20l6 1 1-3-11-4v11z",
    bookmark:
      "M20 2v2h16c4 0 8 3 8 8v24c0 5-3 8-8 8H12c-4 0-8-3-8-8V12c0-4 4-8 8-8V2h8zm16 6H20v20l-4-4-4 4V8c-2 0-4 2-4 4v24c0 2 2 4 4 4h24c2 0 4-2 4-4V12c0-2-2-4-4-4zm0 22v4H12v-4h24zm0-8v4H23v-4h13zm0-8v4H23v-4h13z",
    checkin:
      "M36 4H12c-4 0-8 4-8 8v20c0 5 4 8 8 8h5l7 8 7-8h5c5 0 8-3 8-8V12c0-4-3-8-8-8zm0 32h-7l-5 6-5-6h-7c-2 0-4-2-4-4V12c0-2 2-4 4-4h24c2 0 4 2 4 4v20c0 2-2 4-4 4zm-15-6l-7-7 3-3 4 4 10-9 3 3-13 12z",
    createPost:
      "M12 8h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Zm24-4H12c-4.5 0-8 3.5-8 8v24c0 4.5 3.5 8 8 8h24c4.5 0 8-3.5 8-8V12c0-4.5-3.5-8-8-8ZM26 14v8h8v4h-8v8h-4v-8h-8v-4h8v-8h4Z",
    cross: "m45 6-3-3-18 18L6 3 3 6l18 18L3 42l3 3 18-18 18 18 3-3-18-18z",
    delete:
      "M9 40V10H6V6h11a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3h11v4h-3v30a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4Zm26-30H13v29c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V10ZM17.5 36h4V14h-4v22Zm9 0h4V14h-4v22Z",
    event:
      "M40 8h-2V4h-4v8h-2V8H18V4h-4v8h-2V8H8c-2 0-4 2-4 4v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-2-2-4-4-4zm-4 32H12c-2 0-4-2-4-4V16h32v20c0 2-2 4-4 4z",
    jam: "M36 4H12c-4.5 0-8 3.5-8 8v24c0 4.5 3.5 8 8 8h24c4.5 0 8-3.5 8-8V12c0-4.5-3.5-8-8-8ZM12 8h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Zm23 21c0 2.8-2 5-4.9 5a5.1 5.1 0 0 1-5.1-5c0-2.8 2.3-5.1 5.1-5.1l.9.1v-7.5l-10 2V32c0 2.8-2 5-4.9 5a5.1 5.1 0 0 1-5.1-5c0-2.8 2.3-5.1 5.1-5.1l.9.1V14l18-3v18Z",
    like: "M36 4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm12 25s9-7 9-12c0-4-7-6-9 0-2-6-9-4-9 0 0 5 9 12 9 12z",
    location: "M44 3 30 8 18 4 4 9v36l14-5 12 4 14-5V3ZM29 40l-11-4V8l11 4v28Z",
    mention:
      "M24 45C13 45 3 36 3 24S13 3 24 3s21 9 21 21c0 7-2.3 10.5-7 10.5-4.5 0-6-2.9-6.5-4C30.7 31.7 29 34 24 34a10 10 0 0 1 0-20c6 0 10 5 10 10v2c0 1 1 4.5 4 4.5 2 0 3-2.2 3-6.5 0-9-7-17-17-17S7 15 7 24s7 17 17 17h10v4H24Zm0-15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z",
    next: "M28 7.5 40.5 20c3 3 3 5 0 8L28 40.5l-3-3L35.5 27l1.5-1H6v-4h31l-1.5-1L25 10.5l3-3Z",
    note: "M12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm24-4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 14h24v4H12v-4zm0 8h24v4H12v-4zm0 8h18v4H12v-4z",
    offline:
      "M24 7a32 32 0 1 1-15.8 4.2l3.7 3.7a24.7 24.7 0 0 0-8.4 6.6L0 18v8.6a27 27 0 1 0 48 0V18l-3.5 3.5a27 27 0 0 0-25.1-9.1l-4.2-4.2A32 32 0 0 1 24 7Zm0 51a17 17 0 0 0 15.5-10h5.4A22 22 0 0 1 3 48h5.4A17 17 0 0 0 24 58Zm0-26a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm16-6-3.5 3.5-1.2-1.2-9.2-9.2a22 22 0 0 1 14 6.9Zm-22.9-6 4.1 4.1a17 17 0 0 0-9.7 5.3L8 26a22 22 0 0 1 9-6ZM2 5l3-3 41 41-3 3L2 5Z",
    photo:
      "M36 4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm24 24l-9-14-7 11-3-5-5 8h24z",
    previous:
      "m23.8 10.5-3-3L8.2 20c-3 3-3 5 0 8l12.6 12.5 3-3L13.2 27l-1.4-1h31v-4h-31l1.4-1 10.6-10.5Z",
    public:
      "M24 45a20.4 20.4 0 0 1-14.8-6.2A21.2 21.2 0 0 1 3 24 20.3 20.3 0 0 1 9.2 9.2 21.5 21.5 0 0 1 24 3a20.3 20.3 0 0 1 14.8 6.2 22 22 0 0 1 4.5 6.7 20.3 20.3 0 0 1-4.5 23A21.2 21.2 0 0 1 24 45Zm-2-8a4 4 0 0 1-4-4v-3L7.6 19.6A17.2 17.2 0 0 0 22 40.9V37Zm19-13c0-10-8-15-11-15.9V9a3 3 0 0 1-3 3h-5v6a2 2 0 0 1-2 2h-4v4h8a6 6 0 0 1 6 6v2h4a2 2 0 0 1 2 2v2c3.3-3.3 5-7.3 5-12Z",
    publicOff:
      "M32.1 43.4a20.5 20.5 0 0 1-16.2 0A21.2 21.2 0 0 1 3 24a20.3 20.3 0 0 1 4.8-13.2L2 5l3-3 41 41-3 3-5.7-5.7a21.4 21.4 0 0 1-5.2 3ZM7.6 19.6A17.2 17.2 0 0 0 22 40.9V37a4 4 0 0 1-4-4v-3L7.6 19.6ZM24 3a20.3 20.3 0 0 1 14.8 6.2 22 22 0 0 1 4.5 6.7 20.3 20.3 0 0 1-1.4 19L39 32a17 17 0 0 0-9-24v1a3 3 0 0 1-3 3h-5v3l-8.9-8.9 2.8-1.4C18.4 3.6 21 3 24 3Zm-7 17h-1v4h5l-4-4Z",
    reply:
      "M12 48V38c-4 0-8-3-8-8V12c0-4 4-8 8-8h24c4 0 8 4 8 8v18c0 5-3 8-8 8H25L12 48zM8 12v18c0 2 2 4 4 4h4v6l7-6h13c2 0 4-2 4-4V12c0-2-2-4-4-4H12c-2 0-4 2-4 4z",
    repost:
      "M35 7c5 0 8 4 8 8v18c0 5-3 8-8 8h-7v6l-8-8 8-8v6h7c2 0 4-2 4-4V15c0-2-2-4-4-4h-4V7zM20 1l8 8-8 8v-6h-7c-2 0-4 2-4 4v18c0 2 2 4 4 4h4v4h-4c-4 0-8-3-8-8V15c0-4 4-8 8-8h7V1z",
    rsvp: "M36 4c4 0 8 4 8 8v18c0 5-3 8-8 8H25L12 48V38c-4 0-8-3-8-8V12c0-4 4-8 8-8h24zm0 4H12c-2 0-4 2-4 4v18c0 2 2 4 4 4h4v6l7-6h13c2 0 4-2 4-4V12c0-2-2-4-4-4zm-5 6l3 3-13 12-7-7 3-3 4 4 10-9z",
    syndicate:
      "M9.2 9.2 12 12a17 17 0 0 0 0 24l-2.8 2.8a21 21 0 0 1 0-29.6ZM45 24a21 21 0 0 1-6.2 14.8L36 36a17 17 0 0 0 0-24l2.8-2.8A21 21 0 0 1 45 24Zm-30.2-9.2 2.8 2.8a9 9 0 0 0 0 12.8l-2.8 2.8a13 13 0 0 1 0-18.4ZM37 24a13 13 0 0 1-3.8 9.2l-2.8-2.8a9 9 0 0 0 0-12.8l2.8-2.8A13 13 0 0 1 37 24Zm-13-5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z",
    tick: "M16 40 3 27l3-3 10 10L42 8l3 3z",
    undelete:
      "M28 3a3 3 0 0 1 3 2.8V6h11v4h-3v30a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4v-5h4v4c0 .6.4 1 1 1h20c.6 0 1-.4 1-1v-4c0-7.5-7-13-13-13s-9.5 2.5-12.5 7H18v4H5a2 2 0 0 1-2-2V18h4v7.5C12 19 17.5 18 22 18a17 17 0 0 1 13 6.4V10H13v7.5A12 12 0 0 0 9 20V10H6V6h11a3 3 0 0 1 3-3h8Z",
    unknownPostType: "hello",
    unlisted:
      "m5 2 41 41-3 3L2 5l3-3Zm3.5 32.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM28 35l4 4H14v-4h14ZM8.5 25.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM19 26l4 4h-9v-4h5Zm23 0v4h-5l-4-4h9ZM8.5 16.5c.6 0 1 .2 1.5.5l.5.5a2.5 2.5 0 1 1-2-1ZM42 17v4H28l-4-4h18Zm0-9v4H19l-4-4h27Z",
    updatePost:
      "M12 8h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Zm28 9 4-4v12l-4 4V17ZM36 4H12c-4.5 0-8 3.5-8 8v24c0 4.5 3.5 8 8 8h24c4.5 0 8-3.5 8-8V12c0-4.5-3.5-8-8-8ZM12 14h24v4H12Zm0 8h22l-4 4H12v-4Zm29-3 3 3-14 14h-3v-3l14-14ZM27 30l-2 2v2H12v-4h15Zm19.5-13.5c.8.8.8 2.2 0 3L45 21l-3-3 1.5-1.5c.8-.8 2.2-.8 3 0Z",
    uploadFile:
      "M32.3 4H12c-4.5 0-8 3.5-8 8v24c0 4.5 3.5 8 8 8h24c4.5 0 8-3.5 8-8V15.7a4 4 0 0 0-1.2-2.9l-7.6-7.6A4 4 0 0 0 32.3 4ZM12 8h20v8h8v20a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Zm17.5 16 3-3-5-5c-3-3-4-3-7 0l-5 5 3 3 2.5-2.5 1-1.5v15h4V20l1 1.5 2.5 2.5Z",
    video:
      "M36 4H12c-4.5 0-8 3.5-8 8v24c0 4.5 3.5 8 8 8h24c4.5 0 8-3.5 8-8V12c0-4.5-3.5-8-8-8zM12 8h24a4 4 0 014 4v24a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4zm8 22l12-6-12-6v12zm-8-20h2v4h-4v-2c0-1.1.9-2 2-2zm6 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h2a2 2 0 012 2v2h-4v-4zM10 34h4v4h-2a2 2 0 01-2-2v-2zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v2a2 2 0 01-2 2h-2v-4z",
    warning:
      "M24 4.2c2 0 4.3 1.3 5 2.8l15 28c2.5 5-2 9-5 9H9c-3 0-7.5-4-5-9L19 7c.8-1.5 3-2.8 5-2.8Zm0 4c-.8 0-1.5.6-2 1.6L8 36.1C6.7 38.5 8 40 9.5 40h29c1.5 0 2.8-1.5 1.5-3.8L26 9.8c-.5-1-1.2-1.4-2-1.4ZM26 32v4h-4v-4h4Zm0-16v14h-4V16h4Z",
  };

  if (!paths[name]) {
    return;
  }

  const svg = title
    ? `<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 48 48" aria-labelledby="${name}-title" role="img">
    <title id="${name}-title">${title}</title>
    <path fill="currentColor" d="${paths[name]}"/>
  </svg>`
    : `<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 48 48" focusable="false" aria-hidden="true">
    <path fill="currentColor" d="${paths[name]}"/>
  </svg>`;

  const icon = svg.replaceAll(/(\s{2,}|\r\n\t|\n|\r\t)/gm, "");

  return icon;
};
