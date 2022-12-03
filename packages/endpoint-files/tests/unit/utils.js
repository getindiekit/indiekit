import test from "ava";
import { getFileName } from "../../lib/utils.js";

test("Gets file name from a URL", (t) => {
  t.is(getFileName("http://foo.bar/baz.jpg"), "baz.jpg");
  t.is(getFileName("http://foo.bar/bar/qux.mp3"), "qux.mp3");
});
