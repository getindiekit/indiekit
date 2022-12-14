import test from "ava";
import { getFixture } from "@indiekit-test/fixtures";
import { jf2ToMf2 } from "../../lib/mf2.js";

test("Convert JF2 to mf2", (t) => {
  const jf2 = JSON.parse(getFixture("jf2/article-content-provided-text.jf2"));

  t.deepEqual(jf2ToMf2(jf2), {
    properties: {
      name: ["What I had for lunch"],
      content: [{ value: "I ate a *cheese* sandwich, which was nice." }],
    },
    type: ["h-entry"],
  });
});
