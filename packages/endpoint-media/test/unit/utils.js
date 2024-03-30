import { strict as assert } from "node:assert";
import { before, describe, it, mock } from "node:test";
import { renderPath } from "../../lib/utils.js";

describe("endpoint-media/lib/util", () => {
  const properties = {
    ext: "jpg",
    filename: "Foo 1.jpg",
    md5: "be7d321488de26f2eb38834af7162164",
    published: "2020-01-01",
  };

  before(() => {
    mock.method(console, "info", () => {});
    mock.method(console, "warn", () => {});
  });

  it("Renders path from URI template and properties", async () => {
    const dateToken = await renderPath("{yyyy}/{MM}", properties, {}, "-");
    const fileToken = await renderPath("{filename}", properties, {}, "-");
    const md5Token = await renderPath("{md5}", properties, {}, "-");

    assert.match(dateToken, /^\d{4}\/\d{2}/);
    assert.match(fileToken, /^foo-1\.jpg/);
    assert.match(md5Token, /^([\da-f]{32}|[\dA-F]{32})$/);
  });
});
