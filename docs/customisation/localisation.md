---
parent: Customisation
nav_order: 6
---

# Localisation

## Change the application’s locale

Indiekit has been localised into the following languages:

* `en-US`: US English
* `de-DE`: Deutsch (with contributions from [Andreas Fink](https://github.com/AFink))
* `fr-FR`: Français (with contributions from David Legrand)

You can change the application’s locale by changing the `application.locale` option, for example:

```js
indiekit.set('application.locale', 'de-DE');
```

## Contribute a new localisation

There are currently 4 packages that need to be localised:

* `endpoint-media`
* `endpoint-micropub`
* `endpoint-share`
* `indiekit`

Each package has a `locales` folder. You’ll find the other locales in this folder - use one of these as an example to work from.

If you wanted to contribute a Dutch localisation (which uses the ISO???? code `nl`), you would need to do the following:

* Add `/locales/nl.js` - the localisation file

* Update `/locales/index.js` to link to your new localisation file:

  ```diff
    import {de} from './de.js';
    import {en} from './en.js';
    import {fr} from './fr.js';
  + import {nl} from './nl.js';

  - export const locales = {de, en, fr};
  + export const locales = {de, en, fr, nl};
  ```

* For plugin packages (all packages except `indiekit`), you need to register your new locale in the package’s root `index.js` file (i.e. `packages/endpoint-media/index.js`):

```diff
  ...
  indiekitConfig.addLocale('de', locales.de);
  indiekitConfig.addLocale('en', locales.en);
  indiekitConfig.addLocale('fr', locales.fr);
+ indiekitConfig.addLocale('nl', locales.nl);
```

Commit your changes and [open a PR on the main project repository](https://github.com/getindiekit/indiekit).
