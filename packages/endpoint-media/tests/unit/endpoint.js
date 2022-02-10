import test from "ava";
import { MediaEndpoint } from "../../index.js";

test("Gets mount path", (t) => {
  const result = new MediaEndpoint();

  t.is(result.mountPath, "/media");
});
