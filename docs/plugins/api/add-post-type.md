---
outline: deep
---

# `Indiekit.addPostType`

A [post type](../../concepts.md#post-type) defines fields for creating and editing different post (or content) types, either using Indiekit or via third-party Micropub clients.

> [!TIP] New feature
> Post type plug-ins will be introduced in <Badge text="1.0.0-beta.8" />

## Syntax

```js
new Indiekit.addPostType(type, options);
```

## Constructor

`type`
: A string representing the name of the post type.

`options`
: An object used to customise the behaviour of the plug-in.

## Properties

`config` <Badge type="info" text="Required" />
: An object providing a post type’s configuration.

  `name`
  : A string representing the post type name.

  `h`
  : A string representing the [Microformat vocabulary](http://microformats.org/wiki/microformats2#v2_vocabularies) to use. Defaults to `entry`.

  `fields` <Badge type="info" text="Required" />
  : An object containing [FieldType](#postfield) objects, keyed by field name.

  `discovery`
  : A string representing the field name to use when identifying incoming Micropub requests.

    The value must match one of the field names provided in `config.fields`.

    In most cases this option is required. Only post types already defined in the [post type discovery][] algorithm (`article`, `event`, `like`, `note`, `photo`, `repost`, `rsvp`, `reply` and `video`) can ignore this option.

`validationSchemas`
: An object containing [Schema](#postfield) objects.

## Interfaces

### `FieldType`

`required`
: A boolean indicating if a field is required. Micropub clients may use this value in their publishing interfaces. Indiekit will use this property to check for validation errors when creating or editing a post.

### `Schema`

[Learn about schema validation in the express-validator documentation](https://express-validator.github.io/docs/guides/schema-validation):

> Schemas are an object-based way of defining validations or sanitizations on requests.

## Example

```js
export default class RecipePostType {
  constructor() {
    this.name = "Recipe post type";
  }

  get config() {
    return {
      name: "Recipe",
      h: "recipe",
      fields: {
        name: { required: true },
        ingredient: { required: true },
        instructions: { required: true },
        category: {}
      },
      discovery: "ingredient"
    };
  }

  get validationSchemas() {
    return {
      "ingredient": {
        errorMessage: (value, { req }) => 'Add some ingredients',
        exists: { if: (value, { req }) => isRequired(req, "ingredient") },
        notEmpty: true,
      },
      "instructions": {
        errorMessage: (value, { req }) => 'Add instructions',
        exists: { if: (value, { req }) => isRequired(req, "instructions") },
        notEmpty: true,
      }
    }
  }

  init(Indiekit) {
    Indiekit.addPostType("recipe", this);
  }
}
```

### Add a name

Indiekit and other Micropub clients can display this value in their publishing interfaces, for example in interfaces asking a user which type of post they would like to create, or filtering posts by type.

As such, you should provide a short name. In most cases, this will be the same as the `type` name, but capitalised.

The post type name can be added to `config.name`, for example:

```js
get config() {
  return {
    name: "Recipe"
  };
}
```

### Choose a vocabulary

Post types belong to a Microformat’s vocabulary. In most cases this will by `h-entry`, but another vocabulary might be more suited to a given post type. For example, for recipe posts, you might use [the `h-recipe` vocabulary](http://microformats.org/wiki/h-recipe).

A post type’s vocabulary can be set using `config.h`, for example:

```js
get config() {
  return {
    h: "recipe"
  };
}
```

### Create post fields

Post fields dictate a number of tasks:

- which input fields are shown when creating or editing a post
- which properties appear when viewing a post
- which properties are included in a post template
- which properties are supported for the post type when responding to [a query from a third-party Micropub client](https://github.com/indieweb/micropub-extensions/issues/33)

Indiekit provides automatic support for the following field types:

- `category`
- `content`
- `geo`
- `location`
- `name`
- `summary`

Installing other post type plug-ins will add to this list, and these fields can be shared by other post type plug-ins.

Any new fields will need to be provided by the post type plug-in. To add a new field, you need to supply:

- a field name
- and input field for Indiekit’s editing interface
- a way of displaying the field in Indiekit’s interface
- optional validation

Fields can be added to `config.fields`, for example:

```js
get config() {
  return {
    fields: {
      name: { required: true },
      ingredient: { required: true },
      instructions: { required: true },
      category: {}
    }
  };
}
```

Adding `required` means this field can use a validation schema before publishing.

If your post type includes custom fields, you need to provide the following:

- To display a field, include a Nunjucks file at `/includes/post-types/[field-name].njk`.
- To edit a field, include a Nunjucks file at `/includes/post-types/[field-name]-field.njk`.

In the above example, because both `ingredient` and `instructions` are new field types, the post type plug-in would need to provide Nunjucks template partials:

- `/includes/post-types/ingredient.njk`
- `/includes/post-types/ingredient-field.njk`
- `/includes/post-types/instructions.njk`
- `/includes/post-types/instructions-field.njk`

### Enable post type discovery

When receiving Micropub requests from other clients, Indiekit needs to know what post type to assign given the properties in that request. The [post type discovery] algorithm handles this for common post types, but new post types need to be identified using another means.

Indicating which property a post type will have that others won’t is a way of achieving this.

The property to use for discovery can be added to `config.discovery`, for example:

```js
get config() {
  return {
    discovery: "ingredients"
  };
}
```

### Add validation schemas

To check that required values entered into field inputs in Indiekit’s interface exist (if required) or match an expected value, a post type plug-in can supply a [validation schema](https://express-validator.github.io/docs/guides/schema-validation).

For example, to check that a recipe post type includes values for the `ingredients` and `instructions` fields, you could provide the following for `validationSchemas`:

```js
get validationSchemas() {
  return {
    "ingredient": {
      errorMessage: (value, { req }) => 'Add some ingredients',
      exists: { if: (value, { req }) => isRequired(req, "ingredient") },
      notEmpty: true,
    },
    "instructions": {
      errorMessage: (value, { req }) => 'Add instructions',
      exists: { if: (value, { req }) => isRequired(req, "instructions") },
      notEmpty: true,
    }
  }
}
```

## See also

Example publication preset plug-in implementations:

- [`@indiekit/post-type-jam`](https://github.com/getindiekit/indiekit/tree/main/packages/post-type-jam) adds a jam post type, used to share songs you are currently enjoying.

- [`@indiekit/post-type-event`](https://github.com/getindiekit/indiekit/tree/main/packages/post-type-event) adds an event post type, used to publish events that you are planning to attend or previously attended.

[post type discovery]: https://www.w3.org/TR/post-type-discovery/
