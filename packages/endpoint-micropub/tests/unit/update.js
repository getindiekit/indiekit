import test from "ava";
import {
  addProperties,
  deleteEntries,
  deleteProperties,
  replaceEntries,
} from "../../lib/update.js";

test.beforeEach((t) => {
  t.context.properties = {
    content: "hello world",
    published: "2019-08-17T23:56:38.977+01:00",
    category: "foo",
    "mp-slug": "baz",
  };
});

test("Add properties to object", (t) => {
  const additions = { syndication: ["http://website.example"] };
  const result = addProperties(t.context.properties, additions);

  t.deepEqual(result.syndication, ["http://website.example"]);
});

test("Add properties to existing value", (t) => {
  const additions = { category: ["bar"] };
  const result = addProperties(t.context.properties, additions);

  t.deepEqual(result.category, ["foo", "bar"]);
});

test("Add properties to existing array", (t) => {
  const additions = { category: ["baz"] };
  const result = addProperties(
    {
      category: ["foo", "bar"],
    },
    additions
  );

  t.deepEqual(result.category, ["foo", "bar", "baz"]);
});

test("Deletes entries for properties of object", (t) => {
  const properties = {
    name: "Lunchtime",
    category: ["foo", "bar"],
  };
  const result = deleteEntries(properties, { category: ["foo"] });

  t.deepEqual(result, {
    name: "Lunchtime",
    category: ["bar"],
  });
});

test("Deletes entries for properties of object (removing property if last entry removed)", (t) => {
  const properties = {
    name: "Lunchtime",
    category: ["foo", "bar"],
  };
  const result = deleteEntries(properties, { category: ["foo", "bar"] });

  t.deepEqual(result, {
    name: "Lunchtime",
  });
});

test("Deletes entries for properties of object (ignores properties that don’t exist)", (t) => {
  const properties = {
    name: "Lunchtime",
    category: ["foo", "bar"],
  };
  const result = deleteEntries(properties, { tags: ["foo", "bar"] });

  t.deepEqual(result, {
    name: "Lunchtime",
    category: ["foo", "bar"],
  });
});

test("Throws error requested deletion is not an array", (t) => {
  const properties = { name: "Lunchtime" };

  t.throws(
    () => {
      deleteEntries(properties, { category: "foo" });
    },
    {
      message: "category should be an array",
    }
  );
});

test("Deletes property", (t) => {
  const properties = {
    name: "Lunchtime",
    category: ["foo", "bar"],
  };
  const result = deleteProperties(properties, ["category"]);

  t.deepEqual(result, {
    name: "Lunchtime",
  });
});

test("Replaces property value", async (t) => {
  const properties = { name: "Lunchtime" };
  const result = await replaceEntries(properties, { name: ["Dinnertime"] });

  t.deepEqual(result, {
    name: "Dinnertime",
  });
});

test("Replaces nested vocabulary values", async (t) => {
  const properties = {
    name: "Lunchtime",
    location: {
      type: "geo",
      latitude: 50,
      longitude: 0,
    },
  };
  const result = await replaceEntries(properties, {
    name: ["Dinnertime"],
    location: [
      {
        type: ["h-geo"],
        properties: {
          latitude: [52],
          longitude: [-2],
        },
      },
    ],
  });

  t.deepEqual(result, {
    name: "Dinnertime",
    location: {
      type: "geo",
      latitude: 52,
      longitude: -2,
    },
  });
});

test("Replaces property value (multiple items saved as array)", async (t) => {
  const properties = { category: ["foo"] };
  const result = await replaceEntries(properties, { category: ["bar", "baz"] });

  t.deepEqual(result, {
    category: ["bar", "baz"],
  });
});

test("Replaces property value (adding if doesn’t exist)", async (t) => {
  const properties = { name: "Lunchtime" };
  const result = await replaceEntries(properties, {
    content: ["I ate a cheese sandwich"],
  });

  t.deepEqual(result, {
    name: "Lunchtime",
    content: "I ate a cheese sandwich",
  });
});

test("Replaces property value (ignores empty array)", async (t) => {
  const properties = { name: "Lunchtime" };
  const result = await replaceEntries(properties, {
    content: [],
  });

  t.deepEqual(result, {
    name: "Lunchtime",
  });
});

test("Throws error replacement is not an array", async (t) => {
  const properties = { name: "Lunchtime" };

  await t.throwsAsync(replaceEntries(properties, { name: "Dinnertime" }), {
    message: "Replacement value should be an array",
  });
});
