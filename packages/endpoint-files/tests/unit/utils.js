import test from "ava";
import { getFileName, getFileUrl } from "../../lib/utils.js";

test("Gets file name from a URL", (t) => {
  t.is(getFileName("http://foo.bar/baz.jpg"), "baz.jpg");
  t.is(getFileName("http://foo.bar/bar/qux.mp3"), "qux.mp3");
});

test("Gets file URL", (t) => {
  t.is(
    getFileUrl("aHR0cHM6Ly93ZWJzaXRlLmV4YW1wbGUvZm9vYmFy"),
    "https://website.example/foobar",
  );
});
