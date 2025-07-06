# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.23](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.22...v1.0.0-beta.23) (2025-07-06)


### Bug Fixes

* **endpoint-micropub:** normalise channel property earlier. fixes [#793](https://github.com/getindiekit/indiekit/issues/793) ([01626fb](https://github.com/getindiekit/indiekit/commit/01626fbad04671b074221d8b8e90199f00013985))





# [1.0.0-beta.21](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.20...v1.0.0-beta.21) (2025-04-13)

**Note:** Version bump only for package @indiekit/endpoint-micropub





# [1.0.0-beta.20](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.19...v1.0.0-beta.20) (2025-03-29)


### Bug Fixes

* **endpoint-micropub:** respect user configured endpoint ([f877637](https://github.com/getindiekit/indiekit/commit/f877637e61c1379c952683fbc150994e026d2a43))
* **endpoint-micropub:** throw not implemented error if post path not configured ([d5e7394](https://github.com/getindiekit/indiekit/commit/d5e7394d8ba2875d625ee798b77e13b8e582bcf0))


### Features

* addCollection API method ([d92026c](https://github.com/getindiekit/indiekit/commit/d92026cda47bc20e46a4de7368617a7ca792fb9f))
* **endpoint-micropub:** channels ([eaeee31](https://github.com/getindiekit/indiekit/commit/eaeee313c0c6985d770c412c4bf9e929bb263e06))
* **endpoint-micropub:** use excerpt method from util package ([81ecdcb](https://github.com/getindiekit/indiekit/commit/81ecdcba592c7a63aeff5a7d74a31cd43b30fac6))





# [1.0.0-beta.19](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.18...v1.0.0-beta.19) (2024-10-08)


### Bug Fixes

* **endpoint-micropub:** add debug dependency ([ca92293](https://github.com/getindiekit/indiekit/commit/ca92293c7533707b6a89989bd152caad4223e13b))
* **endpoint-micropub:** remove deprecated checkKeys option ([330e023](https://github.com/getindiekit/indiekit/commit/330e023783c45fe6e3d944e8f8e994bb7859ab41))


### Features

* **endpoint-micropub:** replace existing if creating a post with the same url ([b3b0baa](https://github.com/getindiekit/indiekit/commit/b3b0baa7b3ea5cddabb264c10fec625e85c394b6))
* **endpoint-micropub:** use md5 hash of published date as final option for a slug ([2ea5a8c](https://github.com/getindiekit/indiekit/commit/2ea5a8c7af9f0706da6fc043b921470119fdd711))





# [1.0.0-beta.18](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.17...v1.0.0-beta.18) (2024-08-25)


### Bug Fixes

* **endpoint-micropub:** ignore empty name property in PTD. fixes [#756](https://github.com/getindiekit/indiekit/issues/756) ([6bbb284](https://github.com/getindiekit/indiekit/commit/6bbb28414b533a9e640950f34c62420c44089844))





# [1.0.0-beta.16](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.15...v1.0.0-beta.16) (2024-04-19)


### Bug Fixes

* pass timeZone to date format filter ([3202fe9](https://github.com/getindiekit/indiekit/commit/3202fe9a53f2ada93c8266ce5303738f8a1fff6a))





# [1.0.0-beta.15](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.14...v1.0.0-beta.15) (2024-04-19)

**Note:** Version bump only for package @indiekit/endpoint-micropub





# [1.0.0-beta.14](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.13...v1.0.0-beta.14) (2024-04-16)

**Note:** Version bump only for package @indiekit/endpoint-micropub





# [1.0.0-beta.12](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2024-04-09)

**Note:** Version bump only for package @indiekit/endpoint-micropub





# [1.0.0-beta.10](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2024-04-08)


### Bug Fixes

* **endpoint-micropub:** missing renderPath param ([5a195c9](https://github.com/getindiekit/indiekit/commit/5a195c9220d9db3fdac40e6fabc2e622924768cc))
* **endpoint-micropub:** prevent slug property from being deleted ([fc3bcfc](https://github.com/getindiekit/indiekit/commit/fc3bcfc740e861785fe3503c12de2edd1df918fe))
* **endpoint-micropub:** update ptd algorithm. fixes [#711](https://github.com/getindiekit/indiekit/issues/711) ([a3d6c35](https://github.com/getindiekit/indiekit/commit/a3d6c35906e15f55e264814442e07e1b30117d22))


### Features

* **endpoint-media:** decouple slug post property from slug token ([306596a](https://github.com/getindiekit/indiekit/commit/306596a4ccf39e78f9d493fa51f3a6ce05c4d3ec))
* **endpoint-micropub:** add random token ([7d91e6f](https://github.com/getindiekit/indiekit/commit/7d91e6f391f10d2af2f40d1694c0f4684f003362))
* **endpoint-micropub:** remove random token ([ce9b38b](https://github.com/getindiekit/indiekit/commit/ce9b38b912344b0442b525a25d509dd0613aa737))
* **endpoint-micropub:** remove uuid token ([6c6590e](https://github.com/getindiekit/indiekit/commit/6c6590ed168d21f70ad264ff7e7dfffb09c573cf))
* **endpoint-micropub:** revert decoupling slug post property from slug token ([8970fe3](https://github.com/getindiekit/indiekit/commit/8970fe3dc3acd7181faf887b08dbd18ae05826ae))





# [1.0.0-beta.8](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2024-03-03)


### Bug Fixes

* **endpoint-micropub:** discard items in posts collection without properties ([3937452](https://github.com/getindiekit/indiekit/commit/3937452be72bb2384bd5a43ae6c75b65cf289a4d))
* **endpoint-micropub:** don’t decode date strings in query parameters ([4c6198e](https://github.com/getindiekit/indiekit/commit/4c6198e06e186bd92d429363524c9a5416feb90c))
* **endpoint-micropub:** don’t send post-type property to template ([bdb1fb3](https://github.com/getindiekit/indiekit/commit/bdb1fb3542a1fd9737d886677340d664e112f440))
* **endpoint-micropub:** fetch references for form-encoded requests ([a3ad0fa](https://github.com/getindiekit/indiekit/commit/a3ad0faaa176946065955a7f056340d4f514b77a))
* **endpoint-micropub:** files list in package.json ([f4bab79](https://github.com/getindiekit/indiekit/commit/f4bab79bccebf0ae3b1807e11833867cc2cbcf4e))
* **endpoint-micropub:** post template properties ([0eb3fd5](https://github.com/getindiekit/indiekit/commit/0eb3fd5e8d568c45c3a2ada04da382ff65ef1329))


### Features

* **endpoint-micropub:** add custom types to post type discovery ([1aec035](https://github.com/getindiekit/indiekit/commit/1aec035240fcd0c0558ec0f3d678207c30c44aa4))
* **endpoint-micropub:** add jam to post type discovery ([91eeae6](https://github.com/getindiekit/indiekit/commit/91eeae65b2fee23bac2ac3373a0de389bdb71d5a))
* **endpoint-micropub:** log CRUD operations ([06c7785](https://github.com/getindiekit/indiekit/commit/06c7785f02acc5d6e4d5aae94ee9535535f0e757))
* **endpoint-micropub:** query supported post type properties ([feadee6](https://github.com/getindiekit/indiekit/commit/feadee6fea95979fabea76fed67d3f56d28ec66e))
* **endpoint-micropub:** remove server commands from post template properties ([128299c](https://github.com/getindiekit/indiekit/commit/128299c08bfce21605fe333d5bd7ac05b2543e9e))
* **endpoint-micropub:** update link to documentation ([5bee191](https://github.com/getindiekit/indiekit/commit/5bee1912d13edb4469a534eb2595037ffd720369))
* remove need for plugins to provide id value ([a866ec0](https://github.com/getindiekit/indiekit/commit/a866ec053db79d368cfa9cee197521723e39a59b))
* remove need for plugins to provide meta value ([833893e](https://github.com/getindiekit/indiekit/commit/833893e0fd45747abbd44695182d889de190830c))





# [1.0.0-beta.6](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2023-11-06)


### Bug Fixes

* **endpoint-micropub:** create file on content store when undeleting ([18e7b22](https://github.com/getindiekit/indiekit/commit/18e7b22eef61ae55e66514662a1c5b7da02ca4e7))
* **endpoint-micropub:** delete content from store ([261aca3](https://github.com/getindiekit/indiekit/commit/261aca32a43da80a29649491533637ad9b01890c))
* **endpoint-micropub:** use getObjectId util ([3df6c8b](https://github.com/getindiekit/indiekit/commit/3df6c8b12ea6d6e0c99ed03994fac8920f40d928))


### Features

* **endpoint-micropub:** add uid to post properties ([15551cc](https://github.com/getindiekit/indiekit/commit/15551ccead1423123bd11115393790702085216e))
* **endpoint-micropub:** get post count using uid ([310a351](https://github.com/getindiekit/indiekit/commit/310a3515231875706965e39d7bd77d965ed96641))
* **endpoint-micropub:** include publication date in property normalisation ([b3ddac8](https://github.com/getindiekit/indiekit/commit/b3ddac8f61dc5273b4902ec09cba7b13d4a18cb3))
* **endpoint-micropub:** use proposed micropub icon ([82f9414](https://github.com/getindiekit/indiekit/commit/82f941451666d117f1699891a1fd392c0d9c9310))
* pass all options to slugify util ([01c4542](https://github.com/getindiekit/indiekit/commit/01c45423beceddcaa2fbbf42243a26faf79286e1))
* require node.js v20 ([4785170](https://github.com/getindiekit/indiekit/commit/47851702ebbc1372c468cedfecbc05e1111605ff))





# [1.0.0-beta.5](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2023-08-04)


### Bug Fixes

* **endpoint-micropub:** correct source response ([e63ea84](https://github.com/getindiekit/indiekit/commit/e63ea845270cbbcfe5636c447aba3ebb47142d62))
* **endpoint-micropub:** ensure random slug is 5 characters long ([539d8d9](https://github.com/getindiekit/indiekit/commit/539d8d94823799737f94c393ed2a365eb307e0c9))
* **endpoint-micropub:** exclude current document from aggregated post type count. fixes [#621](https://github.com/getindiekit/indiekit/issues/621) ([f6606eb](https://github.com/getindiekit/indiekit/commit/f6606eb062241de9b1253a4767ea2b7f7544ad90))
* **endpoint-micropub:** only post to content store if update includes changes ([a050649](https://github.com/getindiekit/indiekit/commit/a05064961f3675da219fa0e715a90d20eae4db06))


### Features

* **endpoint-micropub:** file renaming for updates ([f18e9fa](https://github.com/getindiekit/indiekit/commit/f18e9fa9647190b1f4c1237965615314aa34119f))
* **endpoint-micropub:** pass commit message as option ([573c71e](https://github.com/getindiekit/indiekit/commit/573c71e5adb3bb0aace150d1527a05cb405cda84))
* **endpoint-micropub:** remove support for forced syndication ([7f72141](https://github.com/getindiekit/indiekit/commit/7f7214131c0665eed1d7394527069cc4ea02ad6c))





# [1.0.0-beta.4](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2023-07-02)


### Bug Fixes

* **endpoint-micropub:** correctly parse limit/offset query. fixes [#603](https://github.com/getindiekit/indiekit/issues/603) ([bacbe2d](https://github.com/getindiekit/indiekit/commit/bacbe2d98d64cefb1e11312a1ea1f3951005bc46))
* **endpoint-micropub:** missing param on mf2ToJf2 ([981db18](https://github.com/getindiekit/indiekit/commit/981db18b06dd108601c47d8fdd0f3359928aaeb0))
* **endpoint-micropub:** only add data to configured database ([ead04f7](https://github.com/getindiekit/indiekit/commit/ead04f7f8ad5f2f88f46b65d4124a198000f7a65))
* **endpoint-micropub:** respond once to source query ([e41d5a6](https://github.com/getindiekit/indiekit/commit/e41d5a68247a1c57d02baa49db66669148793e9d))


### Features

* **endpoint-micropub:** cursor-based pagination ([9bc6a35](https://github.com/getindiekit/indiekit/commit/9bc6a3571825198eb034b16679ce367429d52961))
* move timeZone option to application ([a72ff74](https://github.com/getindiekit/indiekit/commit/a72ff74a0e32bf56b1cd697cb3989dee3be99b17))





# [1.0.0-beta.3](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2023-05-19)


### Bug Fixes

* **endpoint-micropub:** don’t require database to query config. fixes [#600](https://github.com/getindiekit/indiekit/issues/600) ([0ffc63a](https://github.com/getindiekit/indiekit/commit/0ffc63ab98b906b48631dc052d563113bfc178f7))


### Features

* **endpoint-micropub:** update database before content store ([c6a5fbb](https://github.com/getindiekit/indiekit/commit/c6a5fbb84ff8a5dc45e71d9fe813dea9a970d188))





# [1.0.0-beta.2](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2023-01-12)


### Bug Fixes

* **endpoint-micropub:** don’t linkify incoming context text ([7128915](https://github.com/getindiekit/indiekit/commit/71289153267c46c55fb2590cc482db9fd3e40501))
* **endpoint-micropub:** only convert content when necessary ([d2db706](https://github.com/getindiekit/indiekit/commit/d2db706998c413f22cc9329190bc6ee8e4eb152f))


### Features

* **endpoint-micropub:** allow async postTemplate method. fixes [#562](https://github.com/getindiekit/indiekit/issues/562) ([8e19a05](https://github.com/getindiekit/indiekit/commit/8e19a05d60139c5d67e6af9b385c84abf1ca921b))





# [1.0.0-beta.1](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2022-12-28)

### Bug Fixes

- correct jf2 for location ([85fb6a5](https://github.com/getindiekit/indiekit/commit/85fb6a5e8375a345633745dd112431ca1770b053))
- correct mf2 for nested vocabularies when converting from jf2 ([380fc17](https://github.com/getindiekit/indiekit/commit/380fc17afc9d333ed85054954d3d1c6c009a23be))
- correctly encode html/text content containing `<`/`>` characters ([b64b7d4](https://github.com/getindiekit/indiekit/commit/b64b7d4757105ac464228706b55edf0841b7c19c))
- **endpoint-micropub:** correct replacement of nested vocabularies ([824e660](https://github.com/getindiekit/indiekit/commit/824e660a49e7c74adda3e11fefa451683697044f))

# [1.0.0-beta.0](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.18...v1.0.0-beta.0) (2022-12-17)

### Features

- **endpoint-micropub:** change colour of plug-in icon ([f230545](https://github.com/getindiekit/indiekit/commit/f230545794bcb9362ab8dfe487c05c55a05e609a))

# [1.0.0-alpha.18](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2022-12-14)

### Bug Fixes

- **endpoint-micropub:** correct response for source url query ([55120e7](https://github.com/getindiekit/indiekit/commit/55120e7e430fa4a4c384cda150db7622e93a62c1))
- **endpoint-micropub:** only update post-status property after publishing ([38a78e2](https://github.com/getindiekit/indiekit/commit/38a78e28ebc718548dfcd1bb43096aa9be3dba13))
- **micropub:** use existing post status, if present, when not in draft mode ([4f1baf5](https://github.com/getindiekit/indiekit/commit/4f1baf52d22a18a818b59ea54e926d75a8449198))

### Features

- **endpoint-micropub:** refactor delete/undelete ([118c0e3](https://github.com/getindiekit/indiekit/commit/118c0e3d904e6fa5e79d2c7de5a74f383e1aebdc))
- **endpoint-micropub:** say restored, not undelete ([261a956](https://github.com/getindiekit/indiekit/commit/261a956689f03ca4f459818618cc0ce69212dbe5))
- **endpoint-micropub:** say restored, not undelete ([db7308e](https://github.com/getindiekit/indiekit/commit/db7308e2f31c5c21d290a7325dd085e38d738c3b))
- **endpoint-micropub:** sort source query by published date ([52d9350](https://github.com/getindiekit/indiekit/commit/52d935079f499eac0c53eaffb7a5cd1d922cc563))
- **endpoint:** add updated date when updating post ([4c98091](https://github.com/getindiekit/indiekit/commit/4c980912a014bb178e726aed345b6c9cd287737f))

# [1.0.0-alpha.17](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2022-12-07)

### Bug Fixes

- **endpoint-micropub:** enforce arrays for syndication, only add targets when creating data ([516d479](https://github.com/getindiekit/indiekit/commit/516d47925384236f60711b62169642321c23bbb8))

### Features

- **endpoint-micropub:** replace last action with post-status property ([6350d7f](https://github.com/getindiekit/indiekit/commit/6350d7faebb9a1b50e01a9e3cb9f26e619f0b465))
- **endpoint-micropub:** smarter replace operation for array values ([b610e3e](https://github.com/getindiekit/indiekit/commit/b610e3e7418760805047879992f29814a161ac41))
- **endpoint-micropub:** smarter replace operation with empty array ([dcdcf31](https://github.com/getindiekit/indiekit/commit/dcdcf315cc05652df3b1f8f743ece86268eb7380))

# [1.0.0-alpha.16](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2022-12-02)

### Features

- **endpoint-micropub:** check scope for draft value ([3fe3e5c](https://github.com/getindiekit/indiekit/commit/3fe3e5c07893504a2bf82d99cb5547ca96bf9bf6))
- **endpoint-micropub:** update post status if draft scope ([0be8dcb](https://github.com/getindiekit/indiekit/commit/0be8dcb9d05bd7cfab243a6c8033090f1d8bc2d3))

# [1.0.0-alpha.13](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2022-11-23)

### Bug Fixes

- **indiekit:** don’t throw if no database configured when getting post count ([71705df](https://github.com/getindiekit/indiekit/commit/71705df4fa98de9fb8e8b269a70c5d0edd868e17))

### Features

- **endpoint-authorization:** indieauth endpoint. fixes [#499](https://github.com/getindiekit/indiekit/issues/499) ([b58bcce](https://github.com/getindiekit/indiekit/commit/b58bcce678b12a9cf77d4272fac981125ccdc314))
- **endpoint-micropub:** enriched post properties. fixes [#147](https://github.com/getindiekit/indiekit/issues/147) ([1c74310](https://github.com/getindiekit/indiekit/commit/1c74310b862d373428f05320dcacf1eddf804a96))
- **endpoint-micropub:** plugin icon ([741df34](https://github.com/getindiekit/indiekit/commit/741df3416d2d0eb2490d76dda997ad0cd6081098))

# [1.0.0-alpha.12](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2022-07-15)

**Note:** Version bump only for package @indiekit/endpoint-micropub

# [1.0.0-alpha.10](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2022-07-12)

**Note:** Version bump only for package @indiekit/endpoint-micropub

# [1.0.0-alpha.9](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2022-07-12)

### Features

- **endpoint-micropub:** localise action errors ([e558baa](https://github.com/getindiekit/indiekit/commit/e558baae9bc50a952ece785492ec03a2936e50b2))
- **endpoint-micropub:** localise insufficient scope error ([86fdf84](https://github.com/getindiekit/indiekit/commit/86fdf84f422d139f5c402434fba932ef23c88fcc))
- **endpoint-micropub:** use custom error handler ([424d5c8](https://github.com/getindiekit/indiekit/commit/424d5c8824720cdf4285674fce862150dd80b24c))

# [1.0.0-alpha.7](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2022-06-17)

### Features

- **endpoint-micropub:** strip any html from context text property ([0a4cbf0](https://github.com/getindiekit/indiekit/commit/0a4cbf04ae50ce5389eaff891d7e14083f79d26e))
- **endpoint-micropub:** trim whitespace from name and photo alt properties ([c878c79](https://github.com/getindiekit/indiekit/commit/c878c795f574fa40abec6fe3b44be0039c668276))

# [1.0.0-alpha.6](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2022-06-14)

### Features

- **endpoint-micropub:** remove frontend interface ([36a63a7](https://github.com/getindiekit/indiekit/commit/36a63a79513eb40b3322032fc3ce227d849e48fb))
- **endpoint-micropub:** remove remote URL source querying ([b63ef8d](https://github.com/getindiekit/indiekit/commit/b63ef8d0ffa4d51a7cf61a5434afd529d80ce0c6))

# [1.0.0-alpha.5](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2022-06-08)

### Bug Fixes

- correct file paths when views have a query string ([1457773](https://github.com/getindiekit/indiekit/commit/14577736648d7800a0592b31f0c66034502f968a))

### Features

- require node.js v18 ([a7408db](https://github.com/getindiekit/indiekit/commit/a7408db7c3430cf51b76e793c5718245a7cae03c))

# [1.0.0-alpha.4](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2022-05-26)

### Bug Fixes

- **endpoint-micropub:** normalisation of mp-syndicate-to with syndication property ([621d45e](https://github.com/getindiekit/indiekit/commit/621d45e15edfa5a0fe9fe133b20a270017318faa))

# [1.0.0-alpha.0](https://github.com/getindiekit/indiekit/compare/v0.3.0...v1.0.0-alpha.0) (2022-05-20)

### Bug Fixes

- **endpoint-micropub:** normalise properties after updating post data ([0d43082](https://github.com/getindiekit/indiekit/commit/0d430825bb6e3df9777c8feb519b2267e17ecaa8))
- **endpoint-micropub:** throw error if post type not configured. fixes [#423](https://github.com/getindiekit/indiekit/issues/423) ([fb56937](https://github.com/getindiekit/indiekit/commit/fb5693752f943ff664224ed9d31271abbd3004f8))
- **endpoint-micropub:** typo ([700e720](https://github.com/getindiekit/indiekit/commit/700e720de8ce359a7f74059ea6507ec5ad9650e3))

### Features

- add Indonesian localisation from Zeky Chandra ([e5508f1](https://github.com/getindiekit/indiekit/commit/e5508f14bde8951b691e56490117552268c9c232))
- add Spanish translation from [@aciccarello](https://github.com/aciccarello) ([e556ada](https://github.com/getindiekit/indiekit/commit/e556ada815873d04b2147556c42198dcc1b3ccaa))
- enable all plug-ins to include an assets path ([d1083ab](https://github.com/getindiekit/indiekit/commit/d1083ab55e60a607377d7e3f3ca70c269637f770))
- **endpoint-micropub:** add post type count token for the day ([60f469b](https://github.com/getindiekit/indiekit/commit/60f469bc6acda4ae9bdaa55e5b97ee5e7b4124a2))
- **endpoint-micropub:** paginate posts ([a3b388e](https://github.com/getindiekit/indiekit/commit/a3b388e16c2646cf25784bf27fd7d72a54ec55b9))
- **indiekit:** refactor config loading and format. fixes [#402](https://github.com/getindiekit/indiekit/issues/402) ([65ff927](https://github.com/getindiekit/indiekit/commit/65ff9273062cdeccda35a20aa2b24cf812e93111))
- register defined view directories for plug-ins ([77eeed2](https://github.com/getindiekit/indiekit/commit/77eeed2543feec92fde112f23c2f26b1b456a572))

# [0.3.0](https://github.com/getindiekit/indiekit/compare/v0.2.0...v0.3.0) (2022-02-06)

### Bug Fixes

- **endpoint-micropub:** typos ([bf71b09](https://github.com/getindiekit/indiekit/commit/bf71b0904b80c4a84e84af39d4c5c96e764800fe))
- **endpoint-micropub:** use absolute url for media items ([3903845](https://github.com/getindiekit/indiekit/commit/39038453e1d91db81e0f96cb0334d28b4cbc05ef))

### Features

- add default exports for plug-ins ([8518285](https://github.com/getindiekit/indiekit/commit/85182856c93bb733bd98f2f221c529ca299869b8))
- **indiekit:** use localazy localisation service ([004caa0](https://github.com/getindiekit/indiekit/commit/004caa044ea9c71835108c4347ec918ceefbb399))
- plug-ins no longer need to add locales ([e489594](https://github.com/getindiekit/indiekit/commit/e489594dd377ce793cbeac34fa12d20fd8f6301a))

# [0.2.0](https://github.com/getindiekit/indiekit/compare/v0.1.4...v0.2.0) (2021-12-19)

### Bug Fixes

- **micropub:** return list of categories ([305588d](https://github.com/getindiekit/indiekit/commit/305588d47e46a54714832d002502d7fa501271a5))

## [0.1.4](https://github.com/getindiekit/indiekit/compare/v0.1.3...v0.1.4) (2021-08-01)

### Bug Fixes

- throw error if feature requires database. fixes [#358](https://github.com/getindiekit/indiekit/issues/358) ([9316eaa](https://github.com/getindiekit/indiekit/commit/9316eaa1c87903fc1df0c4bbb1b800ad2b043773))

## [0.1.1](https://github.com/getindiekit/indiekit/compare/v0.1.0...v0.1.1) (2021-05-16)

### Bug Fixes

- media uploads failing. fixes [#343](https://github.com/getindiekit/indiekit/issues/343) ([3ad644d](https://github.com/getindiekit/indiekit/commit/3ad644d790345abe14335715666f2cb44403318b))

# [0.1.0](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.23...v0.1.0) (2021-03-15)

**Note:** Version bump only for package @indiekit/endpoint-micropub

# [0.1.0-alpha.22](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2021-02-19)

### Bug Fixes

- **endpoint-micropub:** relative media path for publication url with path component ([9dd58ef](https://github.com/getindiekit/indiekit/commit/9dd58ef524635a90d714f86eb2e5c3fc94192f8a))

### Features

- **endpoint-micropub:** parse geo uri for location property ([b28d789](https://github.com/getindiekit/indiekit/commit/b28d789d14f9d298a2fba6d736572f54577f8df0))
- **endpoint-micropub:** show message when no posts to show ([a3d9bce](https://github.com/getindiekit/indiekit/commit/a3d9bcec2e8f3dbf23c7b9b588166027cd45859c))

# [0.1.0-alpha.21](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2021-02-01)

### Bug Fixes

- **endpoint-micropub:** adding item to value which is not yet an array ([1067e8d](https://github.com/getindiekit/indiekit/commit/1067e8dfa6d8b9e64c3aa1bd77099e8dafbb3242))
- **endpoint-micropub:** creating posts with single media property ([901ad93](https://github.com/getindiekit/indiekit/commit/901ad93fcfc9615c76c014005f2094c108251268))

### Features

- abstract `summaryRow` filter for post and file views ([f32e28c](https://github.com/getindiekit/indiekit/commit/f32e28ce2640c6c3319276bbfbb077220a0e4b9e))
- **endpoint-micropub:** add available queries to config query ([5545c59](https://github.com/getindiekit/indiekit/commit/5545c59d0e6eb3ebddb3fbd34df785f4da0950a7))
- **endpoint-micropub:** convert stored jf2 to mf2 on source query ([33e248c](https://github.com/getindiekit/indiekit/commit/33e248c87fd0fb290eb35d83b80400ab7dc0ab2d))
- **endpoint-micropub:** normalise properties when updating post data ([b498868](https://github.com/getindiekit/indiekit/commit/b498868d8471e502b418e492a8bc09bc60fca4c8))
- **endpoint-micropub:** only return categories for category query ([3d63ea0](https://github.com/getindiekit/indiekit/commit/3d63ea0767c7b5c4cd1cc62e06227b5f7545922d))
- **endpoint-micropub:** remove mf2 from post view ([4f85678](https://github.com/getindiekit/indiekit/commit/4f85678f419edbc948c6d9a3a99edce81c991101))

# [0.1.0-alpha.20](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2021-01-07)

### Bug Fixes

- show 404 page if item not found in database ([f737d0a](https://github.com/getindiekit/indiekit/commit/f737d0af58970f8426711e773eb4360e8e4595a3))
- **endpoint-micropub:** fix content display error ([1d33c94](https://github.com/getindiekit/indiekit/commit/1d33c94bff923127b47ed34e3e0d8d30055abc94))

### Features

- **endpoint-micropub:** use relative media URLs ([e76abde](https://github.com/getindiekit/indiekit/commit/e76abdeb1698b378e4413d9a3b3741bfd406699f))

# [0.1.0-alpha.19](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2021-01-03)

### Bug Fixes

- always use mp-slug key for slug property ([49a2bf1](https://github.com/getindiekit/indiekit/commit/49a2bf1f4df3e0a67f7a0ad693bedef1e8c59928))
- **endpoint-micropub:** use timezone when updating post paths ([a55bed5](https://github.com/getindiekit/indiekit/commit/a55bed506c76756169fd2ea9f9d3ebfa039e0609))

# [0.1.0-alpha.17](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2021-01-01)

### Features

- **endpoint-micropub:** reinstate forced syndication ([3a11ffe](https://github.com/getindiekit/indiekit/commit/3a11ffe80deae19e951b55947d28d47e91a6e838))

# [0.1.0-alpha.16](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2020-12-31)

### Features

- **endpoint-micropub:** add text and html values to content property ([95d4724](https://github.com/getindiekit/indiekit/commit/95d47240f7a49e32a32da01fee3ae811b0383c07))

# [0.1.0-alpha.15](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2020-12-28)

### Bug Fixes

- respect force syndication option ([14824b5](https://github.com/getindiekit/indiekit/commit/14824b5fa9a520fd1be640b4b9d8835e59399547))

# [0.1.0-alpha.14](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2020-11-16)

### Features

- **endpoint-micropub:** allow server to override client checked syndication targets. fixes [#296](https://github.com/getindiekit/indiekit/issues/296) ([af57800](https://github.com/getindiekit/indiekit/commit/af5780099764fecf7a973585dba35a20cbac8b75))
- allow syndicators to supply assets ([fdf8b87](https://github.com/getindiekit/indiekit/commit/fdf8b87bb0b5a4331ced265d3258d53401791c98))

# [0.1.0-alpha.12](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.10...v0.1.0-alpha.12) (2020-10-29)

### Bug Fixes

- **endpoint-micropub:** capture missing operation when updating post data ([96bfeb8](https://github.com/getindiekit/indiekit/commit/96bfeb843ea6b83e85f628e33ee5884073aa3cad))
- **endpoint-micropub:** correct query to find published post ([cac37c5](https://github.com/getindiekit/indiekit/commit/cac37c57304f89d6bdd033da11af00111d73e500))
- **endpoint-micropub:** correctly identify dates without a time ([10af2a7](https://github.com/getindiekit/indiekit/commit/10af2a7eee1670d83a000453a0db926f3170867b))
- **endpoint-micropub:** fix undelete action ([502d465](https://github.com/getindiekit/indiekit/commit/502d4659a7f1ba25bbd48ce22673585e81f3a79b))
- **endpoint-micropub:** throw error with an invalid replacement value ([bdea302](https://github.com/getindiekit/indiekit/commit/bdea302fb46dd727e2847d9271bc921077359af5))
- **endpoint-micropub:** undelete action uses create scope ([a308618](https://github.com/getindiekit/indiekit/commit/a308618b8ccff5f27a3bb2dddc8e9cbc6301b80a))

### Features

- **syndicator-internet-archive:** syndicate to internet archive. fixes [#35](https://github.com/getindiekit/indiekit/issues/35) ([818eabd](https://github.com/getindiekit/indiekit/commit/818eabd24353dfc301b6a227d0f330c5d22c0c01))
- french translation ([ccb0eea](https://github.com/getindiekit/indiekit/commit/ccb0eea1a19c9051d3d400be107920838ef5d8fc))

# [0.1.0-alpha.11](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2020-10-12)

### Bug Fixes

- **endpoint-micropub:** capture missing operation when updating post data ([96bfeb8](https://github.com/getindiekit/indiekit/commit/96bfeb843ea6b83e85f628e33ee5884073aa3cad))
- **endpoint-micropub:** correct query to find published post ([cac37c5](https://github.com/getindiekit/indiekit/commit/cac37c57304f89d6bdd033da11af00111d73e500))
- **endpoint-micropub:** correctly identify dates without a time ([10af2a7](https://github.com/getindiekit/indiekit/commit/10af2a7eee1670d83a000453a0db926f3170867b))
- **endpoint-micropub:** fix undelete action ([502d465](https://github.com/getindiekit/indiekit/commit/502d4659a7f1ba25bbd48ce22673585e81f3a79b))
- **endpoint-micropub:** throw error with an invalid replacement value ([bdea302](https://github.com/getindiekit/indiekit/commit/bdea302fb46dd727e2847d9271bc921077359af5))
- **endpoint-micropub:** undelete action uses create scope ([a308618](https://github.com/getindiekit/indiekit/commit/a308618b8ccff5f27a3bb2dddc8e9cbc6301b80a))

### Features

- french translation ([ccb0eea](https://github.com/getindiekit/indiekit/commit/ccb0eea1a19c9051d3d400be107920838ef5d8fc))

# [0.1.0-alpha.10](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2020-10-03)

### Bug Fixes

- correct time zone implementation. fixes [#294](https://github.com/getindiekit/indiekit/issues/294) ([a6f30b1](https://github.com/getindiekit/indiekit/commit/a6f30b1d93ec7a39fda5aa7f6933fc8f699b9bc2))
- german translations ([#293](https://github.com/getindiekit/indiekit/issues/293)) ([3dfdf76](https://github.com/getindiekit/indiekit/commit/3dfdf766e77bdd62cb282668f82e1f9f6252e0f8))

# [0.1.0-alpha.9](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2020-09-28)

### Bug Fixes

- use timezone for path tokens ([0618656](https://github.com/getindiekit/indiekit/commit/06186568d9de9d333c70ab8a488685ec51ad3b3e))
- **endpoint-micropub:** correct time zone handling. fixes [#287](https://github.com/getindiekit/indiekit/issues/287) ([7ae18c4](https://github.com/getindiekit/indiekit/commit/7ae18c4b446bdad26cc7db4783057004e9caf47b))
- **endpoint-micropub:** microformats display on post page ([e758f4d](https://github.com/getindiekit/indiekit/commit/e758f4d81cdc6ea5a1cf78bcba386a6536370ec8))

# [0.1.0-alpha.8](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2020-09-20)

**Note:** Version bump only for package @indiekit/endpoint-micropub

# [0.1.0-alpha.7](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2020-09-19)

### Bug Fixes

- list missing files in package.json ([fa48e0b](https://github.com/getindiekit/indiekit/commit/fa48e0be7473cd0da7a4af395b664355c73bdf02))

# [0.1.0-alpha.6](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.4...v0.1.0-alpha.6) (2020-09-18)

### Bug Fixes

- only query previously published items if saving is enabled ([902d452](https://github.com/getindiekit/indiekit/commit/902d452974cef06585b417409945d398a79b4456))
- **endpoint-micropub:** add lodash as dependency ([7c9db31](https://github.com/getindiekit/indiekit/commit/7c9db3118070c3c847b8d724e405142700cb84f2))

### Features

- add preset and store directly to publication ([93a6677](https://github.com/getindiekit/indiekit/commit/93a667720fe5d68e0c728bc3d1b0026f91f50c66))
- add uuid path variable. fixes [#276](https://github.com/getindiekit/indiekit/issues/276) ([6790462](https://github.com/getindiekit/indiekit/commit/67904624f6bdc2c9d2d1a89d03bddc1e09a14e71))
- add zero padded seconds token ([c3994dd](https://github.com/getindiekit/indiekit/commit/c3994dd3dced235eee979ca34b8cc8d0cd9b9659))
- customise commit message format. fixes [#63](https://github.com/getindiekit/indiekit/issues/63) ([b2e43a5](https://github.com/getindiekit/indiekit/commit/b2e43a58f3810f24756ebc62d2b9c54c6445ad03))
- internationalisation ([e1eeb71](https://github.com/getindiekit/indiekit/commit/e1eeb7198bcc271a07538fc2a2396c8768d76590))
- move slug separator to publication settings ([baa4219](https://github.com/getindiekit/indiekit/commit/baa42197b3953ba62d44a90b4051392d1716b2e4))
- reinstate time zone support. fixes [#280](https://github.com/getindiekit/indiekit/issues/280) ([21bf932](https://github.com/getindiekit/indiekit/commit/21bf932bebff72e214320d4d84ef4fcb3328927b))
- remove hosted documentation ([18edd86](https://github.com/getindiekit/indiekit/commit/18edd865f12fc146b8767772002d8e0b7cba20ba))
- simplify publication config ([7ef1e45](https://github.com/getindiekit/indiekit/commit/7ef1e45f4a1d99eaaa50bdc5caaf9a70f6012fd2))

# [0.1.0-alpha.5](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2020-09-06)

### Bug Fixes

- add zero padded seconds token ([f978f93](https://github.com/getindiekit/indiekit/commit/f978f93d16dcf766cbe79899be615f64c94b8076))
- only query previously published items if saving is enabled ([47156e3](https://github.com/getindiekit/indiekit/commit/47156e3fae63a0d734509d69d0c4e4e7a62e134a))
- **endpoint-micropub:** add lodash as dependency ([7c9db31](https://github.com/getindiekit/indiekit/commit/7c9db3118070c3c847b8d724e405142700cb84f2))

### Features

- add uuid path variable. fixes [#276](https://github.com/getindiekit/indiekit/issues/276) ([fcce907](https://github.com/getindiekit/indiekit/commit/fcce90786c041c9bc5977d32815f73cbff53d014))
