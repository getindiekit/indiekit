import test from "ava";
import { SyndicateEndpoint } from "../../index.js";

test("Gets mount path", (t) => {
  const result = new SyndicateEndpoint();

  t.is(result.mountPath, "/syndicate");
});
