# Localisation

## Change the application’s locale

Indiekit has been localised into the following languages:

- `en`: US English
- `de`: Deutsch (with contributions from [Andreas Fink](https://github.com/AFink))
- `es`: Español (with contributions from [Anthony Ciccarello](https://github.com/aciccarello))
- `es-419`: Español (Latin American Spanish, with contributions from Claudia Botero)
- `fr`: Français (with contributions from David Legrand)
- `hi`: हिन्दी (Hindi, with contributions from Sesa Malinda)
- `id`: bahasa Indonesia (with contributions from Zeky Chandra)
- `it`: Italiano (with contributions from [Giacomo Debidda](https://github.com/jackdbd))
- `nl`: Nederlands
- `pl`: Polski (with contributions from Arookei The Wolf)
- `pt`: Português
- `sr`: Srpski (with contributions from Anđela Radojlović)
- `sv`: Svenska (with contributions from [Carl Räfting](https://github.com/carlrafting))
- `zh-Hans-CN`: 中文 (Simplified Chinese, with contributions from [Xie Yanbo](https://github.com/xyb) and [藍](https://github.com/kwaa))

You can change the application’s locale by changing the `application.locale` option, for example:

::: code-group

```json [JSON]
{
  "application": {
    "locale": "de"
  }
}
```

```js [JavaScript]
export default {
  application: {
    locale: "de"
  }
}
```

:::

## Contribute a new localisation

Localisations are managed using Localazy. If you see a translation that is not quite right, or would like to add support for a new language, create an account and [contribute to the project](https://localazy.com/p/indiekit).
