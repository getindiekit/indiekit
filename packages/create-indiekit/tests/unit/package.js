import test from "ava";
import sinon from "sinon";
import { getPackageValues } from "../../lib/package.js";

test("Gets package values", async (t) => {
  sinon.stub(console, "info");

  const result = await getPackageValues({
    me: "https://website.example",
    presetPlugin: "@indiekit/preset-jekyll",
    storePlugin: "@indiekit-test/store",
    syndicationPlugins: [],
  });

  t.deepEqual(result, {
    config: {
      plugins: ["@indiekit/preset-jekyll", "@indiekit-test/store"],
      publication: {
        me: "https://website.example",
      },
    },
    dependencies: [
      "@indiekit/indiekit",
      "@indiekit/preset-jekyll",
      "@indiekit-test/store",
    ],
  });
});
