# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.25](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.24...v1.0.0-beta.25) (2025-12-24)


### Features

* add Brazilian Portuguese localisation from Bruno Pulis ([bd86503](https://github.com/getindiekit/indiekit/commit/bd86503da1970b7276b277c077cb2e2161f4e5c8))





# [1.0.0-beta.23](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.22...v1.0.0-beta.23) (2025-07-06)

**Note:** Version bump only for package @indiekit/endpoint-auth





# [1.0.0-beta.21](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.20...v1.0.0-beta.21) (2025-04-13)


### Features

* add Italian localisation ([8204b7d](https://github.com/getindiekit/indiekit/commit/8204b7dca75ed747d0851fa9c283057c51da5186))





# [1.0.0-beta.20](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.19...v1.0.0-beta.20) (2025-03-29)


### Bug Fixes

* **endpoint-auth:** always return if no scope ([e499a4f](https://github.com/getindiekit/indiekit/commit/e499a4fbb171926f89342b0575bc5a4e6bf03d61))
* **endpoint-auth:** iss in authorization response should match issuer provided by metadata endpoint ([f43ddfd](https://github.com/getindiekit/indiekit/commit/f43ddfd46dbdae2f775e30c2615598b4e227b9b8))
* **endpoint-auth:** respect user configured endpoints ([6a1d969](https://github.com/getindiekit/indiekit/commit/6a1d969be3f4bddca7f8f4103ab848ad437407ce))
* request.body can return undefined with express 5 ([c11e926](https://github.com/getindiekit/indiekit/commit/c11e92654e0fe34321329fc379c1df258267351f))





# [1.0.0-beta.19](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.18...v1.0.0-beta.19) (2024-10-08)

**Note:** Version bump only for package @indiekit/endpoint-auth





# [1.0.0-beta.18](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.17...v1.0.0-beta.18) (2024-08-25)


### Bug Fixes

* **endpoint-auth:** exclude client_id from introspection response ([53d6eae](https://github.com/getindiekit/indiekit/commit/53d6eaec29fa7b3c0f3dedf3c9eeebfad2bcb308))
* **endpoint-auth:** remove console debugging ([14ef31f](https://github.com/getindiekit/indiekit/commit/14ef31f9bd0c9ea68d5fa27a0aaa99ba935c0305))
* **endpoint-auth:** validate client_id against local client.id ([4721836](https://github.com/getindiekit/indiekit/commit/47218360c744def2b4217bf372a8683f7f089d74))


### Features

* **endpoint-auth:** accept client metadata ([212684d](https://github.com/getindiekit/indiekit/commit/212684da3925855ea10b6b5266ebefb06cd84cdf))





# [1.0.0-beta.17](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.16...v1.0.0-beta.17) (2024-05-11)


### Bug Fixes

* **endpoint-auth:** authorization flow ([2f1da8e](https://github.com/getindiekit/indiekit/commit/2f1da8e5c29bde39e5a16380fe2a37b3710d151d))





# [1.0.0-beta.16](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.15...v1.0.0-beta.16) (2024-04-19)

**Note:** Version bump only for package @indiekit/endpoint-auth





# [1.0.0-beta.15](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.14...v1.0.0-beta.15) (2024-04-19)


### Bug Fixes

* **endpoint-auth:** show password validation without tripping up on scope ([9f4810c](https://github.com/getindiekit/indiekit/commit/9f4810cb651edc131f2c474d380efde0196ab7ae))


### Features

* add Hindi localisation from Sesa Malinda ([3fb8e5c](https://github.com/getindiekit/indiekit/commit/3fb8e5c619ae73a4820e3a61b320472e70e403d7))





# [1.0.0-beta.12](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2024-04-09)

**Note:** Version bump only for package @indiekit/endpoint-auth





# [1.0.0-beta.10](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2024-04-08)


### Bug Fixes

* **endpoint-auth:** support older token verification endpoint. fixes [#716](https://github.com/getindiekit/indiekit/issues/716) ([5ed629d](https://github.com/getindiekit/indiekit/commit/5ed629d7459c5266dadbf5e918d5d528f9b0d8ac))


### Features

* **endpoint-auth:** show requested scopes and indicate which are supported ([91537d6](https://github.com/getindiekit/indiekit/commit/91537d6302f0f8e2851a231bc51e01dc957b8f36))





# [1.0.0-beta.8](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2024-03-03)


### Bug Fixes

* **endpoint-auth:** only show error if message ([176fc47](https://github.com/getindiekit/indiekit/commit/176fc47cf42e575a157ed7c6c61e3d7780e782e9))


### Features

* add swedish localisation from [@carlrafting](https://github.com/carlrafting) ([37f2124](https://github.com/getindiekit/indiekit/commit/37f2124dabbf6272ebb94a90f17c7758a9962a37))
* remove need for plugins to provide id value ([a866ec0](https://github.com/getindiekit/indiekit/commit/a866ec053db79d368cfa9cee197521723e39a59b))
* remove need for plugins to provide meta value ([833893e](https://github.com/getindiekit/indiekit/commit/833893e0fd45747abbd44695182d889de190830c))





# [1.0.0-beta.6](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2023-11-06)


### Features

* add Latin American Spanish localisation from Claudia Botero ([8898656](https://github.com/getindiekit/indiekit/commit/8898656ab4b90c25321b6cd4aa3354eb76babc26))
* **endpoint-indieauth:** use proposed indieauth icon ([d26748b](https://github.com/getindiekit/indiekit/commit/d26748b16fecd73a01370b937c761abe272123a1))
* require node.js v20 ([4785170](https://github.com/getindiekit/indiekit/commit/47851702ebbc1372c468cedfecbc05e1111605ff))





# [1.0.0-beta.5](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2023-08-04)


### Bug Fixes

* **endpoint-auth:** canonicalise client url ([0b75534](https://github.com/getindiekit/indiekit/commit/0b755343adbdd7989430118c19f609432e11c4e6))
* **endpoint-auth:** check for existence of app url ([e22b80f](https://github.com/getindiekit/indiekit/commit/e22b80f750b6237824e8c58b8e42c6eb09052511))
* **endpoint-auth:** client logo not appearing ([58faea4](https://github.com/getindiekit/indiekit/commit/58faea4a43b76c6c9683651112e7369b2224a0b5))
* **endpoint-auth:** improve client information discovery. fixes [#626](https://github.com/getindiekit/indiekit/issues/626) ([5ee9c1a](https://github.com/getindiekit/indiekit/commit/5ee9c1a3265b80d095b6d345d5647644b221bd23))


### Features

* **endpoint-auth:** shorter redirect hint on consent form ([512ed92](https://github.com/getindiekit/indiekit/commit/512ed92b9e087bce9b81525b5db2eabfd436c996))
* update french localisation strings ([b649a77](https://github.com/getindiekit/indiekit/commit/b649a77809af34072776af3b89fa4a0d1190e098))





# [1.0.0-beta.4](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2023-07-02)


### Bug Fixes

* **endpoint-auth:** remove param on toString ([dd7983a](https://github.com/getindiekit/indiekit/commit/dd7983a33b42beb074140706c43a752b0249b23d))


### Features

* **endpoint-auth:** introspection endpoint ([68056b1](https://github.com/getindiekit/indiekit/commit/68056b1fc6220f2f206a02a9670ee576dcad1ac0))
* show stack in frontend error messages ([28f6d3f](https://github.com/getindiekit/indiekit/commit/28f6d3fc976cd15413ed079015da4e2ddb9b6365))





# [1.0.0-beta.3](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2023-05-19)


### Bug Fixes

* **endpoint-auth:** decode url before testing if valid ([e0cebb1](https://github.com/getindiekit/indiekit/commit/e0cebb108866c5cfe75000359675d147fd28fca7))


### Features

* add simplified chinese ([70cbb8b](https://github.com/getindiekit/indiekit/commit/70cbb8b773e59f4fa8c8eed47486a5ebaf2dbcf9))





# [1.0.0-beta.1](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2022-12-28)

### Bug Fixes

- boolean value for readonly attribute ([00e7691](https://github.com/getindiekit/indiekit/commit/00e769179d607b29feb5ae61c050d7c6baf74797))

### Features

- improved french translation ([33d25cc](https://github.com/getindiekit/indiekit/commit/33d25ccd243917caa2069b56a9234b53ac3b555d))
- improved french translation ([aa12036](https://github.com/getindiekit/indiekit/commit/aa12036cff7c04b47396525c5b08ba29df005eb2))

# [1.0.0-beta.0](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.18...v1.0.0-beta.0) (2022-12-17)

### Features

- **endpoint-auth:** change colour of plug-in icon ([c5541e3](https://github.com/getindiekit/indiekit/commit/c5541e3c6cb15cc096886dd447c30e3bc9f8bd75))
- update locale catalogs ([ff4fecd](https://github.com/getindiekit/indiekit/commit/ff4fecdd200aa6cd7839475a5050426cd60f1b2f))

# [1.0.0-alpha.18](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2022-12-14)

### Bug Fixes

- **endpoint-auth:** move buttons outside fieldset ([f72a3d9](https://github.com/getindiekit/indiekit/commit/f72a3d9ac72854234682e5fd94f8ce81b7e75f20))
- **endpoint-auth:** remove fieldset from new password view ([0ccb12b](https://github.com/getindiekit/indiekit/commit/0ccb12bfb36a590913a89b3986c2fd6234f96766))
- **endpoint-auth:** use notification not warning for new password setup ([f37a493](https://github.com/getindiekit/indiekit/commit/f37a493a97496a8261e489e9f82aea6c68da558e))

# [1.0.0-alpha.17](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2022-12-07)

### Features

- **endpoint-auth:** change order of scopes ([44f7cd6](https://github.com/getindiekit/indiekit/commit/44f7cd60e86e59217425cdbe7f4688bda3706935))

# [1.0.0-alpha.16](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2022-12-02)

### Features

- **endpoint-auth:** add draft scope to consent form ([4297ab7](https://github.com/getindiekit/indiekit/commit/4297ab790e46d316717fbc16bc5f8abb281ddedf))
- **endpoint-auth:** expose username to password managers ([21ff717](https://github.com/getindiekit/indiekit/commit/21ff7176446b2619324357e0528b78881ae54770))
- **endpoint-auth:** remove scope hints ([4536090](https://github.com/getindiekit/indiekit/commit/4536090639f3d56f37a10b74145b3503d816bf33))
- **endpoint-auth:** use bcrypt for password hashing ([df0dd67](https://github.com/getindiekit/indiekit/commit/df0dd67cea0fc2d635ed0713677be1e2b630d2ff))

# [1.0.0-alpha.15](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.14...v1.0.0-alpha.15) (2022-11-23)

### Features

- **endpoint-auth:** include me paramter in authorization response ([f571735](https://github.com/getindiekit/indiekit/commit/f571735eadba8c9182988cb1b0688553fb9165df))
- **endpoint-auth:** use password input, to help with password managers ([6eacede](https://github.com/getindiekit/indiekit/commit/6eacede4f46a91f140742be7f2df2b507147c1f6))

# [1.0.0-alpha.13](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2022-11-23)

### Features

- **endpoint-authorization:** indieauth endpoint. fixes [#499](https://github.com/getindiekit/indiekit/issues/499) ([b58bcce](https://github.com/getindiekit/indiekit/commit/b58bcce678b12a9cf77d4272fac981125ccdc314))
- **endpoint-auth:** plugin icon ([b994ffa](https://github.com/getindiekit/indiekit/commit/b994ffa540f8cf96c120e28465adbc3d51a7b9b4))
- **endpoint-auth:** use scope strings from core ([46eddb5](https://github.com/getindiekit/indiekit/commit/46eddb52accc8bc992058b628a0fcae8c74bb5e6))
- **frontend:** consolidate login and minimal app layouts ([045ff3b](https://github.com/getindiekit/indiekit/commit/045ff3b852aa5c3db542080d41655fc4b514c1f8))
- update locale catalogs ([7648cd0](https://github.com/getindiekit/indiekit/commit/7648cd0aebc3e94afe2f7ddc02771886a91a1ccd))
