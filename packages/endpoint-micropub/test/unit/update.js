import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  addProperties,
  deleteEntries,
  deleteProperties,
  replaceEntries,
} from "../../lib/update.js";

const properties = {
  content: "hello world",
  published: "2019-08-17T23:56:38.977+01:00",
  category: "foo",
  "mp-slug": "baz",
};

describe("endpoint-media/lib/update", () => {
  it("Add properties to object", () => {
    const additions = { syndication: ["http://website.example"] };
    const result = addProperties(properties, additions);

    assert.deepEqual(result.syndication, ["http://website.example"]);
  });

  it("Add properties to existing value", () => {
    const additions = { category: ["bar"] };
    const result = addProperties(properties, additions);

    assert.deepEqual(result.category, ["foo", "bar"]);
  });

  it("Add properties to existing array", () => {
    const additions = { category: ["baz"] };
    const result = addProperties(
      {
        category: ["foo", "bar"],
      },
      additions,
    );

    assert.deepEqual(result.category, ["foo", "bar", "baz"]);
  });

  it("Deletes entries for properties of object", () => {
    const properties = {
      name: "Lunchtime",
      category: ["foo", "bar"],
    };
    const result = deleteEntries(properties, { category: ["foo"] });

    assert.deepEqual(result, {
      name: "Lunchtime",
      category: ["bar"],
    });
  });

  it("Deletes entries for properties of object (removing property if last entry removed)", () => {
    const properties = {
      name: "Lunchtime",
      category: ["foo", "bar"],
    };
    const result = deleteEntries(properties, { category: ["foo", "bar"] });

    assert.deepEqual(result, {
      name: "Lunchtime",
    });
  });

  it("Deletes entries for properties of object (ignores properties that don’t exist)", () => {
    const properties = {
      name: "Lunchtime",
      category: ["foo", "bar"],
    };
    const result = deleteEntries(properties, { tags: ["foo", "bar"] });

    assert.deepEqual(result, {
      name: "Lunchtime",
      category: ["foo", "bar"],
    });
  });

  it("Throws error requested deletion is not an array", () => {
    const properties = { name: "Lunchtime" };

    assert.throws(
      () => {
        deleteEntries(properties, { category: "foo" });
      },
      {
        message: "category should be an array",
      },
    );
  });

  it("Deletes property", () => {
    const properties = {
      name: "Lunchtime",
      category: ["foo", "bar"],
    };
    const result = deleteProperties(properties, ["category"]);

    assert.deepEqual(result, {
      name: "Lunchtime",
    });
  });

  it("Replaces property value", async () => {
    const properties = { name: "Lunchtime" };
    const result = await replaceEntries(properties, { name: ["Dinnertime"] });

    assert.deepEqual(result, {
      name: "Dinnertime",
    });
  });

  it("Replaces nested vocabulary values", async () => {
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

    assert.deepEqual(result, {
      name: "Dinnertime",
      location: {
        type: "geo",
        latitude: 52,
        longitude: -2,
      },
    });
  });

  it("Replaces property value (multiple items saved as array)", async () => {
    const properties = { category: ["foo"] };
    const result = await replaceEntries(properties, {
      category: ["bar", "baz"],
    });

    assert.deepEqual(result, {
      category: ["bar", "baz"],
    });
  });

  it("Replaces property value (adding if doesn’t exist)", async () => {
    const properties = { name: "Lunchtime" };
    const result = await replaceEntries(properties, {
      content: ["I ate a cheese sandwich"],
    });

    assert.deepEqual(result, {
      name: "Lunchtime",
      content: "I ate a cheese sandwich",
    });
  });

  it("Replaces property value (ignores empty array)", async () => {
    const properties = { name: "Lunchtime" };
    const result = await replaceEntries(properties, {
      content: [],
    });

    assert.deepEqual(result, {
      name: "Lunchtime",
    });
  });

  it("Throws error replacement is not an array", async () => {
    const properties = { name: "Lunchtime" };

    await assert.rejects(replaceEntries(properties, { name: "Dinnertime" }), {
      message: "Replacement value should be an array",
    });
  });
});
