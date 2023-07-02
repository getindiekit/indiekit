# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.4](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2023-07-02)


### Bug Fixes

* **endpoint-media:** correctly parse limit/offset query ([c21981e](https://github.com/getindiekit/indiekit/commit/c21981e4a4dc297be9671db71c5de277a6804d2a))
* **endpoint-media:** only add data to configured database ([ad554f8](https://github.com/getindiekit/indiekit/commit/ad554f8a2753f21821d9de200d6872b604dc8ec5))
* **endpoint-media:** respond once to source query ([7ca788e](https://github.com/getindiekit/indiekit/commit/7ca788ec77e1df617a49480c00f36a1c24a1b5cc))


### Features

* **endpoint-media:** add post count token ([ff0578e](https://github.com/getindiekit/indiekit/commit/ff0578ee8a3f2fdb3f2e18abf2625c12408320f2))
* **endpoint-media:** cursor-based pagination ([f2a1667](https://github.com/getindiekit/indiekit/commit/f2a166746b19fef63e3196e55ca9871377ffe66d))
* **endpoint-media:** use media-type property ([3a6a008](https://github.com/getindiekit/indiekit/commit/3a6a008e57245892a3f3d16d65b514c47aae3d84))
* move timeZone option to application ([a72ff74](https://github.com/getindiekit/indiekit/commit/a72ff74a0e32bf56b1cd697cb3989dee3be99b17))





# [1.0.0-beta.3](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2023-05-19)


### Bug Fixes

* **endpoint-media:** don’t require database to query config. fixes [#600](https://github.com/getindiekit/indiekit/issues/600) ([edbfc15](https://github.com/getindiekit/indiekit/commit/edbfc15528ecfae6af9e489f21c31c96ea968340))


### Features

* **endpoint-media:** update database before content store ([38d39a5](https://github.com/getindiekit/indiekit/commit/38d39a5bf678a2f30ba701a989b36f327e1712e5))





# [1.0.0-beta.1](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2022-12-28)

**Note:** Version bump only for package @indiekit/endpoint-media

# [1.0.0-beta.0](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.18...v1.0.0-beta.0) (2022-12-17)

### Features

- **endpoint-media:** change colour of plugin icon ([1b8a565](https://github.com/getindiekit/indiekit/commit/1b8a5656bb78e33379fe3a47b21359fa8e191340))

# [1.0.0-alpha.18](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2022-12-14)

### Features

- **endpoint-media:** sort source query by published date ([6bf5e7a](https://github.com/getindiekit/indiekit/commit/6bf5e7a6d18a0f14d35176b9a63963dd442b7f81))

# [1.0.0-alpha.17](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2022-12-07)

### Bug Fixes

- **endpoint-media:** delete record from database ([3dff8ff](https://github.com/getindiekit/indiekit/commit/3dff8ff6fb9f85eb80718ac916fdbf09e61bbd0a))

### Features

- **endpoint-media:** check scope against multiple actions ([144d06c](https://github.com/getindiekit/indiekit/commit/144d06cb72f502f4b0b369cb8b90ab9082663b97))
- **endpoint-media:** delete media action ([bf2ea72](https://github.com/getindiekit/indiekit/commit/bf2ea72aa942c6c22620476a39f46019c3a16950))
- **endpoint-media:** don’t record last action ([5b12042](https://github.com/getindiekit/indiekit/commit/5b12042dc1705e20c6a2ef640196583249646cfb))
- **endpoint-media:** remove path components from source query response ([d8ae9cb](https://github.com/getindiekit/indiekit/commit/d8ae9cb3f478732134ef46798cdc2149f5f145e9))

# [1.0.0-alpha.16](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2022-12-02)

**Note:** Version bump only for package @indiekit/endpoint-media

# [1.0.0-alpha.13](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2022-11-23)

### Features

- **endpoint-authorization:** indieauth endpoint. fixes [#499](https://github.com/getindiekit/indiekit/issues/499) ([b58bcce](https://github.com/getindiekit/indiekit/commit/b58bcce678b12a9cf77d4272fac981125ccdc314))
- **endpoint-media:** plugin icon ([976ad44](https://github.com/getindiekit/indiekit/commit/976ad44ace497a62eb501fc61633ef1141bbb0df))

# [1.0.0-alpha.12](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2022-07-15)

**Note:** Version bump only for package @indiekit/endpoint-media

# [1.0.0-alpha.10](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2022-07-12)

**Note:** Version bump only for package @indiekit/endpoint-media

# [1.0.0-alpha.9](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2022-07-12)

### Features

- **endpoint-media:** localise insufficient scope error ([a42f780](https://github.com/getindiekit/indiekit/commit/a42f7803ac4cea96589ea68ab95348b42ee9c77a))
- **endpoint-media:** localise upload errors ([d6121ab](https://github.com/getindiekit/indiekit/commit/d6121ab04afadf6820600192494147143b48cdb9))
- **endpoint-media:** remove unused read method on mediaData ([3c37ce3](https://github.com/getindiekit/indiekit/commit/3c37ce3212701b70998cdede4e8b90a770e46087))
- **endpoint-media:** use custom error handler ([f4f7193](https://github.com/getindiekit/indiekit/commit/f4f7193abe87510a10d18eebc5537506dad23455))

# [1.0.0-alpha.7](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2022-06-17)

### Bug Fixes

- **endpint-media:** error in error response ([08e25f0](https://github.com/getindiekit/indiekit/commit/08e25f01117c7b6c75b89aaf52fed8e959779e71))

# [1.0.0-alpha.6](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2022-06-14)

### Features

- **endpoint-media:** query configured media endpoint api ([ad8069d](https://github.com/getindiekit/indiekit/commit/ad8069d93a69a69985369ded8f4447217d438ca7))
- **endpoint-media:** remove frontend interface ([34b1ef3](https://github.com/getindiekit/indiekit/commit/34b1ef391d9697416665f33d8549159c161ff136))

# [1.0.0-alpha.5](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2022-06-08)

### Bug Fixes

- correct file paths when views have a query string ([1457773](https://github.com/getindiekit/indiekit/commit/14577736648d7800a0592b31f0c66034502f968a))

### Features

- require node.js v18 ([a7408db](https://github.com/getindiekit/indiekit/commit/a7408db7c3430cf51b76e793c5718245a7cae03c))

# [1.0.0-alpha.0](https://github.com/getindiekit/indiekit/compare/v0.3.0...v1.0.0-alpha.0) (2022-05-20)

### Bug Fixes

- **endpoint-media:** throw useful errors when creating data ([d2ab6f4](https://github.com/getindiekit/indiekit/commit/d2ab6f4143b1e53c727eb076e1a691ff7788b230))

### Features

- add Indonesian localisation from Zeky Chandra ([e5508f1](https://github.com/getindiekit/indiekit/commit/e5508f14bde8951b691e56490117552268c9c232))
- add Spanish translation from [@aciccarello](https://github.com/aciccarello) ([e556ada](https://github.com/getindiekit/indiekit/commit/e556ada815873d04b2147556c42198dcc1b3ccaa))
- enable all plug-ins to include an assets path ([d1083ab](https://github.com/getindiekit/indiekit/commit/d1083ab55e60a607377d7e3f3ca70c269637f770))
- **endpoint-media:** show icon if media not found ([744ff7d](https://github.com/getindiekit/indiekit/commit/744ff7d1ed57614e60b4627341d19320ed33702d))
- **endpoint-media:** show media in files view ([dc40f79](https://github.com/getindiekit/indiekit/commit/dc40f79481d1990b158c9aa75bd88ba0968912e0))
- **endpoint-media:** show media in files view ([24981cc](https://github.com/getindiekit/indiekit/commit/24981cc465b9cb088925a017bc3833ad0398aace))
- **frontend:** global to generate pagination data ([30b6d7c](https://github.com/getindiekit/indiekit/commit/30b6d7ca7a79d8252853a1a9ed9c08ca18ddbc21))
- **indiekit:** refactor config loading and format. fixes [#402](https://github.com/getindiekit/indiekit/issues/402) ([65ff927](https://github.com/getindiekit/indiekit/commit/65ff9273062cdeccda35a20aa2b24cf812e93111))
- register defined view directories for plug-ins ([77eeed2](https://github.com/getindiekit/indiekit/commit/77eeed2543feec92fde112f23c2f26b1b456a572))

# [0.3.0](https://github.com/getindiekit/indiekit/compare/v0.2.0...v0.3.0) (2022-02-06)

### Features

- add default exports for plug-ins ([8518285](https://github.com/getindiekit/indiekit/commit/85182856c93bb733bd98f2f221c529ca299869b8))
- **indiekit:** use localazy localisation service ([004caa0](https://github.com/getindiekit/indiekit/commit/004caa044ea9c71835108c4347ec918ceefbb399))
- plug-ins no longer need to add locales ([e489594](https://github.com/getindiekit/indiekit/commit/e489594dd377ce793cbeac34fa12d20fd8f6301a))

# [0.2.0](https://github.com/getindiekit/indiekit/compare/v0.1.4...v0.2.0) (2021-12-19)

**Note:** Version bump only for package @indiekit/endpoint-media

## [0.1.4](https://github.com/getindiekit/indiekit/compare/v0.1.3...v0.1.4) (2021-08-01)

### Bug Fixes

- throw error if feature requires database. fixes [#358](https://github.com/getindiekit/indiekit/issues/358) ([9316eaa](https://github.com/getindiekit/indiekit/commit/9316eaa1c87903fc1df0c4bbb1b800ad2b043773))

## [0.1.1](https://github.com/getindiekit/indiekit/compare/v0.1.0...v0.1.1) (2021-05-16)

### Bug Fixes

- media uploads failing. fixes [#343](https://github.com/getindiekit/indiekit/issues/343) ([3ad644d](https://github.com/getindiekit/indiekit/commit/3ad644d790345abe14335715666f2cb44403318b))

# [0.1.0](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.23...v0.1.0) (2021-03-15)

**Note:** Version bump only for package @indiekit/endpoint-media

# [0.1.0-alpha.22](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2021-02-19)

### Features

- **endpoint-media:** show message when no files to show ([6110ff1](https://github.com/getindiekit/indiekit/commit/6110ff1fe93bd9f7274764bac88fcc36cee58ce0))

# [0.1.0-alpha.21](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2021-02-01)

### Features

- abstract `summaryRow` filter for post and file views ([f32e28c](https://github.com/getindiekit/indiekit/commit/f32e28ce2640c6c3319276bbfbb077220a0e4b9e))

# [0.1.0-alpha.20](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2021-01-07)

### Bug Fixes

- show 404 page if item not found in database ([f737d0a](https://github.com/getindiekit/indiekit/commit/f737d0af58970f8426711e773eb4360e8e4595a3))
- **endpoint-micropub:** fix content display error ([1d33c94](https://github.com/getindiekit/indiekit/commit/1d33c94bff923127b47ed34e3e0d8d30055abc94))

# [0.1.0-alpha.19](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2021-01-03)

### Bug Fixes

- always use mp-slug key for slug property ([49a2bf1](https://github.com/getindiekit/indiekit/commit/49a2bf1f4df3e0a67f7a0ad693bedef1e8c59928))

# [0.1.0-alpha.15](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2020-12-28)

**Note:** Version bump only for package @indiekit/endpoint-media

# [0.1.0-alpha.14](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2020-11-16)

**Note:** Version bump only for package @indiekit/endpoint-media

# [0.1.0-alpha.12](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.10...v0.1.0-alpha.12) (2020-10-29)

### Bug Fixes

- **endpoint-media:** correctly identify dates without a time ([52066f3](https://github.com/getindiekit/indiekit/commit/52066f303599b9865bddc8c9b38fc787568c52d6))

### Features

- french translation ([ccb0eea](https://github.com/getindiekit/indiekit/commit/ccb0eea1a19c9051d3d400be107920838ef5d8fc))

# [0.1.0-alpha.11](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2020-10-12)

### Bug Fixes

- **endpoint-media:** correctly identify dates without a time ([52066f3](https://github.com/getindiekit/indiekit/commit/52066f303599b9865bddc8c9b38fc787568c52d6))

### Features

- french translation ([ccb0eea](https://github.com/getindiekit/indiekit/commit/ccb0eea1a19c9051d3d400be107920838ef5d8fc))

# [0.1.0-alpha.10](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2020-10-03)

### Bug Fixes

- correct time zone implementation. fixes [#294](https://github.com/getindiekit/indiekit/issues/294) ([a6f30b1](https://github.com/getindiekit/indiekit/commit/a6f30b1d93ec7a39fda5aa7f6933fc8f699b9bc2))
- german translations ([#293](https://github.com/getindiekit/indiekit/issues/293)) ([3dfdf76](https://github.com/getindiekit/indiekit/commit/3dfdf766e77bdd62cb282668f82e1f9f6252e0f8))

# [0.1.0-alpha.9](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2020-09-28)

### Bug Fixes

- use timezone for path tokens ([0618656](https://github.com/getindiekit/indiekit/commit/06186568d9de9d333c70ab8a488685ec51ad3b3e))
- **endpoint-media:** correct time zone handling. fixes [#288](https://github.com/getindiekit/indiekit/issues/288) ([3dc5f09](https://github.com/getindiekit/indiekit/commit/3dc5f0955c7acfc56ab56b7ffc099d89ab32c605))

# [0.1.0-alpha.8](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2020-09-20)

**Note:** Version bump only for package @indiekit/endpoint-media

# [0.1.0-alpha.7](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2020-09-19)

### Bug Fixes

- list missing files in package.json ([fa48e0b](https://github.com/getindiekit/indiekit/commit/fa48e0be7473cd0da7a4af395b664355c73bdf02))

# [0.1.0-alpha.6](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.4...v0.1.0-alpha.6) (2020-09-18)

### Bug Fixes

- only query previously published items if saving is enabled ([902d452](https://github.com/getindiekit/indiekit/commit/902d452974cef06585b417409945d398a79b4456))

### Features

- add preset and store directly to publication ([93a6677](https://github.com/getindiekit/indiekit/commit/93a667720fe5d68e0c728bc3d1b0026f91f50c66))
- add uuid path variable. fixes [#276](https://github.com/getindiekit/indiekit/issues/276) ([6790462](https://github.com/getindiekit/indiekit/commit/67904624f6bdc2c9d2d1a89d03bddc1e09a14e71))
- add zero padded seconds token ([c3994dd](https://github.com/getindiekit/indiekit/commit/c3994dd3dced235eee979ca34b8cc8d0cd9b9659))
- customise commit message format. fixes [#63](https://github.com/getindiekit/indiekit/issues/63) ([b2e43a5](https://github.com/getindiekit/indiekit/commit/b2e43a58f3810f24756ebc62d2b9c54c6445ad03))
- internationalisation ([e1eeb71](https://github.com/getindiekit/indiekit/commit/e1eeb7198bcc271a07538fc2a2396c8768d76590))
- reinstate time zone support. fixes [#280](https://github.com/getindiekit/indiekit/issues/280) ([21bf932](https://github.com/getindiekit/indiekit/commit/21bf932bebff72e214320d4d84ef4fcb3328927b))
- remove hosted documentation ([18edd86](https://github.com/getindiekit/indiekit/commit/18edd865f12fc146b8767772002d8e0b7cba20ba))
- simplify publication config ([7ef1e45](https://github.com/getindiekit/indiekit/commit/7ef1e45f4a1d99eaaa50bdc5caaf9a70f6012fd2))

# [0.1.0-alpha.5](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2020-09-06)

### Bug Fixes

- add zero padded seconds token ([f978f93](https://github.com/getindiekit/indiekit/commit/f978f93d16dcf766cbe79899be615f64c94b8076))
- only query previously published items if saving is enabled ([47156e3](https://github.com/getindiekit/indiekit/commit/47156e3fae63a0d734509d69d0c4e4e7a62e134a))

### Features

- add uuid path variable. fixes [#276](https://github.com/getindiekit/indiekit/issues/276) ([fcce907](https://github.com/getindiekit/indiekit/commit/fcce90786c041c9bc5977d32815f73cbff53d014))
