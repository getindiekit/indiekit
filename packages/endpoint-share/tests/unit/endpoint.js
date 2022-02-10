import test from "ava";
import { ShareEndpoint } from "../../index.js";

test("Gets mount path", (t) => {
  const result = new ShareEndpoint();

  t.is(result.mountPath, "/share");
});
