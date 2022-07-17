import test from "ava";
import { getNavigation } from "../../lib/navigation.js";

test.beforeEach((t) => {
  t.context.application = {
    hasDatabase: false,
    installedPlugins: [],
    locale: "en",
    endpoints: [
      {
        id: "foo",
        name: "Foo plugin",
        navigationItems: [
          {
            href: "/foo",
            text: "Foo",
            requiresDatabase: true,
          },
          {
            href: "/bar",
            text: "Bar",
          },
        ],
      },
    ],
  };
});

test("Returns logged out navigation", (t) => {
  const result = getNavigation(
    t.context.application,
    {
      session: {},
    },
    {
      __: (string) => string,
    }
  );

  t.is(result[1].href, "/session/login");
});

test("Removes navigation items that require a database", (t) => {
  const result = getNavigation(
    t.context.application,
    {
      session: {},
    },
    {
      __: (string) => string,
    }
  );

  t.not(result[0].href, "/foo");
  t.is(result[0].href, "/bar");
});

test("Returns logged in navigation", (t) => {
  const result = getNavigation(
    t.context.application,
    {
      session: {
        access_token: "token",
      },
    },
    {
      __: (string) => string,
    }
  );

  t.is(result[1].href, "/session/logout");
});
