/**
 * Render Markdown string as HTML
 *
 * @param {string} name Icon name
 * @returns {string} HTML
 */
export const icon = name => {
  const paths = {
    article: 'M40 4H8C6 4 4 6 4 8v32c0 2 2 4 4 4h32c2 0 4-2 4-4V8c0-2-2-4-4-4zm0 36H8V8h32v32zM12 14h12v4H12v-4zm0 8h12v4H12v-4zm0 8h24v4H12v-4zm16-16h8v12h-8V14z',
    audio: 'M40 4H8C6 4 4 6 4 8v32c0 2 2 4 4 4h32c2 0 4-2 4-4V8c0-2-2-4-4-4zm0 36H8V8h32v32zM22 25h-1c-3 0-5 2-5 5s2 5 5 5 5-2 5-5V20l6 1 1-3-11-4v11z',
    bookmark: 'M40 6H26V4l-2-2H12l-2 2v2H8c-2 0-4 2-4 4v30c0 2 2 4 4 4h32c2 0 4-2 4-4V10c0-2-2-4-4-4zM14 6h8v15l-4-4-4 4V6zm26 34H8V10h2v16a2 2 0 003 2l5-5 5 5a2 2 0 003-2V10h14v30zM28 14h8v4h-8v-4zm0 8h8v4h-8v-4zm-16 8h24v4H12v-4z',
    checkin: 'M12 4v40h4V27l26-9a2 2 0 000-4L12 4zm4 19V9l20 7-20 7z',
    event: 'M40 10h-2V4h-4v10h-2v-4H18V4h-4v10h-2v-4H8c-2 0-4 2-4 4v26c0 2 2 4 4 4h32c2 0 4-2 4-4V14c0-2-2-4-4-4zm0 30H8V18h32v22z',
    like: 'M32 16V8l-2-2h-6l-2 1-5 13h-1l-2-2H6l-2 2v20l2 2h8l2-2v-1l8 3h15l3-2 4-20a3 3 0 00-3-4H32zM12 38H8V22h4v16zm26 0H25l-9-3V24h2l2-1 6-13h2v8l2 2h12l-4 18z',
    note: 'M40 4H8C6 4 4 6 4 8v32c0 2 2 4 4 4h32c2 0 4-2 4-4V8c0-2-2-4-4-4zm0 36H8V8h32v32zM12 14h24v4H12v-4zm0 8h24v4H12v-4zm0 8h18v4H12v-4z',
    photo: 'M40 4H8C6 4 4 6 4 8v32c0 2 2 4 4 4h32c2 0 4-2 4-4V8c0-2-2-4-4-4zm0 36H8V8h32v32zm-4-8l-9-14-7 11-3-5-5 8h24z',
    reply: 'M12 44v-8H8c-2 0-4-2-4-4V8c0-2 2-4 4-4h32c2 0 4 2 4 4v24c0 2-2 4-4 4H23l-11 8zM8 8v24h8v4l5-4h19V8H8z',
    repost: 'M36 10c2 0 4 2 4 4v20c0 2-2 4-4 4h-8v6l-8-8 8-8v6h8V14h-4v-4zM20 4l8 8-8 8v-6h-8v20h4v4h-4c-2 0-4-2-4-4V14c0-2 2-4 4-4h8V4z',
    rsvp: 'M40 10h-2V4h-4v10h-2v-4H18V4h-4v10h-2v-4H8c-2 0-4 2-4 4v26c0 2 2 4 4 4h32c2 0 4-2 4-4V14c0-2-2-4-4-4zm0 30H8V18h32v22zM25 26h-3l3-2-3-3-8 7 8 8 3-3-3-3h3c2 0 4 2 4 4v2h4v-2c0-4-3-8-8-8z',
    video: 'M40 4H8C6 4 4 6 4 8v32c0 2 2 4 4 4h32c2 0 4-2 4-4V8c0-2-2-4-4-4zm0 36H8V8h32v32zM20 30l12-6-12-6v12zM10 10h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zM10 34h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4z'
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 48 48">
    <path d="${paths[name]}"/>
  </svg>`;

  const icon = svg.replace(/(\s{2,}|\r\n\t|\n|\r\t)/gm, '');

  return icon;
};
