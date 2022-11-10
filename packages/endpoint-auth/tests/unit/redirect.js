import test from "ava";
import { validateRedirect } from "../../lib/redirect.js";

test("Validates `redirect_uri`", (t) => {
  t.true(
    validateRedirect(
      "https://client.example:3000",
      "https://client.example:3000/redirect"
    )
  );
  t.false(
    validateRedirect(
      "https://client.example:3000",
      "https://client.example:8080/redirect"
    )
  );
  t.false(
    validateRedirect(
      "https://client.example",
      "https://www.client.example/redirect"
    )
  );
});
