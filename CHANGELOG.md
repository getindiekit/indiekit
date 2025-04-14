# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.22](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.21...v1.0.0-beta.22) (2025-04-14)


### Bug Fixes

* **syndicator-bluesky:** use correct post url format ([9831b49](https://github.com/getindiekit/indiekit/commit/9831b49e16e710fe8e27ecb3d12d5ad15a13ddfb))





# [1.0.0-beta.21](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.20...v1.0.0-beta.21) (2025-04-13)


### Bug Fixes

* **endpoint-syndicate:** don’t add syndicated url if no value returned from syndicator ([8621bb1](https://github.com/getindiekit/indiekit/commit/8621bb1576b90d2774ece23e8d740e469b3baa5f))
* **frontend:** default display of summary disclosure icon ([f986bfe](https://github.com/getindiekit/indiekit/commit/f986bfebc9ea896280e673fe9bdf52143d59cd14))
* **frontend:** z-index of header vs codemirror fullscreen editor ([345de0b](https://github.com/getindiekit/indiekit/commit/345de0b10492fa73e0cbb3aa06d28548c387bd26))
* **indiekit:** correct conditional check for configured channels on status page ([54fc3f1](https://github.com/getindiekit/indiekit/commit/54fc3f106dd79fab36737d4febcb446eb0c1ba9e))
* **indiekit:** correct conditional check for configured syndication targets on status page ([944d2da](https://github.com/getindiekit/indiekit/commit/944d2da9f41c4a42c2f27a9f680b96912d06aa82))
* **syndicator-internet-archive:** append errors to existing info objection ([5b9fd9a](https://github.com/getindiekit/indiekit/commit/5b9fd9a237e1c9568ef610d796eb5f0d78d25665))
* **util:** sanitise nested values ([e70b9a7](https://github.com/getindiekit/indiekit/commit/e70b9a7ed448656e038b16db98fae5fb5d1a9a89))


### Features

* add Italian localisation ([8204b7d](https://github.com/getindiekit/indiekit/commit/8204b7dca75ed747d0851fa9c283057c51da5186))
* **syndicator-bluesky:** bluesky syndicator ([ec0c5e6](https://github.com/getindiekit/indiekit/commit/ec0c5e6f539d06fff93ba4c24bf3cc71f1019e83))
* **syndicator-mastodon:** default url option to mastodon.social ([e97469c](https://github.com/getindiekit/indiekit/commit/e97469c089be37097faee97cb179f99f79ccbed7))





# [1.0.0-beta.20](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.19...v1.0.0-beta.20) (2025-03-29)


### Bug Fixes

* **endpoint-auth:** always return if no scope ([e499a4f](https://github.com/getindiekit/indiekit/commit/e499a4fbb171926f89342b0575bc5a4e6bf03d61))
* **endpoint-auth:** iss in authorization response should match issuer provided by metadata endpoint ([f43ddfd](https://github.com/getindiekit/indiekit/commit/f43ddfd46dbdae2f775e30c2615598b4e227b9b8))
* **endpoint-auth:** respect user configured endpoints ([6a1d969](https://github.com/getindiekit/indiekit/commit/6a1d969be3f4bddca7f8f4103ab848ad437407ce))
* **endpoint-media:** only perform image transformations on images ([81a8838](https://github.com/getindiekit/indiekit/commit/81a8838038cc9f3c35102a4824f50d7bc170e2bc))
* **endpoint-media:** respect user configured endpoint ([eed9053](https://github.com/getindiekit/indiekit/commit/eed9053b54ddf0cfcf4a4a5dbda66310be99dd0f))
* **endpoint-media:** throw not implemented error if media path not configured ([52da779](https://github.com/getindiekit/indiekit/commit/52da779b7d779a3218de6ae1be0825fd4cbc9c82))
* **endpoint-micropub:** respect user configured endpoint ([f877637](https://github.com/getindiekit/indiekit/commit/f877637e61c1379c952683fbc150994e026d2a43))
* **endpoint-micropub:** throw not implemented error if post path not configured ([d5e7394](https://github.com/getindiekit/indiekit/commit/d5e7394d8ba2875d625ee798b77e13b8e582bcf0))
* **endpoint-syndication:** request.body can return undefined with express 5 ([3ee6ac6](https://github.com/getindiekit/indiekit/commit/3ee6ac699a4b7419622aad282889fbfad761154f))
* **frontend:** don’t add margin above first heading in prose ([299cce6](https://github.com/getindiekit/indiekit/commit/299cce67f4742c6d06bf97469f160c50bae7229e))
* **frontend:** increase z-index of header ([c7104a5](https://github.com/getindiekit/indiekit/commit/c7104a5b2c8016db849e160153e3a98bab68dace))
* **frontend:** only use monospace for time inside a footer ([d0bd5dc](https://github.com/getindiekit/indiekit/commit/d0bd5dca64f9bcf43fc99fcf13aae16ed1d6be2e))
* **frontend:** reduce space above card footer ([83707d6](https://github.com/getindiekit/indiekit/commit/83707d6e7b294135073e06fa66dcdca2df71eeb3))
* **frontend:** show optional text on checkboxes fieldset ([7b41927](https://github.com/getindiekit/indiekit/commit/7b41927fc6ffaf25ea1849ed9eab9fbce22cf64d))
* **indiekit:** faster algorithm for asset hashes ([7fc81ab](https://github.com/getindiekit/indiekit/commit/7fc81aba0c172b846abb9ce07b0e9769fc6954de))
* **indiekit:** get installed plug-ins for list view ([a80f389](https://github.com/getindiekit/indiekit/commit/a80f3893a57eb738ab40928d9798f06afbc94012))
* **indiekit:** show plugin description on list cards ([9ecf68a](https://github.com/getindiekit/indiekit/commit/9ecf68a5673dd59f7d11d3f8772f19e8c54e2538))
* **indiekit:** show plugin information on status cards ([be413d8](https://github.com/getindiekit/indiekit/commit/be413d887a0b62c08e6b8494b5adcbed375d8381))
* **post-type-note:** remove unused property ([88491e0](https://github.com/getindiekit/indiekit/commit/88491e01b3fa305c15696ec5b361037a1c713510))
* request.body can return undefined with express 5 ([c11e926](https://github.com/getindiekit/indiekit/commit/c11e92654e0fe34321329fc379c1df258267351f))
* **util:** date-fns tz function doesn’t accept ‘Z’ time zone designator ([231c5fa](https://github.com/getindiekit/indiekit/commit/231c5fa4dc88a5d8d0d11f79a7faae8919dfb5ee))


### Features

* addCollection API method ([d92026c](https://github.com/getindiekit/indiekit/commit/d92026cda47bc20e46a4de7368617a7ca792fb9f))
* **endpoint-files:** hide widget if no media endpoint ([576f4ed](https://github.com/getindiekit/indiekit/commit/576f4ed363be976a2692475d7550200e62e55956))
* **endpoint-micropub:** channels ([eaeee31](https://github.com/getindiekit/indiekit/commit/eaeee313c0c6985d770c412c4bf9e929bb263e06))
* **endpoint-micropub:** use excerpt method from util package ([81ecdcb](https://github.com/getindiekit/indiekit/commit/81ecdcba592c7a63aeff5a7d74a31cd43b30fac6))
* **endpoint-posts:** channels ([7516856](https://github.com/getindiekit/indiekit/commit/7516856c99de1d8fe05ec1168401141cd47f5a95))
* **endpoint-posts:** excerpt post description in controller ([032d32b](https://github.com/getindiekit/indiekit/commit/032d32b8d31f6546a37127b671e2cdf3001db6de))
* **endpoint-posts:** featured field ([a1c84f6](https://github.com/getindiekit/indiekit/commit/a1c84f69f73fc1568facdc5d0a868113a160c72b))
* **endpoint-posts:** hide widget if no micropub endpoint ([5a16792](https://github.com/getindiekit/indiekit/commit/5a16792d785ed0aa767e9357faf4605ec510996d))
* **endpoint-webmention-io:** webmention.io endpoint ([9ceb623](https://github.com/getindiekit/indiekit/commit/9ceb6230efc180c24891567b3e1a4f382fb71f64))
* **frontend:** allow additional links in card body ([10101d4](https://github.com/getindiekit/indiekit/commit/10101d4816a931d2ad9499862a6488456154c84c))
* **frontend:** avatar component ([a9902de](https://github.com/getindiekit/indiekit/commit/a9902de30c0599c1923fdba5c6feb996164a1eee))
* **frontend:** don’t excerpt card description ([2d333a4](https://github.com/getindiekit/indiekit/commit/2d333a40f6267c3080dfcd196945320dc3eb6847))
* **frontend:** mention component ([ee3a9d5](https://github.com/getindiekit/indiekit/commit/ee3a9d5d9982fb36748f14f1dc03d03c6a7fd4b7))
* **frontend:** mention icon ([9bb8388](https://github.com/getindiekit/indiekit/commit/9bb838827040628b893ee2d794f5718a6869850b))
* **frontend:** replace rollup with esbuild ([f659476](https://github.com/getindiekit/indiekit/commit/f65947646105dbbdaa25cf929ee1295a415d7994))
* **frontend:** support different card uses ([c6a6b9c](https://github.com/getindiekit/indiekit/commit/c6a6b9cda172d4625f6d0f55d5d9df0de4ab5184))
* **frontend:** use excerpt method from util package ([2965e6d](https://github.com/getindiekit/indiekit/commit/2965e6d9dbdeb2487d518ccffdf7dc6c2f7a5e92))
* **frontend:** user component ([68a4e2f](https://github.com/getindiekit/indiekit/commit/68a4e2fe5abe6d2e8f35bedf7f9f768fc30a870c))
* **indiekit:** channels ([de0183c](https://github.com/getindiekit/indiekit/commit/de0183c272119763caa4b03316534870a78b5f80))
* **indiekit:** remove configurable session middleware ([d92c4d3](https://github.com/getindiekit/indiekit/commit/d92c4d3e61be83f2a1f300576c584e99d694cd5d))
* **indiekit:** set session secret using environment variable ([8ca0c34](https://github.com/getindiekit/indiekit/commit/8ca0c340dac2c5ac1dfd74045f8d3c467ad36324))
* **util:** excerpt string ([8caecf6](https://github.com/getindiekit/indiekit/commit/8caecf6544f6f92c9e48fba0d2be2552e7c3a9c9))
* **util:** formatLocalToZonedDate helper ([361fe13](https://github.com/getindiekit/indiekit/commit/361fe135160db66c233a2a29b0b84e97aec2c7b8))
* **util:** remove getTimeZoneDesignator and getTimeZoneOffset helpers ([742898d](https://github.com/getindiekit/indiekit/commit/742898db2b461c13396026571fcc0cf04f061798))
* **util:** sha1 hash ([e146fe2](https://github.com/getindiekit/indiekit/commit/e146fe2e5d65c0c9fea9855720b701fb109a5462))





# [1.0.0-beta.19](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.18...v1.0.0-beta.19) (2024-10-08)


### Bug Fixes

* **endpoint-media:** add debug dependency ([3d702e2](https://github.com/getindiekit/indiekit/commit/3d702e2f7c6763271f544808206a90ef926028dd))
* **endpoint-media:** resize image while keeping original orientation ([0d51c95](https://github.com/getindiekit/indiekit/commit/0d51c95db8dd07c78630d04fa612ffa62a9b922a))
* **endpoint-micropub:** add debug dependency ([ca92293](https://github.com/getindiekit/indiekit/commit/ca92293c7533707b6a89989bd152caad4223e13b))
* **endpoint-micropub:** remove deprecated checkKeys option ([330e023](https://github.com/getindiekit/indiekit/commit/330e023783c45fe6e3d944e8f8e994bb7859ab41))
* **post-type-event:** add missing conditional for end property ([3e1a8a0](https://github.com/getindiekit/indiekit/commit/3e1a8a08aacbd9ddfbe7bd5dcc6cdee0ff9619b7))
* **store-ftp:** check if file exists before creating ([e50e32c](https://github.com/getindiekit/indiekit/commit/e50e32c8a643b5ad5a3b5022bff1207ea20ffaf1))
* **store-gitea:** check if file exists before creating ([2512507](https://github.com/getindiekit/indiekit/commit/2512507ec47c92af31794546bdd0bb2c5d289465))
* **store-gitea:** join file and instance paths to normalise client url ([3a83733](https://github.com/getindiekit/indiekit/commit/3a83733ae166652f0ca171265b6e4aec192fb453))
* **store-github:** add debug dependency. fixes [#763](https://github.com/getindiekit/indiekit/issues/763) ([bd2a3f7](https://github.com/getindiekit/indiekit/commit/bd2a3f70e4dc7a2a39cb34fa9781c1703788352b))
* **store-github:** join file and instance paths to normalise client url ([a9ff68e](https://github.com/getindiekit/indiekit/commit/a9ff68ecb8beb1a0f1f213f8ca85ba404b6d365c))
* **store-gitlab:** check if file exists before creating ([101637b](https://github.com/getindiekit/indiekit/commit/101637b72b0dfb754dfc7b2b68220d0e62947900))
* **store-gitlab:** update integration ([b4c88ce](https://github.com/getindiekit/indiekit/commit/b4c88ced4b70b85552a8499fca7bd6bb526a0fce))
* **store-s3:** check if file exists before creating ([e1468c4](https://github.com/getindiekit/indiekit/commit/e1468c42955c033aca00213fe8b600f3c58e110c))
* **store-s3:** copy file before deleting when moving ([c6dcb25](https://github.com/getindiekit/indiekit/commit/c6dcb25cc8fcbff495df12418e80a3d6dd6d91a6))


### Features

* **endpoint-media:** replace existing if uploading media with the same url ([fc24e1c](https://github.com/getindiekit/indiekit/commit/fc24e1cebd416268b478a72a98abc97d56dc4aef))
* **endpoint-micropub:** replace existing if creating a post with the same url ([b3b0baa](https://github.com/getindiekit/indiekit/commit/b3b0baa7b3ea5cddabb264c10fec625e85c394b6))
* **endpoint-micropub:** use md5 hash of published date as final option for a slug ([2ea5a8c](https://github.com/getindiekit/indiekit/commit/2ea5a8c7af9f0706da6fc043b921470119fdd711))
* **store-bitbucket:** check if file exists before creating ([e394e4a](https://github.com/getindiekit/indiekit/commit/e394e4a17aa9fa644af5b9ad7d10b5e7358c79e5))
* **store-file-system:** check if file exists before creating ([1aa437e](https://github.com/getindiekit/indiekit/commit/1aa437ee2dcecb946bec3f4b599b72b3bac4284b))
* **store-github:** check if file exists before creating ([f89b8f1](https://github.com/getindiekit/indiekit/commit/f89b8f1142dacb070e2c34c4941b1142600acf4c))
* **util:** md5 ([b09a8c4](https://github.com/getindiekit/indiekit/commit/b09a8c444b92d974cde3a9b3b98e2d80b3f8465b))





# [1.0.0-beta.18](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.17...v1.0.0-beta.18) (2024-08-25)


### Bug Fixes

* **endpoint-auth:** exclude client_id from introspection response ([53d6eae](https://github.com/getindiekit/indiekit/commit/53d6eaec29fa7b3c0f3dedf3c9eeebfad2bcb308))
* **endpoint-auth:** remove console debugging ([14ef31f](https://github.com/getindiekit/indiekit/commit/14ef31f9bd0c9ea68d5fa27a0aaa99ba935c0305))
* **endpoint-auth:** validate client_id against local client.id ([4721836](https://github.com/getindiekit/indiekit/commit/47218360c744def2b4217bf372a8683f7f089d74))
* **endpoint-micropub:** ignore empty name property in PTD. fixes [#756](https://github.com/getindiekit/indiekit/issues/756) ([6bbb284](https://github.com/getindiekit/indiekit/commit/6bbb28414b533a9e640950f34c62420c44089844))
* **frontend:** allow detail summary to wrap. fixes [#753](https://github.com/getindiekit/indiekit/issues/753) ([c8cdb89](https://github.com/getindiekit/indiekit/commit/c8cdb899a57290ea2659ffbe4a1c8db1b95c3593))


### Features

* **endpoint-auth:** accept client metadata ([212684d](https://github.com/getindiekit/indiekit/commit/212684da3925855ea10b6b5266ebefb06cd84cdf))
* **indiekit:** add debug logs to troubleshoot Indiekit/Express server configuration ([d02b5b8](https://github.com/getindiekit/indiekit/commit/d02b5b8c6e0ac9711592ba210766a9d43a46cb3f))
* **indiekit:** add debug logs to troubleshoot the connection to MongoDB ([20bc5a3](https://github.com/getindiekit/indiekit/commit/20bc5a377d86056c96754261c56b72e82532a89e))
* **indiekit:** client metadata endpoint ([7a36846](https://github.com/getindiekit/indiekit/commit/7a3684666ed7df2fedaa2f4927b5d6882f96d0e5))
* **store-github:** improve error messages for CRUD operations ([bbb9990](https://github.com/getindiekit/indiekit/commit/bbb9990907ee74651a648438ff389a3e5c761cb7))





# [1.0.0-beta.17](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.16...v1.0.0-beta.17) (2024-05-11)


### Bug Fixes

* **endpoint-auth:** authorization flow ([2f1da8e](https://github.com/getindiekit/indiekit/commit/2f1da8e5c29bde39e5a16380fe2a37b3710d151d))
* **frontend:** date input focus background colour ([7722750](https://github.com/getindiekit/indiekit/commit/7722750e9319c91f3279ebc5e5a5fa62f19b65d6))
* **frontend:** unset token header styles ([0617dc4](https://github.com/getindiekit/indiekit/commit/0617dc4255b297bdc2b337c3b89d30f3b7c9d28d))


### Features

* **frontend:** remove global letter spacing ([5f695c7](https://github.com/getindiekit/indiekit/commit/5f695c78ad94910782f59f8ffb9b6af48e47ca95))





# [1.0.0-beta.16](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.15...v1.0.0-beta.16) (2024-04-19)


### Bug Fixes

* pass timeZone to date format filter ([3202fe9](https://github.com/getindiekit/indiekit/commit/3202fe9a53f2ada93c8266ce5303738f8a1fff6a))





# [1.0.0-beta.15](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.14...v1.0.0-beta.15) (2024-04-19)


### Bug Fixes

* **endpoint-auth:** show password validation without tripping up on scope ([9f4810c](https://github.com/getindiekit/indiekit/commit/9f4810cb651edc131f2c474d380efde0196ab7ae))
* **endpoint-posts:** add media endpoint to markdown editors ([84db24f](https://github.com/getindiekit/indiekit/commit/84db24fb4f647a49627a31b30a7188f06f71cdb5))
* **endpoint-posts:** remove image value from post form data ([2139877](https://github.com/getindiekit/indiekit/commit/2139877b4710d3c31c2dcdf6a45396a41d750227))
* **frontend:** fix textarea shift on focus ([8ea2cbf](https://github.com/getindiekit/indiekit/commit/8ea2cbf48742c42c8bd6731688e85c98e9395408))
* **frontend:** move error message before tag input ([4e7dd1d](https://github.com/getindiekit/indiekit/commit/4e7dd1db6844df64872edefafff901bb4ad62bed))
* **frontend:** replace hard-coded media endpoint with value provided in attribute ([f4f72f2](https://github.com/getindiekit/indiekit/commit/f4f72f285a3f98ca83a28e33a5b25ffdd4951451))
* **preset-jekyll:** remove incorrect use of excerpt property ([c1e3c5f](https://github.com/getindiekit/indiekit/commit/c1e3c5f2b848cf5e7d7ca1d0cbd9eb0c81dfbe62))


### Features

* add Hindi localisation from Sesa Malinda ([3fb8e5c](https://github.com/getindiekit/indiekit/commit/3fb8e5c619ae73a4820e3a61b320472e70e403d7))
* **endpoint-posts:** keep radio options when editing published date ([b2bce8d](https://github.com/getindiekit/indiekit/commit/b2bce8d0b428e36ea4a103165c8e2d4d73845a34))
* **endpoint-posts:** update formatting for published date ([a48a039](https://github.com/getindiekit/indiekit/commit/a48a039abedb32cde1a7485601d04aa86362812c))
* pass timeZone to date format filter ([4a7a08b](https://github.com/getindiekit/indiekit/commit/4a7a08bb61e4afd871d201d991b5a3684b528df9))
* **post-type-photo:** increase rows for photo description ([a1023cc](https://github.com/getindiekit/indiekit/commit/a1023ccabca4b637c9003c9dd0de1d17d029e06f))
* **util:** enable date formatter to accept upstream timeZone option ([16af3b9](https://github.com/getindiekit/indiekit/commit/16af3b90aca779a5b21aed7f76e961e9c4d6f412))





# [1.0.0-beta.14](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.13...v1.0.0-beta.14) (2024-04-16)


### Bug Fixes

* **endpoint-media:** correctly remove original file extension ([f17ba2e](https://github.com/getindiekit/indiekit/commit/f17ba2e16dc2a1ff6d74e6604f7c55acf7feac0e))
* **frontend:** increase size of logo in maskable icon ([b48c3db](https://github.com/getindiekit/indiekit/commit/b48c3db9244beab7fd028f8724519ad6fb07be0b))
* **frontend:** only resize share preview when parent form ([c071059](https://github.com/getindiekit/indiekit/commit/c07105990049f133a03ac2ae58caf30e1e69b7d1))
* **frontend:** style misspelt words in markdown editor ([e4fb607](https://github.com/getindiekit/indiekit/commit/e4fb607fe7a253945ac7672131caee1feac0d8f0))
* **frontend:** svg icons with titles should be focusable ([cc5fde9](https://github.com/getindiekit/indiekit/commit/cc5fde9f4187deb2dda18b5155df8d59e17ae034))
* **frontend:** use explicit image dimensions ([5800028](https://github.com/getindiekit/indiekit/commit/5800028e953bf4d551687b5d19fcd8ae768e87b1))
* **indiekit:** remove database requirement check from shortcuts ([e6b2099](https://github.com/getindiekit/indiekit/commit/e6b209999dc714b913858c4fc674f95c6690cc76))
* **post-type-audio:** contain audio within figure ([18162c5](https://github.com/getindiekit/indiekit/commit/18162c57d9bfc15626bf5d45d59e479c947e94ed))
* **post-type-photo:** contain photo within figure ([34a506f](https://github.com/getindiekit/indiekit/commit/34a506fe0bc8c03f4cc32a8d982e3013705451c5))
* **post-type-video:** contain video within figure ([aa0d6ae](https://github.com/getindiekit/indiekit/commit/aa0d6ae77d4242cd974a64b284f616c6c4de2298))


### Features

* **endpoint-files:** add back link to file upload page ([acb0721](https://github.com/getindiekit/indiekit/commit/acb0721a35b7fdc8f88de14764d9ff4c3d87599c))
* **endpoint-files:** shortcut icon ([8140b27](https://github.com/getindiekit/indiekit/commit/8140b27dd5033f5edfb69829e496f0ad71a10340))
* **endpoint-posts:** always hide advanced options when creating new post ([8a0e42c](https://github.com/getindiekit/indiekit/commit/8a0e42ca627a413b8ddc868d430d66885ec8843f))
* **endpoint-posts:** remove editor height attributes ([860c8ef](https://github.com/getindiekit/indiekit/commit/860c8efefb526698a867794f013e499a5d616f44))
* **endpoint-posts:** sanitize tag input ([50a3497](https://github.com/getindiekit/indiekit/commit/50a34977a7c821d8c8198684874d42020a037c70))
* **endpoint-posts:** shortcut icon ([4969d37](https://github.com/getindiekit/indiekit/commit/4969d37d094c6c3834bf604626dd731455f38d45))
* **frontend:** add icon option to warning component ([55c2c2f](https://github.com/getindiekit/indiekit/commit/55c2c2fbc1016e874f277c5bbf5a887a7787e021))
* **frontend:** add sanitizer for tag input ([e0b47db](https://github.com/getindiekit/indiekit/commit/e0b47dbc6e553892cba8b08fad58880d8cd00b9a))
* **frontend:** add shortcut icon function ([8d77a53](https://github.com/getindiekit/indiekit/commit/8d77a5314cefb846d58ce719dabd182ac56fb12b))
* **frontend:** create a new tag when comma key pressed ([08906d1](https://github.com/getindiekit/indiekit/commit/08906d1136ebdd9470afcec5e0d63375a3abca70))
* **frontend:** export theme color helpers ([5322184](https://github.com/getindiekit/indiekit/commit/5322184f2ec4740804c8f91ea7981da6a25cc611))
* **frontend:** increase font size of actions component ([a9b3415](https://github.com/getindiekit/indiekit/commit/a9b3415fb6ab8881ecb93583f53bd25b4b09bc1c))
* **frontend:** move actions below heading ([14aa3e1](https://github.com/getindiekit/indiekit/commit/14aa3e11ac6c0f58bc9d06569066d3f358432055))
* **frontend:** offline icon ([0c0d9d6](https://github.com/getindiekit/indiekit/commit/0c0d9d615ca09d8b072d4fd3a0e71c92d294215b))
* **frontend:** option to not show hidden prefix for warning text ([2a66c36](https://github.com/getindiekit/indiekit/commit/2a66c36782aa80e8c5c1d4439753b94350ea9657))
* **frontend:** service worker ([799134c](https://github.com/getindiekit/indiekit/commit/799134c4dc996c0f24b600e282d0febaef39ec50))
* **frontend:** update app icon function to take purpose ([7bc22c6](https://github.com/getindiekit/indiekit/commit/7bc22c6c622f727d9bcb7ccaceba798228799701))
* **frontend:** update path to apple-touch-icon ([aea2f54](https://github.com/getindiekit/indiekit/commit/aea2f540c6834b0339f190202f53803745e26e8d))
* **frontend:** use fixed min, not customisable max height for markdown editor ([3af3cfa](https://github.com/getindiekit/indiekit/commit/3af3cfa67c8feadd9a45c43283e52bb483bd0fd9))
* **frontend:** use theme color based on color scheme ([c66b7a3](https://github.com/getindiekit/indiekit/commit/c66b7a39cf0a5ee854717a1403958d8ae2c88a8a))
* **indiekit:** add theme_color and background_color to web app manifest ([b1ffaf5](https://github.com/getindiekit/indiekit/commit/b1ffaf5e9adfbca0f663123f30ec7887933ec0b3))
* **indiekit:** maskable app icon ([6fabca3](https://github.com/getindiekit/indiekit/commit/6fabca31e08c9daae896bd35a8aec9367b736a8b))
* **indiekit:** robots.txt ([e6bac12](https://github.com/getindiekit/indiekit/commit/e6bac12d05bb678f629171f82bbedc32b33fc96f))
* **indiekit:** shortcut icons ([5229634](https://github.com/getindiekit/indiekit/commit/522963416d76da8d530e9c8af565aad794d1e8ff))
* **indiekit:** update web app manifest ([da11b4f](https://github.com/getindiekit/indiekit/commit/da11b4fad126ceb793476e5ebefc5d0b3538f559))
* **indiekit:** use service worker ([fac293a](https://github.com/getindiekit/indiekit/commit/fac293adb0450b2b62107355b7f75e9715ea08f1))





# [1.0.0-beta.13](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.12...v1.0.0-beta.13) (2024-04-10)


### Bug Fixes

* **endpoint-posts:** resolve item photo ([605a8d0](https://github.com/getindiekit/indiekit/commit/605a8d06cbd72c6eb13ccd5a68286405947a796d))
* **frontend:** check for hint in tag input before insertion ([d55e936](https://github.com/getindiekit/indiekit/commit/d55e93629575c00ac9e0b2675b24d01a2bd59700))


### Features

* **post-type-audio:** loosen audio field validation ([27c9504](https://github.com/getindiekit/indiekit/commit/27c95047d19aab5cb6c09699bc82f4146eeb0dc6))
* **post-type-photo:** loosen photo field validation ([8dab984](https://github.com/getindiekit/indiekit/commit/8dab9849e61d1e4b56d859db9dd360010b7c44e9))
* **post-type-video:** loosen video field validation ([8283485](https://github.com/getindiekit/indiekit/commit/8283485b705e7247663252d260bdb59e89f61299))





# [1.0.0-beta.12](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2024-04-09)


### Bug Fixes

* **frontend:** check for textarea character count before updating ([309b11f](https://github.com/getindiekit/indiekit/commit/309b11fe5cf41b786d715de3a170b23446c7094c))
* **frontend:** header background colour in dark mode ([508343c](https://github.com/getindiekit/indiekit/commit/508343cefb09fdf9918d789177aeb1602673e5a2))
* **frontend:** resolve fetched error message in file upload component ([dc6174a](https://github.com/getindiekit/indiekit/commit/dc6174a385000148371c01640e17b0b59c9a678b))
* **indiekit:** correctly resolve media store fallback ([dcd42ee](https://github.com/getindiekit/indiekit/commit/dcd42ee0e4e746c17dc6fad2c3fe180c8191984a))


### Features

* **error:** handle non-json response from fetch request ([1a4d0ad](https://github.com/getindiekit/indiekit/commit/1a4d0ad6ee938563d084b5d93c3b0982e5d8014f))
* **frontend:** replace widont filter with text-wrap balance ([60d4dec](https://github.com/getindiekit/indiekit/commit/60d4deca1e69cda2fe0fc415d2b2fab7c70258e9))





# [1.0.0-beta.11](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2024-04-09)


### Bug Fixes

* **frontend:** resolve path to css imported from node_modules ([b369ced](https://github.com/getindiekit/indiekit/commit/b369ced90db49325c378b632b5f3993914d1ca19))





# [1.0.0-beta.10](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2024-04-08)


### Bug Fixes

* **create-indiekit:** use semver for node version ([4da1170](https://github.com/getindiekit/indiekit/commit/4da1170fea8c762de1ed9f3a61906cbb1686e767))
* **endpoint-auth:** support older token verification endpoint. fixes [#716](https://github.com/getindiekit/indiekit/issues/716) ([5ed629d](https://github.com/getindiekit/indiekit/commit/5ed629d7459c5266dadbf5e918d5d528f9b0d8ac))
* **endpoint-files:** update localisations ([db0ba5b](https://github.com/getindiekit/indiekit/commit/db0ba5bf222110c7a131e5c1781ab412bac44adc))
* **endpoint-micropub:** missing renderPath param ([5a195c9](https://github.com/getindiekit/indiekit/commit/5a195c9220d9db3fdac40e6fabc2e622924768cc))
* **endpoint-micropub:** prevent slug property from being deleted ([fc3bcfc](https://github.com/getindiekit/indiekit/commit/fc3bcfc740e861785fe3503c12de2edd1df918fe))
* **endpoint-micropub:** update ptd algorithm. fixes [#711](https://github.com/getindiekit/indiekit/issues/711) ([a3d6c35](https://github.com/getindiekit/indiekit/commit/a3d6c35906e15f55e264814442e07e1b30117d22))
* **endpoint-posts:** get saved slug property ([cd52726](https://github.com/getindiekit/indiekit/commit/cd5272602626ba2ffffbeddf5e02a35b077a234c))
* **endpoint-posts:** hide image upload toolbar button for photo post type ([b05e52e](https://github.com/getindiekit/indiekit/commit/b05e52e29f8c0196a17b63f72f2cc0bc348ffeec))
* **frontend:** add class to file path input ([4afca24](https://github.com/getindiekit/indiekit/commit/4afca24d578440e323fdc174fd06d38724fe88b6))
* **frontend:** add implicit tags. fixes [#707](https://github.com/getindiekit/indiekit/issues/707) ([e7901e0](https://github.com/getindiekit/indiekit/commit/e7901e00cd4874bbd3c3504b7457d6f695def9f3))
* **frontend:** adjust heading spacing ([60524c4](https://github.com/getindiekit/indiekit/commit/60524c44afa59b975ff8c8a818d4cd5c336a9f72))
* **frontend:** don’t count markdown syntax in character count component ([90812c5](https://github.com/getindiekit/indiekit/commit/90812c5d3a47f72714bd96aeb19f0afd3f5f1687))
* **frontend:** prevent re-cloning of file picker in file input ([c115498](https://github.com/getindiekit/indiekit/commit/c11549890e452bbe72a76836158f4b385533ba7b))
* **frontend:** prevent re-cloning of find button in geo input ([7168c47](https://github.com/getindiekit/indiekit/commit/7168c4760853371e503a2f1afe5c24fac2ddd292))
* **frontend:** remove unused data attribute ([4183980](https://github.com/getindiekit/indiekit/commit/41839806713b3e423332a7ec50801f19ea1484c2))
* **frontend:** use browser exports in bundle ([d9aa206](https://github.com/getindiekit/indiekit/commit/d9aa2062b29e4be01ec270e6e4e1ed87610b93f9))
* **indiekit:** add conditional for error cause message ([97cd803](https://github.com/getindiekit/indiekit/commit/97cd803e6ad26a42fbddf83bc045c1e6fbe40db3))
* **indiekit:** update swedish localisation strings ([6cff940](https://github.com/getindiekit/indiekit/commit/6cff9403d00bbcc7239014745bc60f4e8989eb87))
* **syndicator-internet-archive:** photo path ([3db6d7f](https://github.com/getindiekit/indiekit/commit/3db6d7f071890e67896a68179ec8522eac75fd76))
* **syndicator-mastodon:** photo path ([0198f5f](https://github.com/getindiekit/indiekit/commit/0198f5faf6277651deb2d51e64442a6329b9004e))


### Features

* **create-indiekit:** add eleventy as publication preset option ([e27fc4f](https://github.com/getindiekit/indiekit/commit/e27fc4f9b16deb16c8e64ff2eeaf8625b753ab4e))
* **endpoint-auth:** show requested scopes and indicate which are supported ([91537d6](https://github.com/getindiekit/indiekit/commit/91537d6302f0f8e2851a231bc51e01dc957b8f36))
* **endpoint-files:** add web app shortcut ([80fe919](https://github.com/getindiekit/indiekit/commit/80fe919309d322513b98d2a72ae6f45a7c63a651))
* **endpoint-media:** add md5 path token ([2b0f247](https://github.com/getindiekit/indiekit/commit/2b0f2476f9c1173d697b114149316fb0e010c57d))
* **endpoint-media:** add random token ([33fd39f](https://github.com/getindiekit/indiekit/commit/33fd39f0317b745963906d5896c4dfc33fc33ef6))
* **endpoint-media:** decouple slug post property from slug token ([306596a](https://github.com/getindiekit/indiekit/commit/306596a4ccf39e78f9d493fa51f3a6ce05c4d3ec))
* **endpoint-media:** media transformations ([2061f15](https://github.com/getindiekit/indiekit/commit/2061f15341a11e788431bbbc0716b43f1e3fc001))
* **endpoint-media:** remove random token ([7042e68](https://github.com/getindiekit/indiekit/commit/7042e684f01ecd66c24f24144202b34cf33e8e09))
* **endpoint-media:** remove uuid token ([1a763a5](https://github.com/getindiekit/indiekit/commit/1a763a5a828782d934fed08fa6ea15912bb6b6b0))
* **endpoint-media:** slugify filename to make url safe ([d2beef9](https://github.com/getindiekit/indiekit/commit/d2beef96980033468fbe953760a31aa0a3551b87))
* **endpoint-media:** use publication’s media store ([98f083a](https://github.com/getindiekit/indiekit/commit/98f083a590cdb52cea194eee4884c9b8cdef82a1))
* **endpoint-micropub:** add random token ([7d91e6f](https://github.com/getindiekit/indiekit/commit/7d91e6f391f10d2af2f40d1694c0f4684f003362))
* **endpoint-micropub:** remove random token ([ce9b38b](https://github.com/getindiekit/indiekit/commit/ce9b38b912344b0442b525a25d509dd0613aa737))
* **endpoint-micropub:** remove uuid token ([6c6590e](https://github.com/getindiekit/indiekit/commit/6c6590ed168d21f70ad264ff7e7dfffb09c573cf))
* **endpoint-micropub:** revert decoupling slug post property from slug token ([8970fe3](https://github.com/getindiekit/indiekit/commit/8970fe3dc3acd7181faf887b08dbd18ae05826ae))
* **endpoint-posts:** add web app shortcut ([324213e](https://github.com/getindiekit/indiekit/commit/324213e3d9f47b76ffbcd65fcba2984fba77f879))
* **endpoint-posts:** show syndication target error ([f6f4559](https://github.com/getindiekit/indiekit/commit/f6f4559e207ec9784cfabd525d45c5374598d895))
* **endpoint-posts:** use markdown editor for content and summary fields ([c480a9f](https://github.com/getindiekit/indiekit/commit/c480a9f6739115b8845dc9ac37cee2f7d3d4a93c))
* **frontend:** add easy-markdown-editor ([714b8aa](https://github.com/getindiekit/indiekit/commit/714b8aa3f2d709557b253e88b7821c4df6648a75))
* **frontend:** add hairline border to full screen editor toolbar ([8c78cc7](https://github.com/getindiekit/indiekit/commit/8c78cc737f63d71629a66994babcd3ba490e3177))
* **frontend:** bundle javascript as es module ([47a58d6](https://github.com/getindiekit/indiekit/commit/47a58d604daec9ec9735b656b1ff85f22be90474))
* **frontend:** disable character-count component ([97b6151](https://github.com/getindiekit/indiekit/commit/97b61514638060bd2b5bcd95f01dc957917812c9))
* **frontend:** disable character-count component ([a6b0173](https://github.com/getindiekit/indiekit/commit/a6b0173a95ec0f6717229ce3ce058b6f897acd1b))
* **frontend:** file upload input component ([6082299](https://github.com/getindiekit/indiekit/commit/6082299615abc295008588bf7c78ee2a14430cbe))
* **frontend:** minify javascript bundle ([558f546](https://github.com/getindiekit/indiekit/commit/558f546ab923f705412bee843d91ce203694cb03))
* **frontend:** progress component ([e3b3791](https://github.com/getindiekit/indiekit/commit/e3b379190bc210376f19eaba852605c5f69a17f1))
* **frontend:** remove web font ([d21ad28](https://github.com/getindiekit/indiekit/commit/d21ad2837c855396100fbabaeb7e86b029bf822d))
* **frontend:** sticky glass header ([96ea922](https://github.com/getindiekit/indiekit/commit/96ea92239c3cf04fac6e6efdd66f954c6128e13c))
* **frontend:** strip final slash from pathless friendly url ([6f24cfa](https://github.com/getindiekit/indiekit/commit/6f24cfaccdabf990c997de5534642aaeb51c671f))
* **frontend:** support common markdown extensions ([3cf0b90](https://github.com/getindiekit/indiekit/commit/3cf0b90d78dff0a1c06f9d3f44d0f9357fcbef22))
* **frontend:** swap in webfont when loaded ([0e2fbcf](https://github.com/getindiekit/indiekit/commit/0e2fbcf41c1bbf2530ba42f92d83eb205d231180))
* **frontend:** update borders on block pagination ([e39c6e7](https://github.com/getindiekit/indiekit/commit/e39c6e7337171d5cce8886c1533b70791bc2fbbd))
* **frontend:** use application css and js paths ([d235828](https://github.com/getindiekit/indiekit/commit/d2358287afd8b6e8bafce8bef1adc3130c4ca605))
* **indiekit:** add shortcuts ([02b3a8d](https://github.com/getindiekit/indiekit/commit/02b3a8d4ebbec19e58b2ddd81ecc2f768aa1daec))
* **indiekit:** configure separate media store for a publication ([a08392f](https://github.com/getindiekit/indiekit/commit/a08392ff4bb381810f658d30865eb0082699cb3a))
* **indiekit:** don’t send x-powered-by header ([b797b2b](https://github.com/getindiekit/indiekit/commit/b797b2b208fa944af2556337041ec060ef9974ee))
* **indiekit:** expire session cookie after 7 days ([91a08c7](https://github.com/getindiekit/indiekit/commit/91a08c744024d9e24636f70a245c8165bb190df9))
* **indiekit:** fingerprint and immutably caching for css and js assets ([343b8ec](https://github.com/getindiekit/indiekit/commit/343b8ec7fbb8515f8bfc69c75c51a802a71f0377))
* **indiekit:** localised scopes ([fe4e98d](https://github.com/getindiekit/indiekit/commit/fe4e98d61d635f9f4db20f611d31fe150f7fcbf8))
* **indiekit:** remove mentions of IndieAuth from login view ([d78aac8](https://github.com/getindiekit/indiekit/commit/d78aac8094d80cefd14ae493966ca0b28b98b31c))
* **indiekit:** set 7 day cache on static assets ([1b7992d](https://github.com/getindiekit/indiekit/commit/1b7992deb323cd85bd93b1235fd21608b9e12e73))
* **indiekit:** set 7 day cache on web manifest ([320fd0a](https://github.com/getindiekit/indiekit/commit/320fd0aae420480988ff7d40b85786e7ad28b7d5))
* **indiekit:** use compression on responses ([7884249](https://github.com/getindiekit/indiekit/commit/788424971141a2a0f80d4e262347b7c1c364ccb0))
* **post-type-article:** show summary above content ([d3d953a](https://github.com/getindiekit/indiekit/commit/d3d953abbeea4ab8e0c7c3c26531e727e8f2cbc6))
* **post-type-audio:** use file upload component ([d3ef94f](https://github.com/getindiekit/indiekit/commit/d3ef94f097fd13e3eae8a087196259ecac147c36))
* **post-type-photo:** use file upload component ([4da8c20](https://github.com/getindiekit/indiekit/commit/4da8c20b485abe792ef59419d9b37fdd45b813bd))
* **post-type-video:** use file upload component ([b8c0fc1](https://github.com/getindiekit/indiekit/commit/b8c0fc1cc0ca976c43d77982a58d8a12e1958b3b))
* **preset-eleventy:** remove slug property ([c13c705](https://github.com/getindiekit/indiekit/commit/c13c705e4a21d12d4388add72c20278df535d64e))
* **preset-hugo:** remove slug property ([485bbf3](https://github.com/getindiekit/indiekit/commit/485bbf32279385e499081b8d8728ea36d03e5928))
* **preset-jekyll:** remove slug property ([c7b5a0a](https://github.com/getindiekit/indiekit/commit/c7b5a0a9da08606380127bdb36e30f654e53198a))
* **store-s3:** s3-compatible content store ([21e77aa](https://github.com/getindiekit/indiekit/commit/21e77aaaf65105070fe651478d61cc1ff0e84ccb))
* **syndicator-internet-archive:** return configuration errors ([685f85f](https://github.com/getindiekit/indiekit/commit/685f85f299cb7ba4cede729da818f6f44815672f))
* **syndicator-mastodon:** return configuration errors ([6ec8287](https://github.com/getindiekit/indiekit/commit/6ec82874b543e6c3eee2c6dea1d88100fc62dfde))





# [1.0.0-beta.9](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2024-03-10)


### Bug Fixes

* **frontend:** use em-based sizing for checkboxes and radios ([b987197](https://github.com/getindiekit/indiekit/commit/b98719788bebd1cf6f34685769a240e2251e7318))


### Features

* **preset-eleventy:** eleventy preset ([8229d2a](https://github.com/getindiekit/indiekit/commit/8229d2a61b675b3095768482e2a5197fd2b57a07))





# [1.0.0-beta.8](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2024-03-03)


### Bug Fixes

* **create:** update minimum supported node version ([530f25a](https://github.com/getindiekit/indiekit/commit/530f25a0ad988115dc76a382df9df74ac60a0083))
* **endpoint-auth:** only show error if message ([176fc47](https://github.com/getindiekit/indiekit/commit/176fc47cf42e575a157ed7c6c61e3d7780e782e9))
* **endpoint-micropub:** discard items in posts collection without properties ([3937452](https://github.com/getindiekit/indiekit/commit/3937452be72bb2384bd5a43ae6c75b65cf289a4d))
* **endpoint-micropub:** don’t decode date strings in query parameters ([4c6198e](https://github.com/getindiekit/indiekit/commit/4c6198e06e186bd92d429363524c9a5416feb90c))
* **endpoint-micropub:** don’t send post-type property to template ([bdb1fb3](https://github.com/getindiekit/indiekit/commit/bdb1fb3542a1fd9737d886677340d664e112f440))
* **endpoint-micropub:** fetch references for form-encoded requests ([a3ad0fa](https://github.com/getindiekit/indiekit/commit/a3ad0faaa176946065955a7f056340d4f514b77a))
* **endpoint-micropub:** files list in package.json ([f4bab79](https://github.com/getindiekit/indiekit/commit/f4bab79bccebf0ae3b1807e11833867cc2cbcf4e))
* **endpoint-micropub:** post template properties ([0eb3fd5](https://github.com/getindiekit/indiekit/commit/0eb3fd5e8d568c45c3a2ada04da382ff65ef1329))
* **endpoint-posts:** add width class to published date input ([fc21a27](https://github.com/getindiekit/indiekit/commit/fc21a27776ae2e13a94b870c069ce3ea8af2b2a6))
* **endpoint-posts:** check all day if event date has no time ([9c6c4b1](https://github.com/getindiekit/indiekit/commit/9c6c4b1857293446d2c676b62a61065944768d14))
* **endpoint-posts:** don’t return useless location property ([0778519](https://github.com/getindiekit/indiekit/commit/0778519ae5d6055a7bc4379e997938924810c2ab))
* **endpoint-posts:** index value in media post fields ([cc6dc9a](https://github.com/getindiekit/indiekit/commit/cc6dc9a0c29026a2d0b9b4ca059a20958688aa20))
* **endpoint-posts:** inline radios ([a2da82c](https://github.com/getindiekit/indiekit/commit/a2da82c0cf5d86871a062bf69c93211612746678))
* **endpoint-posts:** reading/editing geographic coordinates ([f28325a](https://github.com/getindiekit/indiekit/commit/f28325af685d2917c82acdd546dca486adcd2543))
* **endpoint-posts:** use option to enable inline radios ([dbcef51](https://github.com/getindiekit/indiekit/commit/dbcef517bc8ca8f175095560c4cfce3f6263758e))
* **frontend:** adjust icon spacing in badge component ([717817b](https://github.com/getindiekit/indiekit/commit/717817bf8eb5f67596e54833930fcacb0f24c2f2))
* **frontend:** conditional checkbox and radio inline padding ([c39017d](https://github.com/getindiekit/indiekit/commit/c39017d0051222bb8d238f95e6833cee3892db68))
* **frontend:** details spacing ([e493f85](https://github.com/getindiekit/indiekit/commit/e493f854c99694f9d8754742874cc1927eb069b9))
* **frontend:** error colors with dark scheme ([ccc68be](https://github.com/getindiekit/indiekit/commit/ccc68be7d46053c46a5143a8fcf76cd5e3748f79))
* **frontend:** error message spacing ([ba2761e](https://github.com/getindiekit/indiekit/commit/ba2761eb89aab88c613626cef641440ce2dc43f1))
* **frontend:** event-duration spacing ([dc211b9](https://github.com/getindiekit/indiekit/commit/dc211b978f33df7a15238c661ffc128577306b96))
* **frontend:** field spacing in fieldset group ([771e5c5](https://github.com/getindiekit/indiekit/commit/771e5c5914037df0f64cd8c00a166378d2e644fb))
* **frontend:** focused text colour for detail summary ([cc67ab8](https://github.com/getindiekit/indiekit/commit/cc67ab878f3c88a7b7f400d05a1b9f47fc90b1e4))
* **frontend:** force datetime input height on iOS ([d1ea3db](https://github.com/getindiekit/indiekit/commit/d1ea3db2f56c811bd1799b1050fbff49f5eef442))
* **frontend:** head order ([3968e06](https://github.com/getindiekit/indiekit/commit/3968e06a1f5b223080adb427d5055170e74b1990))
* **frontend:** hint spacing ([28cf9a2](https://github.com/getindiekit/indiekit/commit/28cf9a26e358f01d9a0e3af016b656870f4a98c8))
* **frontend:** label typography ([0c3a37d](https://github.com/getindiekit/indiekit/commit/0c3a37da0bac63d9827b0ba1d660a0d9044b1180))
* **frontend:** mark title in card component as safe ([3b374ac](https://github.com/getindiekit/indiekit/commit/3b374acecae101a59ce9089592884cfed4cfa8a8))
* **frontend:** more specific selector for tag component styles ([da5db8c](https://github.com/getindiekit/indiekit/commit/da5db8ca1559624c7d854f0094891b904de568b6))
* **frontend:** only add aria-labelledby if section has title ([db7ea28](https://github.com/getindiekit/indiekit/commit/db7ea28a1df97989c41e797c098a8ce07c541a1e))
* **frontend:** only add aria-labelledby if widget has title ([8565cbf](https://github.com/getindiekit/indiekit/commit/8565cbffd98afe2e25e3a2eff9cad61b645a8247))
* **frontend:** only apply min-block-size to authorize component when it contains client icon ([c3bbd6c](https://github.com/getindiekit/indiekit/commit/c3bbd6c3de0514fba0a8d009cabd82f29f59b901))
* **frontend:** prevent horizontal scrolling ([54d2850](https://github.com/getindiekit/indiekit/commit/54d285046842d1d4ad825d8e82092275e09ab0e4))
* **frontend:** remove any errors when cloning another item ([0a38ff9](https://github.com/getindiekit/indiekit/commit/0a38ff9d117cb8476f68ae07c7ae451643b3372f))
* **frontend:** remove width on datetime-local input ([e175dd1](https://github.com/getindiekit/indiekit/commit/e175dd14916f8cf8d2c38436bb943e81a73a906e))
* **frontend:** show full error name in notification banner ([b21db87](https://github.com/getindiekit/indiekit/commit/b21db8703ec8f7d8c9c6c61196d116b21966232a))
* **frontend:** tag input input width ([9c0a9fe](https://github.com/getindiekit/indiekit/commit/9c0a9fe69f6f18a4c1316f64008b9819ceace446))
* **frontend:** use fixed value for xs space ([6e64bd5](https://github.com/getindiekit/indiekit/commit/6e64bd5814f0e4d9abe23f4e973c20c6b8877d0a))
* **frontend:** use option to enable inline radios ([b22d42b](https://github.com/getindiekit/indiekit/commit/b22d42b63428e4037275a32024382fa3e894e06b))
* **indiekit:** add default post type dependencies ([48b586e](https://github.com/getindiekit/indiekit/commit/48b586ee3dae4e46e6857ca6fe2b0b396a9571ff))
* **indiekit:** add post type name if not provided ([dedae13](https://github.com/getindiekit/indiekit/commit/dedae13aca586002412182d831a3e54a398fb04d))
* **indiekit:** check for database before querying for posts ([f957218](https://github.com/getindiekit/indiekit/commit/f957218cc8dcd3445c7553382d5eeebcf2b39792))
* **indiekit:** get localised plug-in strings from response.locals ([8858ba4](https://github.com/getindiekit/indiekit/commit/8858ba4fe719126055c07c980eecbfc640e98473))
* **indiekit:** log don’t throw request cache errors ([16877da](https://github.com/getindiekit/indiekit/commit/16877da08b784ec33bf9a584177b152249a67b1f))
* **internet-archive:** correct option name for secretKey ([f3231c5](https://github.com/getindiekit/indiekit/commit/f3231c59705180c102870cf4a5b1c383576aeeca))
* **post-type-like:** update swedish localisation ([7aeb994](https://github.com/getindiekit/indiekit/commit/7aeb9944fe843daaf434691a5b691c5fc1c8448c))
* provide add another list in caller ([5f8f33e](https://github.com/getindiekit/indiekit/commit/5f8f33ed1b62e5817aa02a29de1d052d5b2b1fc5))
* show localised date in cards ([f03f608](https://github.com/getindiekit/indiekit/commit/f03f60850731cd36990ac4705222a827e81a5522))
* **util:** validate that media item is url ([194c291](https://github.com/getindiekit/indiekit/commit/194c2914f927f6f0c5b8aad70ecfc28ad19255ee))


### Features

* add swedish localisation from [@carlrafting](https://github.com/carlrafting) ([37f2124](https://github.com/getindiekit/indiekit/commit/37f2124dabbf6272ebb94a90f17c7758a9962a37))
* **endpoint-files:** close file properties ([e2e8faf](https://github.com/getindiekit/indiekit/commit/e2e8fafe838a3b58e90cebf1982ba27493876422))
* **endpoint-media:** log CRUD operations ([9e7b0e2](https://github.com/getindiekit/indiekit/commit/9e7b0e2e648ada823f27881256c5e1c8c15c7af2))
* **endpoint-media:** update link to documentation ([13ad159](https://github.com/getindiekit/indiekit/commit/13ad159b436a7f9cdbc04404d3949025a404f756))
* **endpoint-micropub:** add custom types to post type discovery ([1aec035](https://github.com/getindiekit/indiekit/commit/1aec035240fcd0c0558ec0f3d678207c30c44aa4))
* **endpoint-micropub:** add jam to post type discovery ([91eeae6](https://github.com/getindiekit/indiekit/commit/91eeae65b2fee23bac2ac3373a0de389bdb71d5a))
* **endpoint-micropub:** log CRUD operations ([06c7785](https://github.com/getindiekit/indiekit/commit/06c7785f02acc5d6e4d5aae94ee9535535f0e757))
* **endpoint-micropub:** query supported post type properties ([feadee6](https://github.com/getindiekit/indiekit/commit/feadee6fea95979fabea76fed67d3f56d28ec66e))
* **endpoint-micropub:** remove server commands from post template properties ([128299c](https://github.com/getindiekit/indiekit/commit/128299c08bfce21605fe333d5bd7ac05b2543e9e))
* **endpoint-micropub:** update link to documentation ([5bee191](https://github.com/getindiekit/indiekit/commit/5bee1912d13edb4469a534eb2595037ffd720369))
* **endpoint-posts:** close post properties ([1941232](https://github.com/getindiekit/indiekit/commit/19412327d493b388cd1fba4ccce37c702e2212be))
* **endpoint-posts:** delete non-mf2 post values ([5a6cc36](https://github.com/getindiekit/indiekit/commit/5a6cc36b6f736306548262c322a4b54c629e0a1b))
* **endpoint-posts:** display all property values for a post ([07e9a94](https://github.com/getindiekit/indiekit/commit/07e9a94c745e8a174cf335831e3e0d5e47639ff1))
* **endpoint-posts:** event post fields ([0deba98](https://github.com/getindiekit/indiekit/commit/0deba98fe5ccaffd64b4036df0842d51ba5b8b36))
* **endpoint-posts:** make visibility optional ([6ddb244](https://github.com/getindiekit/indiekit/commit/6ddb244122569863fd049342f576772f6fdc1cb5))
* **endpoint-posts:** new form validation ([9d9703d](https://github.com/getindiekit/indiekit/commit/9d9703da62516b922fb1361141c3ba4423211f3f))
* **endpoint-posts:** only show fields for supported properties ([650791b](https://github.com/getindiekit/indiekit/commit/650791bfc45a048926b800d2dd59a13b64ff46a7))
* **endpoint-posts:** sanitise submitted post values ([ebb0f95](https://github.com/getindiekit/indiekit/commit/ebb0f95033c33c641e42af233554289f4652f69b))
* **endpoint-posts:** show character and word count on content field ([ba769f9](https://github.com/getindiekit/indiekit/commit/ba769f9986df77316626b057402189af67fe10c0))
* **endpoint-posts:** use validation schema from post type config ([aa348c8](https://github.com/getindiekit/indiekit/commit/aa348c8d46bbeeaae56ff3e54daa014aea0404fe))
* **endpoint-share:** adjust share bookmarklet width and height ([c08ee0e](https://github.com/getindiekit/indiekit/commit/c08ee0eef231d668acce5b2cb1102ba29a34ed9a))
* **frontend:** add border to inline fieldset ([fe30dc1](https://github.com/getindiekit/indiekit/commit/fe30dc1ceab1e69db4bb83bcd156a0dd6e619c33))
* **frontend:** add items conditional to checkbox and radio components ([28892be](https://github.com/getindiekit/indiekit/commit/28892be40b4cab1471fc0fd28a64580563885a1d))
* **frontend:** additional prose styles ([14188fc](https://github.com/getindiekit/indiekit/commit/14188fc5238648b24b2c941edf59633dcb858edd))
* **frontend:** allow radios to be marked as optional ([5a39225](https://github.com/getindiekit/indiekit/commit/5a39225074c027ac4a6cd7844d2622ba100672d1))
* **frontend:** character count component ([621d582](https://github.com/getindiekit/indiekit/commit/621d582835d6c4ac2960856b219e4978c3b32156))
* **frontend:** cross, location and tick icons ([48ac368](https://github.com/getindiekit/indiekit/commit/48ac368b8094dae0bd93e5dca31f7b8aa0b201fd))
* **frontend:** event duration component ([d126e61](https://github.com/getindiekit/indiekit/commit/d126e61e924ad4a6e5f57dbb57f16f6bef115d16))
* **frontend:** isArray filter ([41060db](https://github.com/getindiekit/indiekit/commit/41060db435c958a9d7a144b40033e5f60539320b))
* **frontend:** jam post icon ([9b5bc48](https://github.com/getindiekit/indiekit/commit/9b5bc487e49c35e19427f7839ce2e0d1e2d39a6f))
* **frontend:** resize share preview window to fit form ([5f95f51](https://github.com/getindiekit/indiekit/commit/5f95f51473b8e8dba1b14947ffb822fcdaab924e))
* **frontend:** simplify minimal ui layout on narrower viewports ([925ebbf](https://github.com/getindiekit/indiekit/commit/925ebbf195c3287732edff0c634343bbf1896627))
* **frontend:** split offset and group fieldset modifiers ([435ea84](https://github.com/getindiekit/indiekit/commit/435ea84c979a5d89a9abb5d32b5f98236a9e40e5))
* **frontend:** tag component ([bf04eb9](https://github.com/getindiekit/indiekit/commit/bf04eb9e269745e1d12321cd7ed6c6aa8c68d2c2))
* **frontend:** update app icon ([b73cf33](https://github.com/getindiekit/indiekit/commit/b73cf33b86b2fbed9116c6b86fe4312a02076487))
* **frontend:** use normal font style for citations ([048635c](https://github.com/getindiekit/indiekit/commit/048635cfad4f3ee56c58edf57b6ccfe2a358ffde))
* **indiekit:** add default post type properties ([1368667](https://github.com/getindiekit/indiekit/commit/1368667fd29e2642373917e09e0452bd304701e7))
* **indiekit:** default h value to entry ([77f8d70](https://github.com/getindiekit/indiekit/commit/77f8d70695bd1268bf1357082a273492e6897eac))
* **indiekit:** gracefully shutdown server ([bbf2f8b](https://github.com/getindiekit/indiekit/commit/bbf2f8b847273678f71ca15f64ec0d5fe6d559a8))
* **indiekit:** improve mongo connection error notifications ([c42225b](https://github.com/getindiekit/indiekit/commit/c42225be850c9f412810c4da0ce03ca9a6e42e64))
* **indiekit:** keep ‘indiekit’ as default database name ([78ac4a8](https://github.com/getindiekit/indiekit/commit/78ac4a89dae608baccecc961148c027ad724f45d))
* **indiekit:** remove superfluous heading on plug-in view ([c9d572c](https://github.com/getindiekit/indiekit/commit/c9d572c08e4a43fdc8d0ef8835335385550087e8))
* **indiekit:** remove theme_color from web app manifest ([ef9f019](https://github.com/getindiekit/indiekit/commit/ef9f019551dd2cce02b2334cd6e967690a0b73ad))
* **indiekit:** translate plug-in options heading ([5975b61](https://github.com/getindiekit/indiekit/commit/5975b61f2539d3f5a7f25bc537582a4b5df719d3))
* **indiekit:** update app icon ([6a98b44](https://github.com/getindiekit/indiekit/commit/6a98b44e1a89077a425dcbfd6e9ac9ad56ed3e1d))
* **indiekit:** update link to documentation ([ded4559](https://github.com/getindiekit/indiekit/commit/ded45596378c99f7cb3a06e8ce6d1417d6254095))
* move post type validation into plug-ins via api method ([7e396bf](https://github.com/getindiekit/indiekit/commit/7e396bf961c60f122062e8f92fbf2440c05bd1bd))
* move post types into plug-ins ([841bce1](https://github.com/getindiekit/indiekit/commit/841bce15406c79edac3377c9632c6c3cc86a7d7d))
* **post-type-jam:** add locales ([a7ab137](https://github.com/getindiekit/indiekit/commit/a7ab137d6c35937415cf2b8f52f89736c87a4d5c))
* **post-type-rsvp:** update locales ([02de8b5](https://github.com/getindiekit/indiekit/commit/02de8b57a866e0024f0d3a5c261fbb7eeeac8023))
* **preset-hugo:** accept unknown post properties ([f7ccce9](https://github.com/getindiekit/indiekit/commit/f7ccce991db5c5c9b16860b9df971f9a2574a1b4))
* **preset-hugo:** support configured post types ([e0ce1ed](https://github.com/getindiekit/indiekit/commit/e0ce1ed49e5911ae01a6992d892f6e7600e1e1da))
* **preset-jekyll:** accept unknown post properties ([adbfc2a](https://github.com/getindiekit/indiekit/commit/adbfc2ae290d2d1c755c1711ecb6933baac74403))
* **preset-jekyll:** support configured post types ([e3891fa](https://github.com/getindiekit/indiekit/commit/e3891fa68a80339620c7b479506085ba64a3d2e8))
* **preset-jekyll:** use snake_case for front matter property keys ([8e9736e](https://github.com/getindiekit/indiekit/commit/8e9736e7f7085f960eb24bd599b55953d11809b5))
* remove need for plugins to provide id value ([a866ec0](https://github.com/getindiekit/indiekit/commit/a866ec053db79d368cfa9cee197521723e39a59b))
* remove need for plugins to provide meta value ([833893e](https://github.com/getindiekit/indiekit/commit/833893e0fd45747abbd44695182d889de190830c))
* **util:** isDate ([ae7b907](https://github.com/getindiekit/indiekit/commit/ae7b907c57e2a6c40b39eaa3cfd634142bd09a1a))
* **util:** regex for geographic location coordinates ([1eb1456](https://github.com/getindiekit/indiekit/commit/1eb1456f927724e442d389d870c68acb4125505b))
* **util:** santise ([2c91f5d](https://github.com/getindiekit/indiekit/commit/2c91f5d54cff3ae3d751c03bbaa18c5bd24a766c))
* **util:** validation schemes ([833a3b7](https://github.com/getindiekit/indiekit/commit/833a3b727e331bb5f73f6673501d99fae5712876))





# [1.0.0-beta.7](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2023-11-07)


### Bug Fixes

* **endpoint-posts:** show content text when editing post ([7605b86](https://github.com/getindiekit/indiekit/commit/7605b869f9cd695e53792b0cab1f3bd8f9ef20ca))
* **frontend:** secondary button color ([2cbefc7](https://github.com/getindiekit/indiekit/commit/2cbefc733b0e984166ffd5849479728007d609bb))





# [1.0.0-beta.6](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2023-11-06)


### Bug Fixes

* add missing indonesian translations ([ed3a9ce](https://github.com/getindiekit/indiekit/commit/ed3a9ce4ed4a30655e64169062faf06ecfe78819))
* **endpoint-micropub:** create file on content store when undeleting ([18e7b22](https://github.com/getindiekit/indiekit/commit/18e7b22eef61ae55e66514662a1c5b7da02ca4e7))
* **endpoint-micropub:** delete content from store ([261aca3](https://github.com/getindiekit/indiekit/commit/261aca32a43da80a29649491533637ad9b01890c))
* **endpoint-micropub:** use getObjectId util ([3df6c8b](https://github.com/getindiekit/indiekit/commit/3df6c8b12ea6d6e0c99ed03994fac8920f40d928))
* **endpoint-posts:** return content if validation error ([fbfdc2d](https://github.com/getindiekit/indiekit/commit/fbfdc2d5e9751d15c95c80ee07241f8895e25a24))
* **endpoint-syndicate:** correctly syndicate to targets ([bc1939a](https://github.com/getindiekit/indiekit/commit/bc1939a98abb1c972a8f19bae011af67852dc3b8))
* **frontend:** don’t use client-side validation on forms ([66eb7c9](https://github.com/getindiekit/indiekit/commit/66eb7c99fbbbc947b7c0cda3df26919d172b943a))
* **frontend:** fix css nesting ([84afe66](https://github.com/getindiekit/indiekit/commit/84afe664d61b58f3a0d17fcf5bcafdd7e4495da4))
* **frontend:** missing add another list item ([f428367](https://github.com/getindiekit/indiekit/commit/f428367e9be0569254129e8a444e8c55a6ad050b))
* **frontend:** remove background from file input ([fa8d337](https://github.com/getindiekit/indiekit/commit/fa8d3374aa93ee1214a3e982eb1919176891daa4))
* **frontend:** remove spacing around summary keys ([d6d8f53](https://github.com/getindiekit/indiekit/commit/d6d8f534804f22a2848bfdb72fa5128760d9b842))
* **frontend:** small icon in small button ([a193a27](https://github.com/getindiekit/indiekit/commit/a193a275b39e9fa2f6707720cf4d201c81a65a88))
* **store-gitlab:** correct uid when projectId credentials ([a06f235](https://github.com/getindiekit/indiekit/commit/a06f2356d1f70224ec9e4e6b41ac30763f17ab33))
* **util:** add mongodb as a dependency. fixes [#658](https://github.com/getindiekit/indiekit/issues/658) ([e8fd8ce](https://github.com/getindiekit/indiekit/commit/e8fd8ce87bc059b86f030db75a59f63989b60e48))


### Features

* add Latin American Spanish localisation from Claudia Botero ([8898656](https://github.com/getindiekit/indiekit/commit/8898656ab4b90c25321b6cd4aa3354eb76babc26))
* **endpoint-files:** accept micropub response with no content ([23a0adf](https://github.com/getindiekit/indiekit/commit/23a0adf6204e3b32a007cd9393f59e1ca6cdc765))
* **endpoint-files:** query media using uid ([02dbe5f](https://github.com/getindiekit/indiekit/commit/02dbe5f07a0c9cf1596915aa4348b6d922bfd979))
* **endpoint-indieauth:** use proposed indieauth icon ([d26748b](https://github.com/getindiekit/indiekit/commit/d26748b16fecd73a01370b937c761abe272123a1))
* **endpoint-media:** add uid to media properties ([3a18c3d](https://github.com/getindiekit/indiekit/commit/3a18c3d16df0c7c38f7f8ef01b1a51b3ea5d2162))
* **endpoint-media:** use proposed micropub icon ([50c3c22](https://github.com/getindiekit/indiekit/commit/50c3c22b02ac86fa7befb68e7dfefb1973fdf3bd))
* **endpoint-micropub:** add uid to post properties ([15551cc](https://github.com/getindiekit/indiekit/commit/15551ccead1423123bd11115393790702085216e))
* **endpoint-micropub:** get post count using uid ([310a351](https://github.com/getindiekit/indiekit/commit/310a3515231875706965e39d7bd77d965ed96641))
* **endpoint-micropub:** include publication date in property normalisation ([b3ddac8](https://github.com/getindiekit/indiekit/commit/b3ddac8f61dc5273b4902ec09cba7b13d4a18cb3))
* **endpoint-micropub:** use proposed micropub icon ([82f9414](https://github.com/getindiekit/indiekit/commit/82f941451666d117f1699891a1fd392c0d9c9310))
* **endpoint-posts:** accept micropub response with no content ([a20b395](https://github.com/getindiekit/indiekit/commit/a20b395a0a6d2ec64526a73b1c8f918c906e210b))
* **endpoint-posts:** basic audio post support ([6a01836](https://github.com/getindiekit/indiekit/commit/6a0183667a9401d811534f1c40503b2127b86177))
* **endpoint-posts:** basic photo post support ([e0cc7d2](https://github.com/getindiekit/indiekit/commit/e0cc7d24533367bb018e07ffcb2b7be2e2ca223b))
* **endpoint-posts:** basic video post support ([3096e7a](https://github.com/getindiekit/indiekit/commit/3096e7a38d81420c60a1991a7eee6ddfa277482e))
* **endpoint-posts:** change order of advanced options ([97d5811](https://github.com/getindiekit/indiekit/commit/97d58111f22cdfb57fd51a5757d682a7a44726c3))
* **endpoint-posts:** editable publication date ([c362219](https://github.com/getindiekit/indiekit/commit/c362219835c2d6c500cad3bcedeb5f330db407b9))
* **endpoint-posts:** locales for basic media post support ([2d5f7e0](https://github.com/getindiekit/indiekit/commit/2d5f7e03c449b9012718413aab421fa87458bf4e))
* **endpoint-posts:** query posts using uid ([32be7f4](https://github.com/getindiekit/indiekit/commit/32be7f472b2e8dca26c3233cb84de87a03137807))
* **endpoint-posts:** use add another component ([a12b052](https://github.com/getindiekit/indiekit/commit/a12b0528e861342247b49bb77eafca56fd95b38e))
* **endpoint-posts:** validate media arrays, allow for file paths ([25d14a7](https://github.com/getindiekit/indiekit/commit/25d14a700a383e6a8eed03e8184d87587ec01bcb))
* **frontend:** add another component ([0fa5e0a](https://github.com/getindiekit/indiekit/commit/0fa5e0a9291ab4046e83ead87a5b18cd8bcb813b))
* **frontend:** add attributes to fieldset legend ([084023a](https://github.com/getindiekit/indiekit/commit/084023ae04708355d6ea76342d078ed86b1de90b))
* **frontend:** add caller to input component ([e98f044](https://github.com/getindiekit/indiekit/commit/e98f044d495bd2988baa4cf765eb0687898e14c9))
* **frontend:** add element wrapping utility ([cfcfe3d](https://github.com/getindiekit/indiekit/commit/cfcfe3d536c54790e93d293155c1d214cba841b7))
* **frontend:** add localDate filter ([35bd0b3](https://github.com/getindiekit/indiekit/commit/35bd0b323ebd72f8d9fd3c77feb009a20810f618))
* **frontend:** apply focus styles to programmatically focused elements ([9c865fb](https://github.com/getindiekit/indiekit/commit/9c865fb6f611635e08ecdf80eb6d709d560250ee))
* **frontend:** conditional checkboxes ([9b6a640](https://github.com/getindiekit/indiekit/commit/9b6a64061632ea9b7276d06732a25500fdb4b1d0))
* **frontend:** conditional radios ([2c2b6b4](https://github.com/getindiekit/indiekit/commit/2c2b6b4424d9e2ba20ea832a14a0e695b0703806))
* **frontend:** customisable button padding ([1b5f278](https://github.com/getindiekit/indiekit/commit/1b5f278dbfe0d2497b6db79e1dbc85f96850f119))
* **frontend:** element option on field component ([27cca75](https://github.com/getindiekit/indiekit/commit/27cca75747931e68885b800b2126d58a015257f8))
* **frontend:** exclusive checkbox behaviour ([b722b0b](https://github.com/getindiekit/indiekit/commit/b722b0b52773491b78daec6e51f092ae0924971a))
* **frontend:** fieldset group styles ([f4dafd7](https://github.com/getindiekit/indiekit/commit/f4dafd7ed9106380721c4319c7d89d65ad90fc50))
* **frontend:** global helper to get field data ([54acbf4](https://github.com/getindiekit/indiekit/commit/54acbf4c87021b130169d53e0f9f840f02479249))
* **frontend:** icon only button component ([e7f96c2](https://github.com/getindiekit/indiekit/commit/e7f96c224a22e3e4fd349b0910cb25c2bef7c1a9))
* **frontend:** id option for summary row keys ([48de30b](https://github.com/getindiekit/indiekit/commit/48de30bfe8a5d28637a27baa4506aae8bf1a6235))
* **frontend:** increase size of touch icon ([4bb7cc1](https://github.com/getindiekit/indiekit/commit/4bb7cc188efeff0b6ed53ca5a39bed4087ded1ae))
* **frontend:** link to web app manifest ([caaa34f](https://github.com/getindiekit/indiekit/commit/caaa34ff1ddd45bed8bc20e6c16eee56ee4f620e))
* **frontend:** option to add icon title ([e145311](https://github.com/getindiekit/indiekit/commit/e145311434dec45902739396d0e441959a146d54))
* **frontend:** slugify error-list paths ([daec422](https://github.com/getindiekit/indiekit/commit/daec422ed9bb9482a9ccfe914b74683f83a13c37))
* **indiekit:** add share_target to web app manifest ([6fa88d1](https://github.com/getindiekit/indiekit/commit/6fa88d19a47e9f67e3626eef2b3a172b86e0d9a7))
* **indiekit:** web app manifest ([cd57f2c](https://github.com/getindiekit/indiekit/commit/cd57f2c5ac736ee99191d152543ac393ffd04d13))
* pass all options to slugify util ([01c4542](https://github.com/getindiekit/indiekit/commit/01c45423beceddcaa2fbbf42243a26faf79286e1))
* require node.js v20 ([4785170](https://github.com/getindiekit/indiekit/commit/47851702ebbc1372c468cedfecbc05e1111605ff))
* **store-bitbucket:** return url for createFile and updateFile ([c5adcde](https://github.com/getindiekit/indiekit/commit/c5adcdec0f64a97e0858bfd3f350553c753508ae))
* **store-file-system:** return url for createFile and updateFile ([80bbf9a](https://github.com/getindiekit/indiekit/commit/80bbf9a6d850274fa00c44bfc1e7d4e857c1fa8e))
* **store-ftp:** return url for createFile and updateFile ([440a5e8](https://github.com/getindiekit/indiekit/commit/440a5e8ff9fdc6ea590a4c46e8da71887b827c7e))
* **store-gitea:** return url for createFile and updateFile ([1ea85e8](https://github.com/getindiekit/indiekit/commit/1ea85e88172bbc74b0c920ed0e6fbf2936d86c20))
* **store-github:** return url for createFile and updateFile ([48e5f00](https://github.com/getindiekit/indiekit/commit/48e5f00f689f1c66d872f6d523762e3a6ab6f556))
* **store-gitlab:** return url for createFile and updateFile ([f63258b](https://github.com/getindiekit/indiekit/commit/f63258b24bfdbf4fb2009799632118af6ad5aef6))
* **syndicator-mastodon:** add option to include permalink in status ([ee056d8](https://github.com/getindiekit/indiekit/commit/ee056d841aebc124a8300db7a5fe988de55c8e9f))
* use url input type with placeholder ([e958fa3](https://github.com/getindiekit/indiekit/commit/e958fa3a067ac6a1d61130102075d671f7f0c646))
* **util:** format a date as local date ([ca1ad47](https://github.com/getindiekit/indiekit/commit/ca1ad47775f8e9c20d1d6d387e45fe0d651af5d6))
* **util:** get object id ([447b2a7](https://github.com/getindiekit/indiekit/commit/447b2a7949f947634ebb4f8a3132b44266a2ff87))
* **util:** get offset minutes from time zone name ([66a5cc4](https://github.com/getindiekit/indiekit/commit/66a5cc4a22ff9bc4f6195817ed20ca0c009f8d31))
* **util:** remove isUrl util ([59dd42e](https://github.com/getindiekit/indiekit/commit/59dd42e3db529318b3a7cd7bbdbb2c4e105a8cc4))





# [1.0.0-beta.5](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2023-08-04)


### Bug Fixes

* **endpoint-auth:** canonicalise client url ([0b75534](https://github.com/getindiekit/indiekit/commit/0b755343adbdd7989430118c19f609432e11c4e6))
* **endpoint-auth:** check for existence of app url ([e22b80f](https://github.com/getindiekit/indiekit/commit/e22b80f750b6237824e8c58b8e42c6eb09052511))
* **endpoint-auth:** client logo not appearing ([58faea4](https://github.com/getindiekit/indiekit/commit/58faea4a43b76c6c9683651112e7369b2224a0b5))
* **endpoint-auth:** improve client information discovery. fixes [#626](https://github.com/getindiekit/indiekit/issues/626) ([5ee9c1a](https://github.com/getindiekit/indiekit/commit/5ee9c1a3265b80d095b6d345d5647644b221bd23))
* **endpoint-media:** correct source response ([274ad1b](https://github.com/getindiekit/indiekit/commit/274ad1b69a3a542cbf2b5437db8df924e5e9b321))
* **endpoint-media:** don’t use slug separating characters in file basename ([e69b0a5](https://github.com/getindiekit/indiekit/commit/e69b0a5a79fefde7460a3ea87497248962ac746c))
* **endpoint-media:** remove unused dependency ([2cf3cb2](https://github.com/getindiekit/indiekit/commit/2cf3cb20af333ea7755c78334bcdd9b19a0cb9b7))
* **endpoint-micropub:** correct source response ([e63ea84](https://github.com/getindiekit/indiekit/commit/e63ea845270cbbcfe5636c447aba3ebb47142d62))
* **endpoint-micropub:** ensure random slug is 5 characters long ([539d8d9](https://github.com/getindiekit/indiekit/commit/539d8d94823799737f94c393ed2a365eb307e0c9))
* **endpoint-micropub:** exclude current document from aggregated post type count. fixes [#621](https://github.com/getindiekit/indiekit/issues/621) ([f6606eb](https://github.com/getindiekit/indiekit/commit/f6606eb062241de9b1253a4767ea2b7f7544ad90))
* **endpoint-micropub:** only post to content store if update includes changes ([a050649](https://github.com/getindiekit/indiekit/commit/a05064961f3675da219fa0e715a90d20eae4db06))
* **endpoint-posts:** correct back link from edit form ([9d357c3](https://github.com/getindiekit/indiekit/commit/9d357c3d079ca67895cec5206854e4ed41d377d6))
* **endpoint-posts:** missing category input label ([4e383f2](https://github.com/getindiekit/indiekit/commit/4e383f2f0b35600cdee021c5e88dada093e5af3e))
* **endpoint-posts:** uppercase rsvp in form title ([3407ba3](https://github.com/getindiekit/indiekit/commit/3407ba348a9440efaed700f29beeb4aa56ab4eaf))
* **endpoint-posts:** use accessible categories input ([b9b25d3](https://github.com/getindiekit/indiekit/commit/b9b25d33dc488e89a8e9974f1b094e691b4d7318))
* **frontend:** max inline size for images ([97d9c8c](https://github.com/getindiekit/indiekit/commit/97d9c8c80a0fe570d035b5c36ca925086e44c107))
* **frontend:** missing warning icon fallback text ([18bb9b2](https://github.com/getindiekit/indiekit/commit/18bb9b25092ff14e9ef33fe5a190559d0a4f645e))
* **frontend:** token input focus trap. fixes [#578](https://github.com/getindiekit/indiekit/issues/578) ([0b03990](https://github.com/getindiekit/indiekit/commit/0b0399004e3f6bbe7a2b94318a9c231730568a53))
* **frontend:** warning button hover colour ([0d0f367](https://github.com/getindiekit/indiekit/commit/0d0f367a289091f71c685df2ca173c38e68129c4))
* **frontend:** warning text spacing ([919e2a3](https://github.com/getindiekit/indiekit/commit/919e2a3624d9eab3cf63a0475428f32abf48b98e))
* **indiekit:** always return a status code to template ([786f128](https://github.com/getindiekit/indiekit/commit/786f128a22981c3644a5ed9b360cc9d5ca407fab))
* **store-gitea:** set content-type header ([f658fc7](https://github.com/getindiekit/indiekit/commit/f658fc7239dd525f29cf79adf04a3eef51a86130))


### Features

* **create-indiekit:** add option to generate docker files ([aba0730](https://github.com/getindiekit/indiekit/commit/aba0730e9c4a3e0ffb1da78e48307946544f2dbf))
* **create-indiekit:** remove twitter from syndicator options ([c5e37a1](https://github.com/getindiekit/indiekit/commit/c5e37a1ad5eddea088142c2110e60d86b8d524a8))
* **endpoint-auth:** shorter redirect hint on consent form ([512ed92](https://github.com/getindiekit/indiekit/commit/512ed92b9e087bce9b81525b5db2eabfd436c996))
* **endpoint-files:** remove back link ([f55eaaa](https://github.com/getindiekit/indiekit/commit/f55eaaaf71fd21846c121545d5de27decb6b11d3))
* **endpoint-media:** pass commit message as option ([74215c0](https://github.com/getindiekit/indiekit/commit/74215c074000f8f21c60fe7e3811dc774e00eff9))
* **endpoint-micropub:** file renaming for updates ([f18e9fa](https://github.com/getindiekit/indiekit/commit/f18e9fa9647190b1f4c1237965615314aa34119f))
* **endpoint-micropub:** pass commit message as option ([573c71e](https://github.com/getindiekit/indiekit/commit/573c71e5adb3bb0aace150d1527a05cb405cda84))
* **endpoint-micropub:** remove support for forced syndication ([7f72141](https://github.com/getindiekit/indiekit/commit/7f7214131c0665eed1d7394527069cc4ea02ad6c))
* **endpoint-posts:** add back link to new post form ([bb148bc](https://github.com/getindiekit/indiekit/commit/bb148bc8ace3682adc6476592be6ff2a502f9764))
* **endpoint-posts:** add hint text for slug field ([2ccd4ed](https://github.com/getindiekit/indiekit/commit/2ccd4edeba13f6c09aa64018edf7400db8b92ace))
* **endpoint-posts:** editable url slug ([1ad70ed](https://github.com/getindiekit/indiekit/commit/1ad70ed026a55aa5d26ad367296cebce6a26e5d3))
* **endpoint-posts:** new post type ([2f93ad7](https://github.com/getindiekit/indiekit/commit/2f93ad76568c2d84c7684d4ec0d283b32f483e5e))
* **endpoint-posts:** only show slug field for new posts ([86e1d90](https://github.com/getindiekit/indiekit/commit/86e1d9034792f593de84d6ab15772e80421a1c4f))
* **endpoint-posts:** remove back link ([8869296](https://github.com/getindiekit/indiekit/commit/886929678ecbac808ccdff431f8adabce8104a28))
* **endpoint-posts:** update french locale ([994627f](https://github.com/getindiekit/indiekit/commit/994627f885060f4d01f26fd47011e4c8a6d3d744))
* **error:** allow status to be set via options ([0e6d460](https://github.com/getindiekit/indiekit/commit/0e6d4605867dd1a6138413ba5d97b3474e48cae2))
* **frontend:** accessible tag input component ([f437c22](https://github.com/getindiekit/indiekit/commit/f437c22d20778e8aa8dad73d5fba66e2db20f0fd))
* **frontend:** add card component to default layout ([4c7bbd9](https://github.com/getindiekit/indiekit/commit/4c7bbd955599d1d6b8bde3428799d2829be2990f))
* **frontend:** add heading level option for card component ([0a1bcd5](https://github.com/getindiekit/indiekit/commit/0a1bcd53b3ee135b096e8324e255644c18558726))
* **frontend:** add photo option to heading component ([72ffad4](https://github.com/getindiekit/indiekit/commit/72ffad426a780416a6835030bfb5a528ac38139f))
* **frontend:** add photo to document heading ([142bf29](https://github.com/getindiekit/indiekit/commit/142bf29f6690f9be1d843c8792644ce9d0f0a233))
* **frontend:** disable automatic linking in markdown ([03e2d93](https://github.com/getindiekit/indiekit/commit/03e2d9314b6339ec49a92d28a4661f80ce4701fe))
* **frontend:** except custom back link text ([b93db16](https://github.com/getindiekit/indiekit/commit/b93db167160f44f08c32affbc10d9d000bbe007c))
* **frontend:** remove deprecated pagination localisations ([b08559f](https://github.com/getindiekit/indiekit/commit/b08559f84a490bd63099e14fc29afc7d29bfdfb1))
* **frontend:** simpler card footer layout ([79e5da8](https://github.com/getindiekit/indiekit/commit/79e5da82630da3204467ba8d288eb65a7fb8b0a4))
* **frontend:** simpler text for geo input button ([e660b78](https://github.com/getindiekit/indiekit/commit/e660b78c409e7455f7f0df50730721d902fc58e1))
* **frontend:** update samp text style ([b13f80f](https://github.com/getindiekit/indiekit/commit/b13f80f534d8acaa9da03474e00dec8e20f397fc))
* **indiekit:** move plug-in icon to heading ([5f81502](https://github.com/getindiekit/indiekit/commit/5f8150257c965f1c91de7041eef3f65b1b1f6701))
* **indiekit:** plug-in presentation in server status ([e315635](https://github.com/getindiekit/indiekit/commit/e315635292e063fd1a923f32379f36c45c440348))
* **indiekit:** remove express proxy trust ([0d56d7d](https://github.com/getindiekit/indiekit/commit/0d56d7d39da2465d89a34ace666fd22ef107151b))
* **indiekit:** restore express proxy trust ([ef89611](https://github.com/getindiekit/indiekit/commit/ef89611a37f3094aeddf4c0ee99aed29a1535581))
* remove twitter syndicator ([4ff0667](https://github.com/getindiekit/indiekit/commit/4ff066721ddc2ce08b0c5d1b40425ca0f2283dc7))
* **store-bitbucket:** file renaming for updates ([2350ac9](https://github.com/getindiekit/indiekit/commit/2350ac9b5fd4a06a4f05b0831ab203278ab025b5))
* **store-bitbucket:** provide environment variables ([0d27789](https://github.com/getindiekit/indiekit/commit/0d2778958bff6d73a82e2d5c6e2178161bfda09b))
* **store-bitbucket:** use object for optional params ([0c95340](https://github.com/getindiekit/indiekit/commit/0c9534014203d0d35922a632271a251618a99909))
* **store-file-system:** file renaming for updates ([b94cfde](https://github.com/getindiekit/indiekit/commit/b94cfde2290db55ea6ab377020bb6ae126bb1566))
* **store-ftp:** file renaming for updates ([c988dfa](https://github.com/getindiekit/indiekit/commit/c988dfad11c4e03f9766182c6d3a439080c3cd4b))
* **store-ftp:** provide environment variables ([bba1a6b](https://github.com/getindiekit/indiekit/commit/bba1a6b36842110a62c35a5ca974ba2de1e86e84))
* **store-gitea:** file renaming for updates ([18b193d](https://github.com/getindiekit/indiekit/commit/18b193d43519040f7367ccfeb3e902a4a4775b60))
* **store-gitea:** provide environment variables ([775da2e](https://github.com/getindiekit/indiekit/commit/775da2e70faa49d776d2bda1056942ba38dcea10))
* **store-gitea:** return error message ([037b47e](https://github.com/getindiekit/indiekit/commit/037b47eb2622bedb16434bc120bf1e3159ea35ee))
* **store-gitea:** use object for optional params ([19a8d97](https://github.com/getindiekit/indiekit/commit/19a8d97a6afe958493681a2ad4dda5b77a9785e7))
* **store-github:** file renaming for updates ([cda8fc1](https://github.com/getindiekit/indiekit/commit/cda8fc189a08e53a7e726871e0d69426dcc52c9d))
* **store-github:** provide environment variables ([1c4c65a](https://github.com/getindiekit/indiekit/commit/1c4c65a9e33b149e6fcb06e2ff4eeb69103cf536))
* **store-github:** use object for optional params ([aca7869](https://github.com/getindiekit/indiekit/commit/aca78699a8752f7be492b63d261ab7a0aa771820))
* **store-gitlab:** file renaming for updates ([40ced8d](https://github.com/getindiekit/indiekit/commit/40ced8d3590cd1226396737eb1ee55424df6bdcf))
* **store-gitlab:** provide environment variables ([d8240d3](https://github.com/getindiekit/indiekit/commit/d8240d3274c348a9358fbe1d47085d899cb77d7b))
* **store-gitlab:** use object for optional params ([5575d8c](https://github.com/getindiekit/indiekit/commit/5575d8ce3173afe61b77b8a6b34ad05fdb32ed61))
* **syndicator-internet-archive:** provide environment variables ([936f8b6](https://github.com/getindiekit/indiekit/commit/936f8b6fd9532e62ebcb155488faeb5c1151b903))
* **syndicator-internet-archive:** remove support for forced syndication ([637c357](https://github.com/getindiekit/indiekit/commit/637c3573e11c13f6e4ae0fa3dbaf0e7c9a06357a))
* **syndicator-mastodon:** post visibility ([0135219](https://github.com/getindiekit/indiekit/commit/01352195464d532a6e6efba9553c346f0a98b679))
* **syndicator-mastodon:** provide environment variables ([85fbe85](https://github.com/getindiekit/indiekit/commit/85fbe85cb91e25de12c80ce42ae509b120537e05))
* **syndicator-mastodon:** remove support for forced syndication ([d6f58b4](https://github.com/getindiekit/indiekit/commit/d6f58b437c3aad2b80e059c53ec71118256ed49e))
* update french localisation strings ([b649a77](https://github.com/getindiekit/indiekit/commit/b649a77809af34072776af3b89fa4a0d1190e098))
* **util:** add util package ([d0de454](https://github.com/getindiekit/indiekit/commit/d0de454315fac4f7556a5ddfd21c5dafa7401afd))
* **util:** formatDate ([062fa6a](https://github.com/getindiekit/indiekit/commit/062fa6ac9218daaf8393902164c385bc530c93fa))
* **util:** getCanonicalUrl ([52501dc](https://github.com/getindiekit/indiekit/commit/52501dc5cbddcc63095ffedbb81eba2def11ff78))
* **util:** getCursor ([52bb680](https://github.com/getindiekit/indiekit/commit/52bb6801dfedbb8611364a81d06a00523d8b4789))
* **util:** getDate ([2bb29d1](https://github.com/getindiekit/indiekit/commit/2bb29d130ee8a0412a0078dcc7eb94019d9b8475))
* **util:** getServerTimeZone ([7049e9a](https://github.com/getindiekit/indiekit/commit/7049e9a28eee77f714a3b33ee2e5fd7c38a68194))
* **util:** isSameOrigin ([bd14d3b](https://github.com/getindiekit/indiekit/commit/bd14d3b04d14e1e6862f7bbb983cfc969cba7483))
* **util:** isUrl ([3973ae5](https://github.com/getindiekit/indiekit/commit/3973ae536b4d94d07b37373dc416cda49a500a65))
* **util:** randomString ([74edb07](https://github.com/getindiekit/indiekit/commit/74edb0761f469cebe46db8b7b1433f3bccc127d1))
* **util:** slugify ([52c56c5](https://github.com/getindiekit/indiekit/commit/52c56c588b3ba1413b5387bef7acfac21bf42262))
* **util:** supplant ([d3bf184](https://github.com/getindiekit/indiekit/commit/d3bf1849485107aad81fca6f166f12e0da6eba38))





# [1.0.0-beta.4](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2023-07-02)


### Bug Fixes

* **docs:** correct language for syntax highlighting ([8e071fe](https://github.com/getindiekit/indiekit/commit/8e071fe10f48b4756da74ecdf7dca74aff552910))
* **endpoint-auth:** remove param on toString ([dd7983a](https://github.com/getindiekit/indiekit/commit/dd7983a33b42beb074140706c43a752b0249b23d))
* **endpoint-image:** correct type for cache option ([62f5e9b](https://github.com/getindiekit/indiekit/commit/62f5e9b04c746d4793b4d764cf4b5f4becf600b6))
* **endpoint-image:** no second param on Buffer.from ([1a66ca5](https://github.com/getindiekit/indiekit/commit/1a66ca5077e8a9c4487a6cad91d0fba4b53706f0))
* **endpoint-media:** correctly parse limit/offset query ([c21981e](https://github.com/getindiekit/indiekit/commit/c21981e4a4dc297be9671db71c5de277a6804d2a))
* **endpoint-media:** only add data to configured database ([ad554f8](https://github.com/getindiekit/indiekit/commit/ad554f8a2753f21821d9de200d6872b604dc8ec5))
* **endpoint-media:** respond once to source query ([7ca788e](https://github.com/getindiekit/indiekit/commit/7ca788ec77e1df617a49480c00f36a1c24a1b5cc))
* **endpoint-micropub:** correctly parse limit/offset query. fixes [#603](https://github.com/getindiekit/indiekit/issues/603) ([bacbe2d](https://github.com/getindiekit/indiekit/commit/bacbe2d98d64cefb1e11312a1ea1f3951005bc46))
* **endpoint-micropub:** missing param on mf2ToJf2 ([981db18](https://github.com/getindiekit/indiekit/commit/981db18b06dd108601c47d8fdd0f3359928aaeb0))
* **endpoint-micropub:** only add data to configured database ([ead04f7](https://github.com/getindiekit/indiekit/commit/ead04f7f8ad5f2f88f46b65d4124a198000f7a65))
* **endpoint-micropub:** respond once to source query ([e41d5a6](https://github.com/getindiekit/indiekit/commit/e41d5a68247a1c57d02baa49db66669148793e9d))
* **endpoint-posts:** default checkTargets to false ([79e6d8c](https://github.com/getindiekit/indiekit/commit/79e6d8c2e21004b7f47a752568bf137fdb48d400))
* **endpoint-posts:** only show label if syndication targets. fixes [#602](https://github.com/getindiekit/indiekit/issues/602) ([763841d](https://github.com/getindiekit/indiekit/commit/763841dc7f292d6e81f7b4afd609b2ee411377c4))
* **frontend:** add block padding to details ([70c4494](https://github.com/getindiekit/indiekit/commit/70c44948f5504a1e4ffac42cce88162deaec60a2))
* **frontend:** conditionally show pagination ([be536ee](https://github.com/getindiekit/indiekit/commit/be536ee7cc9df94ee6ae783dc0183b4ec4adb16c))
* **frontend:** correct type JSON.stringify replacer ([0366a2b](https://github.com/getindiekit/indiekit/commit/0366a2bb36515679225c86825f24247698b5d82d))
* **frontend:** correct value for classes global ([9ef433f](https://github.com/getindiekit/indiekit/commit/9ef433f93d635137256006760605d57898ff7eb9))
* **frontend:** options in details component ([fe7e797](https://github.com/getindiekit/indiekit/commit/fe7e7970b2f0477c86455372b83f357f2fc9629a))
* **indiekit:** correct minimum node version ([38be651](https://github.com/getindiekit/indiekit/commit/38be651d730c37f006761112c41c992cad0ac214))
* **indiekit:** plug-in icon size ([e7d7fc2](https://github.com/getindiekit/indiekit/commit/e7d7fc2bba266b4e6ce8b8be5ce6b54a10ea21df))
* **indiekit:** remove deprecated connection value ([7d66a10](https://github.com/getindiekit/indiekit/commit/7d66a10c70257a4ae7e6b7c3b95985eda66abd39))
* **indiekit:** remove deprecated MongoClient option ([5e3deb9](https://github.com/getindiekit/indiekit/commit/5e3deb9873e042e8d0b4a3e4dd37242d52e7e207))
* **indiekit:** remove param on toString ([6be7582](https://github.com/getindiekit/indiekit/commit/6be7582b455286ce95f9ebfcabafb5a98a1dc3be))
* **indiekit:** use string for cookieSession secret ([d628aa1](https://github.com/getindiekit/indiekit/commit/d628aa1a487259fcad277e43ceb84a4af5d4cb17))
* minimum cosmiconfig version ([9bce515](https://github.com/getindiekit/indiekit/commit/9bce515a0b59fbc937500b1f44cc2c12785aceb2))
* **preset-hugo:** add empty line between front matter and content ([26eb118](https://github.com/getindiekit/indiekit/commit/26eb1189953fdf17a4a56a7d813b89bd3f7b306f))
* **preset-jekyll:** add empty line between front matter and content ([45352e2](https://github.com/getindiekit/indiekit/commit/45352e22e52b97e9afbf6f54e9a0b2e26c01a0e6))


### Features

* enable async configuration ([f2aa036](https://github.com/getindiekit/indiekit/commit/f2aa03689085da4757e7cd279b82c921ab6058ee))
* **endpoint-auth:** introspection endpoint ([68056b1](https://github.com/getindiekit/indiekit/commit/68056b1fc6220f2f206a02a9670ee576dcad1ac0))
* **endpoint-files:** use cursor-based pagination ([c3e8f76](https://github.com/getindiekit/indiekit/commit/c3e8f76d0e93fb7fea791fd33429b934b992870e))
* **endpoint-media:** add post count token ([ff0578e](https://github.com/getindiekit/indiekit/commit/ff0578ee8a3f2fdb3f2e18abf2625c12408320f2))
* **endpoint-media:** cursor-based pagination ([f2a1667](https://github.com/getindiekit/indiekit/commit/f2a166746b19fef63e3196e55ca9871377ffe66d))
* **endpoint-media:** use media-type property ([3a6a008](https://github.com/getindiekit/indiekit/commit/3a6a008e57245892a3f3d16d65b514c47aae3d84))
* **endpoint-micropub:** cursor-based pagination ([9bc6a35](https://github.com/getindiekit/indiekit/commit/9bc6a3571825198eb034b16679ce367429d52961))
* **endpoint-posts:** use cursor-based pagination ([e6dbab7](https://github.com/getindiekit/indiekit/commit/e6dbab7ef3bc14bd45909175ca058088d9f559b6))
* **frontend:** details in notification component ([9a42bad](https://github.com/getindiekit/indiekit/commit/9a42bad6c18a1388d3fdf714da10f01dc8ce6a30))
* **frontend:** pass details to notification component ([a03562e](https://github.com/getindiekit/indiekit/commit/a03562ef2ac654b35e9058b0bfa9da1a980b9d71))
* **frontend:** remove pages global ([2f3f645](https://github.com/getindiekit/indiekit/commit/2f3f645a6eca9ce7b4b8789042baaf5ee15364e8))
* **frontend:** remove results summary from pagination component ([2245d8e](https://github.com/getindiekit/indiekit/commit/2245d8e0daf342ca469b049699eeb8cb353fcf41))
* **indiekit:** log errors ([e415ce6](https://github.com/getindiekit/indiekit/commit/e415ce6a4f5b3658e29221980063afa8de3d4bc1))
* **indiekit:** use token introspection endpoint ([712e0ac](https://github.com/getindiekit/indiekit/commit/712e0ac21b836cc8c68f40487e98e2a67466f0ee))
* move timeZone option to application ([a72ff74](https://github.com/getindiekit/indiekit/commit/a72ff74a0e32bf56b1cd697cb3989dee3be99b17))
* show stack in frontend error messages ([28f6d3f](https://github.com/getindiekit/indiekit/commit/28f6d3fc976cd15413ed079015da4e2ddb9b6365))
* **syndicator-mastodon:** check for user option ([874b2d7](https://github.com/getindiekit/indiekit/commit/874b2d7cfdde4691522a934a483925bd7dc1107f))
* **syndicator-twitter:** check for user option ([721217a](https://github.com/getindiekit/indiekit/commit/721217addb12bb14981c66f1ee8df3188a50caca))





# [1.0.0-beta.3](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2023-05-19)


### Bug Fixes

* **create-indiekit:** decode url before testing if valid ([2eb5963](https://github.com/getindiekit/indiekit/commit/2eb5963cb8e1dd0c89554f05cd166351756c714b))
* **endpoint-auth:** decode url before testing if valid ([e0cebb1](https://github.com/getindiekit/indiekit/commit/e0cebb108866c5cfe75000359675d147fd28fca7))
* **endpoint-media:** don’t require database to query config. fixes [#600](https://github.com/getindiekit/indiekit/issues/600) ([edbfc15](https://github.com/getindiekit/indiekit/commit/edbfc15528ecfae6af9e489f21c31c96ea968340))
* **endpoint-micropub:** don’t require database to query config. fixes [#600](https://github.com/getindiekit/indiekit/issues/600) ([0ffc63a](https://github.com/getindiekit/indiekit/commit/0ffc63ab98b906b48631dc052d563113bfc178f7))
* **frontend:** allow for conditional summary rows. fixes [#599](https://github.com/getindiekit/indiekit/issues/599) ([2851eff](https://github.com/getindiekit/indiekit/commit/2851eff2168568f1596e157c14f6f895e6600bf4))
* **frontend:** correct heading hierarchy in preview component ([4681e51](https://github.com/getindiekit/indiekit/commit/4681e51fae59f1d3cf53606719d66011f29630b6))
* **frontend:** increase text contrast in syntax highlighting ([078dfab](https://github.com/getindiekit/indiekit/commit/078dfab8f467f817919e1a10d1fdb1f7d8e00656))
* **frontend:** increase text contrast of preview placeholder ([5a51dc1](https://github.com/getindiekit/indiekit/commit/5a51dc194acba728e69158b7a2c7a4ecb747d8e7))
* **frontend:** prevent indented textarea content. fixes [#560](https://github.com/getindiekit/indiekit/issues/560) ([b4cbd4b](https://github.com/getindiekit/indiekit/commit/b4cbd4bcbd4ea38035c2694b3e504f1a5b37c9b2))
* **indiekit:** decode url before testing if valid ([f9f4202](https://github.com/getindiekit/indiekit/commit/f9f4202d4dd7822a4a365158b04dd0e515eac829))
* **indiekit:** use fallback post type icon on status page ([5434ac2](https://github.com/getindiekit/indiekit/commit/5434ac2af7970bc28d1b6a7d836f2dcbf2f6eb89))


### Features

* add simplified chinese ([70cbb8b](https://github.com/getindiekit/indiekit/commit/70cbb8b773e59f4fa8c8eed47486a5ebaf2dbcf9))
* don’t include mp-syndicate-to in post file ([9b6e9a7](https://github.com/getindiekit/indiekit/commit/9b6e9a7175e9ade9a3726da9a9f3794be6e4545c))
* **endpoint-media:** update database before content store ([38d39a5](https://github.com/getindiekit/indiekit/commit/38d39a5bf678a2f30ba701a989b36f327e1712e5))
* **endpoint-micropub:** update database before content store ([c6a5fbb](https://github.com/getindiekit/indiekit/commit/c6a5fbb84ff8a5dc45e71d9fe813dea9a970d188))
* **frontend:** return undefined for unknown icon name ([bda5ff1](https://github.com/getindiekit/indiekit/commit/bda5ff19982682a1c5da5ea6b9b53abea7196af5))





# [1.0.0-beta.2](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2023-01-12)


### Bug Fixes

* **endpoint-files:** absolute hrefs for action links ([19e32a1](https://github.com/getindiekit/indiekit/commit/19e32a11fa5ac8ef1c05b25ded43638aad539e12))
* **endpoint-micropub:** don’t linkify incoming context text ([7128915](https://github.com/getindiekit/indiekit/commit/71289153267c46c55fb2590cc482db9fd3e40501))
* **endpoint-micropub:** only convert content when necessary ([d2db706](https://github.com/getindiekit/indiekit/commit/d2db706998c413f22cc9329190bc6ee8e4eb152f))
* **endpoint-posts:** absolute hrefs for action links ([8274ed4](https://github.com/getindiekit/indiekit/commit/8274ed451387199b21a032f8cbeda19ee0477dcb))
* **endpoint-syndicate:** don’t syndicate posts that have already been syndicated ([711f61a](https://github.com/getindiekit/indiekit/commit/711f61ae8a5aeaba829ee7fa3e20e1d07e8b216d))
* **endpoint-syndicate:** prevent repeated syndication ([0e185d4](https://github.com/getindiekit/indiekit/commit/0e185d40604938b16a2613f92d3dd03edf01807b))
* **frontend:** don’t return attributes with falsy values ([37e15d5](https://github.com/getindiekit/indiekit/commit/37e15d59a825c1ad9c27d5db408891ca0fcb7e9a))
* **frontend:** flow relative values not widely supported ([9b7c7dc](https://github.com/getindiekit/indiekit/commit/9b7c7dc034f6902632b022ddee403725d8f081ad))
* **frontend:** prevent img overflowing container ([71f2856](https://github.com/getindiekit/indiekit/commit/71f285670912ba84271df31388774939a0026609))
* **indiekit:** enable debugging when debug flag set ([ab00b34](https://github.com/getindiekit/indiekit/commit/ab00b34a96ceda8147e8c5878cdb9205df372222))
* **indiekit:** use string not boolean to indicate current navigation item ([8777bd0](https://github.com/getindiekit/indiekit/commit/8777bd04b7af6062e8e2a2455cb013ab1988af29))
* update syndication endpoint params. fixes [#567](https://github.com/getindiekit/indiekit/issues/567) ([f7fc748](https://github.com/getindiekit/indiekit/commit/f7fc748f09f5f6e8135828f238f25b8ab2e07ac5))


### Features

* **endpoint-micropub:** allow async postTemplate method. fixes [#562](https://github.com/getindiekit/indiekit/issues/562) ([8e19a05](https://github.com/getindiekit/indiekit/commit/8e19a05d60139c5d67e6af9b385c84abf1ca921b))
* **endpoint-syndicate:** support multiple methods of supplying a token ([f0aab70](https://github.com/getindiekit/indiekit/commit/f0aab701b70d51ac758c37d6349eec1e7724a520))
* **frontend:** container utility ([47a979b](https://github.com/getindiekit/indiekit/commit/47a979b1aa41f263e7a9a7c62184205e53cd24f9))
* **frontend:** itemId global ([7bf85bc](https://github.com/getindiekit/indiekit/commit/7bf85bce4352c1c9acbd8999c54c189ab0c73e97))
* **frontend:** linkTo filter ([b7c3f18](https://github.com/getindiekit/indiekit/commit/b7c3f18624b7fcf1625f1d690c3a3e6cb1735a56))
* **frontend:** option to disable auto focus on notification banner ([797fb8b](https://github.com/getindiekit/indiekit/commit/797fb8b7c5b01996b346b15f831f25ba32923939))
* **frontend:** token input component macro ([68e7de6](https://github.com/getindiekit/indiekit/commit/68e7de657d314e74f9489184dfc506bfb8a9c3c6))
* **syndicator-mastodon:** character limit option. fixes [#572](https://github.com/getindiekit/indiekit/issues/572) ([8c026cd](https://github.com/getindiekit/indiekit/commit/8c026cd2d514eafb648c1f1fcc6992524de61a8b))





# [1.0.0-beta.1](https://github.com/getindiekit/indiekit/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2022-12-28)

### Bug Fixes

- boolean value for readonly attribute ([00e7691](https://github.com/getindiekit/indiekit/commit/00e769179d607b29feb5ae61c050d7c6baf74797))
- correct jf2 for location ([85fb6a5](https://github.com/getindiekit/indiekit/commit/85fb6a5e8375a345633745dd112431ca1770b053))
- correct mf2 for nested vocabularies when converting from jf2 ([380fc17](https://github.com/getindiekit/indiekit/commit/380fc17afc9d333ed85054954d3d1c6c009a23be))
- correctly encode html/text content containing `<`/`>` characters ([b64b7d4](https://github.com/getindiekit/indiekit/commit/b64b7d4757105ac464228706b55edf0841b7c19c))
- don’t indent textarea components. fixes [#560](https://github.com/getindiekit/indiekit/issues/560) ([b667a2f](https://github.com/getindiekit/indiekit/commit/b667a2f9e788063f138ec0ec8bb02b15099dccf2))
- **endpoint-micropub:** correct replacement of nested vocabularies ([824e660](https://github.com/getindiekit/indiekit/commit/824e660a49e7c74adda3e11fefa451683697044f))
- **endpoint-posts:** simplify radio/checkbox selection ([3b0ad05](https://github.com/getindiekit/indiekit/commit/3b0ad052d6b99d291343adf54e06ac9fae3ad40c))
- **endpoint-syndicate:** only allow local redirect ([24749ae](https://github.com/getindiekit/indiekit/commit/24749ae129babfe54eba5c46c542da42663247f8))
- **frontend:** allow fieldset to be marked as optional ([61e5ef4](https://github.com/getindiekit/indiekit/commit/61e5ef4552419d2fa32393212a25135dfd012585))
- **frontend:** button padding and positioning ([7cf57bb](https://github.com/getindiekit/indiekit/commit/7cf57bb8d17abbc21bfc97df03c82ada471f6fe5))
- **frontend:** consistent focus behaviour across components ([97c9f4f](https://github.com/getindiekit/indiekit/commit/97c9f4f6cf08a77b9c2602beda0c51500ef95351))
- **frontend:** correct element for error message ([6e1aa93](https://github.com/getindiekit/indiekit/commit/6e1aa930993ea0de41c408302bbd41977df091f5))
- **frontend:** fieldset spacing, one more time ([3f70724](https://github.com/getindiekit/indiekit/commit/3f70724f502ebe5792247b7c955b2c4b30bf8907))
- **frontend:** increase excerpt length ([618a59f](https://github.com/getindiekit/indiekit/commit/618a59fa80962171483e29f0a38138ae7aaea57f))
- **frontend:** input width classes designed to accept wider font ([320d754](https://github.com/getindiekit/indiekit/commit/320d7542adfba51f6aed464c96a272b0da80db4d))
- **frontend:** padding shift on focus ([a0966df](https://github.com/getindiekit/indiekit/commit/a0966df2ce6cf260f3a9e1eaff864814fbb7ad22))
- **frontend:** reduce prominence of details border ([f2712bf](https://github.com/getindiekit/indiekit/commit/f2712bf37bdf8b98ea8f573ce498f2c426d6bb81))
- **frontend:** visual alignment of badge text ([56b84aa](https://github.com/getindiekit/indiekit/commit/56b84aa81c635cb221ecf987249d0eacba7e3a13))
- pagination wraps if list width exceed container width ([4fd56e2](https://github.com/getindiekit/indiekit/commit/4fd56e22d89d31124f03a82ad167c1e34cce4442)), closes [getindiekit/indiekit#550](https://github.com/getindiekit/indiekit/issues/550)
- use MONGO_URL env variable if specified ([38ecc55](https://github.com/getindiekit/indiekit/commit/38ecc5575d2b4eedcaf08baf9b69380be6cf672f)), closes [getindiekit/indiekit#556](https://github.com/getindiekit/indiekit/issues/556)

### Features

- **endpoint-posts:** automatically toggle advanced options ([6b9641e](https://github.com/getindiekit/indiekit/commit/6b9641e901c2d7509906b7a0b080a56064435b2e))
- **endpoint-posts:** change order of badges ([9abffb7](https://github.com/getindiekit/indiekit/commit/9abffb765a177e8f69b0e76d759da6f029e3aa83))
- **endpoint-posts:** don’t allow editing of slug ([9806696](https://github.com/getindiekit/indiekit/commit/9806696fa554a81d066da1d392d6dfd75b0e9371))
- **endpoint-posts:** location coordinates field ([b9da438](https://github.com/getindiekit/indiekit/commit/b9da438846d3c9fb69988cd2a973c34dcdebfa9c))
- **endpoint-posts:** narrower input for slug ([0a5a78d](https://github.com/getindiekit/indiekit/commit/0a5a78d7dcd2976fd13f1823805e7d94ddbff0d8))
- **frontend:** allow for boolean attributes ([191c9da](https://github.com/getindiekit/indiekit/commit/191c9dad27e1ee61a4671edb27db8f4868d583c8))
- **frontend:** disabled button style ([045ffbd](https://github.com/getindiekit/indiekit/commit/045ffbde4e710729826eb9b1f3f17b97d2cbf325))
- **frontend:** disabled button style ([29ae633](https://github.com/getindiekit/indiekit/commit/29ae633da2e149e957a0ac066877a0fbf3a41931))
- **frontend:** font scale at smaller sizes ([c61e7ff](https://github.com/getindiekit/indiekit/commit/c61e7ff372d6219ff0dfde88889ec3c46627775d))
- **frontend:** geo input ([daa8914](https://github.com/getindiekit/indiekit/commit/daa8914ec367747f9851d827eedd429178e03dea))
- **frontend:** increase width of thickest border ([8e6f328](https://github.com/getindiekit/indiekit/commit/8e6f32869916b58cf82d665d3113dd65fbd53fac))
- **frontend:** input group ([c4af53d](https://github.com/getindiekit/indiekit/commit/c4af53db1842a0d976c7ec0adfc664149e085eb2))
- **frontend:** open option for details component ([b998fb2](https://github.com/getindiekit/indiekit/commit/b998fb2976b147c8e8ae18c62610dc8f0cecefbf))
- **frontend:** pass attributes to input fields ([efb75df](https://github.com/getindiekit/indiekit/commit/efb75df396266354f8f27cabdb26ce5701ada08e))
- **frontend:** remove border around readonly inputs ([cafbe46](https://github.com/getindiekit/indiekit/commit/cafbe46032a3b6c1c69fde996003889266ccb71e))
- **frontend:** style pre similar to blockquote ([a0ef8fc](https://github.com/getindiekit/indiekit/commit/a0ef8fc4dae3fc2af154fba2662dd98bc91bf315))
- improved french translation ([33d25cc](https://github.com/getindiekit/indiekit/commit/33d25ccd243917caa2069b56a9234b53ac3b555d))
- improved french translation ([aa12036](https://github.com/getindiekit/indiekit/commit/aa12036cff7c04b47396525c5b08ba29df005eb2))

# [1.0.0-beta.0](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.18...v1.0.0-beta.0) (2022-12-17)

### Bug Fixes

- **endpoint-posts:** post content prose ([5dc3ff2](https://github.com/getindiekit/indiekit/commit/5dc3ff21e45edefc75315d04124b2df12ec66b5e))
- **endpoint-posts:** show media within post prose ([83b52a5](https://github.com/getindiekit/indiekit/commit/83b52a54be32fb57d2b80763daf3e98b621af40b))
- **endpoint-posts:** show photo in post card ([0342daa](https://github.com/getindiekit/indiekit/commit/0342daafe47335af3357e8cf88b80c44181a168a))
- **endpoint-share:** bookmarklet window size ([6d5bce3](https://github.com/getindiekit/indiekit/commit/6d5bce34ef3e793c217134fbf67e6e54c3d5dc87))
- **endpoint-share:** use persisted access token ([dfe2b99](https://github.com/getindiekit/indiekit/commit/dfe2b995f03c493cb0ce7ace1362095cf1cbaede))
- **frontend:** clearer focused input state ([882ed45](https://github.com/getindiekit/indiekit/commit/882ed4501a2465c546102727d7f7f0ceb867bd36))
- **frontend:** error summary inline size ([330b8f5](https://github.com/getindiekit/indiekit/commit/330b8f55f5f1ab14f8f2c3b2b18ff0080e07b68d))
- **frontend:** fieldset spacing ([31764b3](https://github.com/getindiekit/indiekit/commit/31764b3b11bd4831930c6c08e9fa56fc5a5a2dee))
- **frontend:** height of token input ([4189f10](https://github.com/getindiekit/indiekit/commit/4189f1004dd2f81a77f4a549558cd3d21c23771a))
- **frontend:** icon alignment ([00906d7](https://github.com/getindiekit/indiekit/commit/00906d767fb3e90f4b2e39f9f52aeb092b07dcb8))
- **frontend:** main container padding in minimal ui ([09cab79](https://github.com/getindiekit/indiekit/commit/09cab7907fe3a20ffb29fb61f36f411a7e8947a8))
- **frontend:** still trying to figure out field(set) spacing ([e74d51c](https://github.com/getindiekit/indiekit/commit/e74d51cc8a4412870d7d98a0228f788c4fe2be0a))
- **frontend:** text wrapping in summary values ([cbe3dc9](https://github.com/getindiekit/indiekit/commit/cbe3dc9ce086fc57aa8da9a2e6f042722448562c))
- **frontend:** token input background colour on dark scheme ([e9a62a2](https://github.com/getindiekit/indiekit/commit/e9a62a229466283a1c4064db722c74386e87d5f9))
- **frontend:** warning text flow spacing override ([3fff223](https://github.com/getindiekit/indiekit/commit/3fff2237c8114f88053162ef4386a8da3dbf3ba2))
- **indiekit:** don’t use a grid to list installed plug-ins ([a03d572](https://github.com/getindiekit/indiekit/commit/a03d572f93d592d7bd935bcab65ab5480d5cf40b))
- **indiekit:** persist scope and token across views ([d8f0894](https://github.com/getindiekit/indiekit/commit/d8f0894d90db3738dbf099b951eb1a60e22eddbf))

### Features

- **endpoint-auth:** add plug-in icon ([61f961b](https://github.com/getindiekit/indiekit/commit/61f961b0a9f0f5192ab407dd1b7078c21c956dad))
- **endpoint-auth:** change colour of plug-in icon ([c5541e3](https://github.com/getindiekit/indiekit/commit/c5541e3c6cb15cc096886dd447c30e3bc9f8bd75))
- **endpoint-image:** add plug-in icon ([f550914](https://github.com/getindiekit/indiekit/commit/f550914a26fba6af17b1a4ca704a2482bfbbdc0b))
- **endpoint-media:** change colour of plugin icon ([1b8a565](https://github.com/getindiekit/indiekit/commit/1b8a5656bb78e33379fe3a47b21359fa8e191340))
- **endpoint-micropub:** change colour of plug-in icon ([f230545](https://github.com/getindiekit/indiekit/commit/f230545794bcb9362ab8dfe487c05c55a05e609a))
- **endpoint-posts:** add plug-in icon ([faacd00](https://github.com/getindiekit/indiekit/commit/faacd004784bfbe52766c6018d522f71095feb31))
- **endpoint-posts:** article summary ([7dfa215](https://github.com/getindiekit/indiekit/commit/7dfa2154a696741a3c06d76553a42844aecd248e))
- **endpoint-posts:** only show supported post types ([9e0be58](https://github.com/getindiekit/indiekit/commit/9e0be5843de1be2a1444eac5fff0e1ff8367b42c))
- **endpoint-posts:** syndicate post button ([ada4539](https://github.com/getindiekit/indiekit/commit/ada45398dc6625738a7c034cfab9061ca41861dd))
- **endpoint-share:** tweak design of plug-in icon ([a730668](https://github.com/getindiekit/indiekit/commit/a730668e2979b7f97dd1f0da3b0f064e646652b5))
- **endpoint-syndicate:** add plug-in icon ([6948294](https://github.com/getindiekit/indiekit/commit/6948294f35629a53086b773c9009039b2e6f4169))
- **endpoint-syndicate:** support form submission and redirect ([b717a56](https://github.com/getindiekit/indiekit/commit/b717a56c5f4ec573d146e32635ee2ef4a7e9ac55))
- **frontend:** allow prose font to be overridden ([c6d3dc1](https://github.com/getindiekit/indiekit/commit/c6d3dc13ee68c80944b3a2fcaff7061a53aa5586))
- **frontend:** conditional checkboxes (markup and style) ([7581f27](https://github.com/getindiekit/indiekit/commit/7581f272108dfcefbf0dadf5524f17a6ea7b6de9))
- **frontend:** conditional radios (markup and style) ([9ce64ce](https://github.com/getindiekit/indiekit/commit/9ce64ce0d4bc740e089e2c9923d3bc828cb2b06a))
- **frontend:** imageUrl filter ([4a92c83](https://github.com/getindiekit/indiekit/commit/4a92c83146efba675c946c6d943098580b8761a5))
- **frontend:** includes filter ([f2c8444](https://github.com/getindiekit/indiekit/commit/f2c8444939830b869959a3ed57e0e5a6bd30ca8e))
- **frontend:** increase maximum container size ([9587b0c](https://github.com/getindiekit/indiekit/commit/9587b0c976d073e7f9f251c8fe40bb54a9720541))
- **frontend:** lazy loading for card images ([9d87488](https://github.com/getindiekit/indiekit/commit/9d874886cd7468c1902f196a9bc4536a6b56d47c))
- **frontend:** small button variant ([18c7da9](https://github.com/getindiekit/indiekit/commit/18c7da90c5f94311c72fcdaeb02a64982693ce00))
- **frontend:** syndicate icon ([307fe0c](https://github.com/getindiekit/indiekit/commit/307fe0ca5bdaf5b84a129c5aa9ecf3261ab69e20))
- **frontend:** tweak design of default plug-in icon ([84828ef](https://github.com/getindiekit/indiekit/commit/84828efcb25b327f8b3ba4ce8f1b4effb2889e24))
- **frontend:** tweak design of not-found image ([2153f71](https://github.com/getindiekit/indiekit/commit/2153f7176e568c7a898098ab692185a5a98e4378))
- **frontend:** use prose for card meta ([b59271f](https://github.com/getindiekit/indiekit/commit/b59271f72c4b52f7f8aa909b3aac2511692e282b))
- **store-file-system:** tweak design of plug-in icon ([35c7795](https://github.com/getindiekit/indiekit/commit/35c7795193840b96e771ead85b54037bb4bf0ab2))
- **store-ftp:** tweak design of plug-in icon ([5ca9dd5](https://github.com/getindiekit/indiekit/commit/5ca9dd5c12d9885425540389bfc3ab88901692a2))
- update locale catalogs ([ff4fecd](https://github.com/getindiekit/indiekit/commit/ff4fecdd200aa6cd7839475a5050426cd60f1b2f))

# [1.0.0-alpha.18](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2022-12-14)

### Bug Fixes

- **endpoint-auth:** move buttons outside fieldset ([f72a3d9](https://github.com/getindiekit/indiekit/commit/f72a3d9ac72854234682e5fd94f8ce81b7e75f20))
- **endpoint-auth:** remove fieldset from new password view ([0ccb12b](https://github.com/getindiekit/indiekit/commit/0ccb12bfb36a590913a89b3986c2fd6234f96766))
- **endpoint-auth:** use notification not warning for new password setup ([f37a493](https://github.com/getindiekit/indiekit/commit/f37a493a97496a8261e489e9f82aea6c68da558e))
- **endpoint-files:** move buttons outside fieldset ([3d2c7d6](https://github.com/getindiekit/indiekit/commit/3d2c7d62b6ea617374f5c5ceacecf4e1751d667c))
- **endpoint-files:** use prose for download link ([4a2df56](https://github.com/getindiekit/indiekit/commit/4a2df56884f120f21d99e3cf5cb62a6a926c7740))
- **endpoint-micropub:** correct response for source url query ([55120e7](https://github.com/getindiekit/indiekit/commit/55120e7e430fa4a4c384cda150db7622e93a62c1))
- **endpoint-micropub:** only update post-status property after publishing ([38a78e2](https://github.com/getindiekit/indiekit/commit/38a78e28ebc718548dfcd1bb43096aa9be3dba13))
- **endpoint-posts:** correct localisation string for widget title ([62a1a3b](https://github.com/getindiekit/indiekit/commit/62a1a3b53367287a2e6c43a72a8289e86bef2e0b))
- **endpoint-posts:** missing parent post name text ([e3c60df](https://github.com/getindiekit/indiekit/commit/e3c60dfb75e115e975ab26ad878de68c3eea53ff))
- **endpoint-posts:** move buttons outside fieldset ([a218438](https://github.com/getindiekit/indiekit/commit/a218438aca2d73657550dceeda171c5ecdfa7e35))
- **endpoint-posts:** use correct response from micropub source url query ([ad7e55c](https://github.com/getindiekit/indiekit/commit/ad7e55cdbd559fa5f688777b430ac5f11398da95))
- **endpoint-posts:** use deleted (not post-status) property to indicate deleted posts ([af1d108](https://github.com/getindiekit/indiekit/commit/af1d10875c9eca3d800ba75bf938021514196332))
- **endpoint-share:** don’t remove preview values on page load ([4faaa6a](https://github.com/getindiekit/indiekit/commit/4faaa6aeaf4fd8dbe09e1dab502c39bd80e74237))
- **endpoint-share:** move buttons outside fieldset ([bf39196](https://github.com/getindiekit/indiekit/commit/bf3919616de7b0ae02d84d2e58fb9685a8fc4eb8))
- **frontend:** add outline to offset badge ([b2cb3c2](https://github.com/getindiekit/indiekit/commit/b2cb3c20903082484659fedd425c8fe00e82cd3b))
- **frontend:** badge component style refinement ([35100ba](https://github.com/getindiekit/indiekit/commit/35100ba7d0efee77560901d9a64d7a855408fc22))
- **frontend:** base style for textarea ([8adac07](https://github.com/getindiekit/indiekit/commit/8adac07eae200984069c8faa88abfb72b78624f1))
- **frontend:** check for actions in summary row ([d339ad1](https://github.com/getindiekit/indiekit/commit/d339ad167a39db6fee44ab3d635f2acf488c1df0))
- **frontend:** correct errorMessage options ([cd0c4f4](https://github.com/getindiekit/indiekit/commit/cd0c4f44c188f5fca1afda1025b5a83451c58ece))
- **frontend:** define font for button, allowing override ([89629b6](https://github.com/getindiekit/indiekit/commit/89629b6136be639ece5eb39d6126cc2d87a0f23c))
- **frontend:** define font for inputs ([5f9ffd5](https://github.com/getindiekit/indiekit/commit/5f9ffd5e772dcb843ffff19bc208b5c5f21c9e46))
- **frontend:** ensure focus ring stays above other content ([9c87d31](https://github.com/getindiekit/indiekit/commit/9c87d31fce9b940bf59de9a82b323e35e1a8530f))
- **frontend:** limit heading line length ([99897ba](https://github.com/getindiekit/indiekit/commit/99897bada30235b3b2b5493b8901095589039d8e))
- **frontend:** main container spacing ([6ed14dc](https://github.com/getindiekit/indiekit/commit/6ed14dc3560b23317f902c81f28c192f5b9d1bf1))
- **frontend:** offset badge colour ([697ee7c](https://github.com/getindiekit/indiekit/commit/697ee7ca45c632dfecb81f5572bf6493d2020145))
- **frontend:** only list actions with text ([2ddcbbc](https://github.com/getindiekit/indiekit/commit/2ddcbbc9ebb7a080631ad08b1de9f10f7b1df202))
- **frontend:** remove field spacing after visually hidden elements ([8442e67](https://github.com/getindiekit/indiekit/commit/8442e67b1889e34c4de2d972f5dcd0b5b697a43a))
- **frontend:** smaller description excerpt on card ([d0fdb24](https://github.com/getindiekit/indiekit/commit/d0fdb249028731f81f886f4d49374a60a3c7c8ca))
- **indiekit:** always show access token on status page ([f7457ae](https://github.com/getindiekit/indiekit/commit/f7457ae06cef3fd958b968d476d01bf0d4a89d3a))
- **indiekit:** remove fieldset from login view ([84b04ac](https://github.com/getindiekit/indiekit/commit/84b04acaae4efebbef0fdebc294f351a3be78b0c))
- **micropub:** use existing post status, if present, when not in draft mode ([4f1baf5](https://github.com/getindiekit/indiekit/commit/4f1baf52d22a18a818b59ea54e926d75a8449198))
- **preset-hugo:** populate publishDate with published property ([e4a4140](https://github.com/getindiekit/indiekit/commit/e4a41406f01db158d1f42fe9f099ca4dab2531e1))
- **preset-jekyll:** use false value for published if draft post status ([11177ac](https://github.com/getindiekit/indiekit/commit/11177acfac06abb59b502249dc584065eee9be05))
- **syndicator-mastodon:** throw error if reply post not relevant ([98544ec](https://github.com/getindiekit/indiekit/commit/98544ecc3e99e7c608613e0ff8cc44f74aeb96c2))
- **syndicator-twitter:** throw error if reply post not relevant ([0bdf3e6](https://github.com/getindiekit/indiekit/commit/0bdf3e6ef2ed46da7d22f52958bc0ea79565a696))

### Features

- **endpoint-files:** return 404 if no file ([86ef71d](https://github.com/getindiekit/indiekit/commit/86ef71dffb34c13f72f67d1fcdb326d107bc01ec))
- **endpoint-files:** show post type icon in file card ([8964f0f](https://github.com/getindiekit/indiekit/commit/8964f0fd9d16f144ef5d87a4551e6d29fd1c9bbf))
- **endpoint-files:** use details component for file properties ([f2efacc](https://github.com/getindiekit/indiekit/commit/f2efacc0e2ddc235098d65e692cf2e6eb7ac4eac))
- **endpoint-media:** sort source query by published date ([6bf5e7a](https://github.com/getindiekit/indiekit/commit/6bf5e7a6d18a0f14d35176b9a63963dd442b7f81))
- **endpoint-micropub:** refactor delete/undelete ([118c0e3](https://github.com/getindiekit/indiekit/commit/118c0e3d904e6fa5e79d2c7de5a74f383e1aebdc))
- **endpoint-micropub:** say restored, not undelete ([261a956](https://github.com/getindiekit/indiekit/commit/261a956689f03ca4f459818618cc0ce69212dbe5))
- **endpoint-micropub:** say restored, not undelete ([db7308e](https://github.com/getindiekit/indiekit/commit/db7308e2f31c5c21d290a7325dd085e38d738c3b))
- **endpoint-micropub:** sort source query by published date ([52d9350](https://github.com/getindiekit/indiekit/commit/52d935079f499eac0c53eaffb7a5cd1d922cc563))
- **endpoint-posts:** categories ([19b9174](https://github.com/getindiekit/indiekit/commit/19b9174eebbdde3a91f4f4479e135c0ddb4f1893))
- **endpoint-posts:** create (note) post ([0309377](https://github.com/getindiekit/indiekit/commit/030937796ff94836f0f24ce6325bac4f33de7934))
- **endpoint-posts:** create article or bookmark post ([b4a7ce8](https://github.com/getindiekit/indiekit/commit/b4a7ce836afe5c681f38aace35a9da1f90419f50))
- **endpoint-posts:** create/update like post ([93bb8d1](https://github.com/getindiekit/indiekit/commit/93bb8d11e317c9a844093deefae1f4dbd5d44b67))
- **endpoint-posts:** create/update reply post ([62da2ed](https://github.com/getindiekit/indiekit/commit/62da2ed2621b12a5c1f9c6485321fd01b906dcf5))
- **endpoint-posts:** create/update repost post ([acb1b2b](https://github.com/getindiekit/indiekit/commit/acb1b2bc79dee31a9f0814328f2d85fdade648d5))
- **endpoint-posts:** create/update rsvp post ([c30ba8f](https://github.com/getindiekit/indiekit/commit/c30ba8f25050bf39b5916674536fd56a68a2afc1))
- **endpoint-posts:** display post status ([facc6ce](https://github.com/getindiekit/indiekit/commit/facc6cecff8973bef138986d134154f141de64bf))
- **endpoint-posts:** edit post ([11fcef9](https://github.com/getindiekit/indiekit/commit/11fcef922dc5ec27cc70851256e014294407a31d))
- **endpoint-posts:** return 404 if no post ([1f37040](https://github.com/getindiekit/indiekit/commit/1f370403b6279cab7b7bd4eba56e20355d0b570a))
- **endpoint-posts:** undelete post ([dc6a92a](https://github.com/getindiekit/indiekit/commit/dc6a92afdb4fe29254a31e6d19d064e776817dc9))
- **endpoint-posts:** update new post url ([f6bd9a6](https://github.com/getindiekit/indiekit/commit/f6bd9a689b7bf274a98a8a42664d7d652c2ce6d3))
- **endpoint-posts:** use details component for file properties ([487bb4b](https://github.com/getindiekit/indiekit/commit/487bb4ba5afd05350c2e27bea00effc21f0e9fd9))
- **endpoint-syndicate:** find posts with syndication target(s) ([29dda48](https://github.com/getindiekit/indiekit/commit/29dda482dba18e55a65718c8dbd61e42d360cfb9))
- **endpoint-syndicate:** only syndicate posts with published post status ([920d463](https://github.com/getindiekit/indiekit/commit/920d4638a2ce494c7cb9d6b75888453c8b50ceff))
- **endpoint:** add updated date when updating post ([4c98091](https://github.com/getindiekit/indiekit/commit/4c980912a014bb178e726aed345b6c9cd287737f))
- **frontend:** add block outside of fieldset, add form block ([602caa0](https://github.com/getindiekit/indiekit/commit/602caa0b1da637576a801b31f17811abbfbe56e9))
- **frontend:** add undelete icon ([c88daa4](https://github.com/getindiekit/indiekit/commit/c88daa4816011d71f9595e2c76ca7af56db2c76b))
- **frontend:** allow label to be a page heading ([cc2a942](https://github.com/getindiekit/indiekit/commit/cc2a942fa04413ff2df3b4407835d8ab8924b94d))
- **frontend:** badge component ([7666d5f](https://github.com/getindiekit/indiekit/commit/7666d5f9ffc38b90e70352fa65e264864fc0aed6))
- **frontend:** better display of code values in summary rows ([903d2b4](https://github.com/getindiekit/indiekit/commit/903d2b4d0862b2122a21984529d7e90983e07025))
- **frontend:** button-group style ([340edb8](https://github.com/getindiekit/indiekit/commit/340edb8c25c4c62fec8b7db0fae8a31a94dc9c39))
- **frontend:** card component ([f3ebbf8](https://github.com/getindiekit/indiekit/commit/f3ebbf85f7b9a29d5b03c427cb83fad72e54fa20))
- **frontend:** createPost icon ([7eaf867](https://github.com/getindiekit/indiekit/commit/7eaf867688cec9142b8d8a937a021288d269faa7))
- **frontend:** declarative colour and size properties on badge component ([10529a9](https://github.com/getindiekit/indiekit/commit/10529a9cc7cb4b1879070269b20d88c089556386))
- **frontend:** define colour to use on focus ([c8bc279](https://github.com/getindiekit/indiekit/commit/c8bc279c57d0b9f6c456413525307f3aa2577739))
- **frontend:** delete file list component ([f0c666e](https://github.com/getindiekit/indiekit/commit/f0c666e2fcb10c67300d3b305c9300b8615bd155))
- **frontend:** details component ([981cf18](https://github.com/getindiekit/indiekit/commit/981cf18d3da5e094aab53c19c4dbc168811399e1))
- **frontend:** excerpt filter ([93134ff](https://github.com/getindiekit/indiekit/commit/93134ff6133928c87108d32cf7299231dfc797c6))
- **frontend:** header navigation styles ([ff73d89](https://github.com/getindiekit/indiekit/commit/ff73d891c80a7737d6dce62d3502ee6de5abb725))
- **frontend:** review accessibility and design of notification component ([0e4dff1](https://github.com/getindiekit/indiekit/commit/0e4dff15137f83a7a06e59a1315e1bc0f5480f5c))
- **frontend:** style for current navigation item ([7ccaa09](https://github.com/getindiekit/indiekit/commit/7ccaa09dfa88efeeb6059c8425bf4b2c79a97390))
- **frontend:** token input ([b9a58a6](https://github.com/getindiekit/indiekit/commit/b9a58a6259db61c2313f15718245c99527e2f721))
- **frontend:** updatePost icon ([f78190a](https://github.com/getindiekit/indiekit/commit/f78190ad36b37101c679f957fe1cb1b84782d62b))
- **frontend:** use mona sans ([0c4a64d](https://github.com/getindiekit/indiekit/commit/0c4a64dc21b874de134dfdb45e87f76c315a3175))
- **frontend:** widont filter ([675f945](https://github.com/getindiekit/indiekit/commit/675f945eea9ec638318db3ab39e21dc4b7600fbe))
- **indiekit:** indicate current navigation item ([a8a492a](https://github.com/getindiekit/indiekit/commit/a8a492ab45c7901a78c9a1f67fe88c408e1ff9ba))
- **preset-hugo:** populate expiryDate if deleted property ([7d7573f](https://github.com/getindiekit/indiekit/commit/7d7573ff33eba9008ac0a98cae42c0e2bcc6fa6f))
- **preset-hugo:** populate lastmod if updated property ([77b9a10](https://github.com/getindiekit/indiekit/commit/77b9a1045788576f8cc236f4ee107936670d565c))
- **preset-jekyll:** populate deleted if deleted property ([47a599b](https://github.com/getindiekit/indiekit/commit/47a599ba4bac1fd6d301bfc78c7aef4b69cf4581))
- **preset-jekyll:** populate updated if updated property ([00e4887](https://github.com/getindiekit/indiekit/commit/00e4887b30995a51eefa34824c545222b035ef8b))

# [1.0.0-alpha.17](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2022-12-07)

### Bug Fixes

- **endpoint-files:** correct delete page title ([206b3d9](https://github.com/getindiekit/indiekit/commit/206b3d9f905e36d672802be4e03ca434f8936926))
- **endpoint-files:** only show widget contents if database ([16e6384](https://github.com/getindiekit/indiekit/commit/16e6384635f4b215565f8ad191ec82ca2899060a))
- **endpoint-files:** use unique view name ([f858fdc](https://github.com/getindiekit/indiekit/commit/f858fdc891a6c1b2bd99a700921fcc6fa38af8e1))
- **endpoint-media:** delete record from database ([3dff8ff](https://github.com/getindiekit/indiekit/commit/3dff8ff6fb9f85eb80718ac916fdbf09e61bbd0a))
- **endpoint-micropub:** enforce arrays for syndication, only add targets when creating data ([516d479](https://github.com/getindiekit/indiekit/commit/516d47925384236f60711b62169642321c23bbb8))
- **endpoint-posts:** only show widget contents if database ([b884385](https://github.com/getindiekit/indiekit/commit/b884385e62f42bd49436d4c2da1ed48262f51844))
- **endpoint-syndicator:** don’t throw if syndication fails ([b429a38](https://github.com/getindiekit/indiekit/commit/b429a3892d87c07c3df0518cc26cbaf307b93129))
- **endpoint-syndicator:** retain syndication targets that failed ([1eea6ca](https://github.com/getindiekit/indiekit/commit/1eea6cafc4863ca9ec00420b94d8e568f8cfa5ca))
- **frontend:** back link default text ([3fd8626](https://github.com/getindiekit/indiekit/commit/3fd8626619ff09271689f58ba866048fdb0d82d5))
- **frontend:** consistent anchor styling ([a643aac](https://github.com/getindiekit/indiekit/commit/a643aac38f0560eb2d78e70e4f218b56fd4ffe4e))
- **frontend:** enable overflow wrap within hint component ([af08ab8](https://github.com/getindiekit/indiekit/commit/af08ab8cfeb673c90afa75968bf76c7e6e6c443d))
- **frontend:** fieldset spacing ([642982d](https://github.com/getindiekit/indiekit/commit/642982d9eb75bd47c7324de6a0ee3a7ba8e14ac0))
- **frontend:** footer items alignment ([b7e2893](https://github.com/getindiekit/indiekit/commit/b7e28932672a7a8ae6cf77c0552cfc449ab6763b))
- **frontend:** increase error contrast ([5a69113](https://github.com/getindiekit/indiekit/commit/5a69113d5c984084299ba359dc5c19fa7e33b9e6))
- **frontend:** only adjust position of svg icons ([796be05](https://github.com/getindiekit/indiekit/commit/796be059f71d13519a639c27fdc600be6616bba6))
- **frontend:** revisit field and fieldset set flow scope ([d3f01db](https://github.com/getindiekit/indiekit/commit/d3f01dbd908aac58e2ead7ea081c5b2ae9ba59bd))
- **frontend:** text wrapping in summary key ([07fa951](https://github.com/getindiekit/indiekit/commit/07fa9514089720d0a59e6aa9c81e3752d95ed618))
- **frontend:** wrapping of code in summary lists ([79426c3](https://github.com/getindiekit/indiekit/commit/79426c386e79117cabe1446a7a4c73c673880c4f))
- **indiekit:** sort categories array ([1c01e0e](https://github.com/getindiekit/indiekit/commit/1c01e0e04bc777e5a447d4c57b8e690bc3b01d07))

### Features

- **endpoint-auth:** change order of scopes ([44f7cd6](https://github.com/getindiekit/indiekit/commit/44f7cd60e86e59217425cdbe7f4688bda3706935))
- **endpoint-files:** delete file ([f4649ed](https://github.com/getindiekit/indiekit/commit/f4649edb1c5934cb7bd87b00f3d9abf57dba0d17))
- **endpoint-files:** get file name from url ([61f3e28](https://github.com/getindiekit/indiekit/commit/61f3e2878de8a7c0f12ae33bbda6dc9a88524c16))
- **endpoint-files:** homepage widget ([870bbd8](https://github.com/getindiekit/indiekit/commit/870bbd876cd3ec7831134ab116bfa8ae7284d339))
- **endpoint-files:** respect scope permissions ([a79ef8d](https://github.com/getindiekit/indiekit/commit/a79ef8dd1964230718ef068b9466bad99421261c))
- **endpoint-files:** use card grid component ([bfa8e8d](https://github.com/getindiekit/indiekit/commit/bfa8e8dd3e0fdcdc42e4583e853debd45cdc744c))
- **endpoint-files:** use prose for empty state ([0cab0bf](https://github.com/getindiekit/indiekit/commit/0cab0bfc87c8f2bf5d76853aefb90f73a2221d1d))
- **endpoint-json-feed:** make json feed an endpoint plug-in ([d3832f3](https://github.com/getindiekit/indiekit/commit/d3832f3c3b8ec79bd6f94c5a6f8857c7c328f608))
- **endpoint-json-feed:** use widget component ([a6bb84b](https://github.com/getindiekit/indiekit/commit/a6bb84b0e6267c0d0f626892a94615efd449c02c))
- **endpoint-media:** check scope against multiple actions ([144d06c](https://github.com/getindiekit/indiekit/commit/144d06cb72f502f4b0b369cb8b90ab9082663b97))
- **endpoint-media:** delete media action ([bf2ea72](https://github.com/getindiekit/indiekit/commit/bf2ea72aa942c6c22620476a39f46019c3a16950))
- **endpoint-media:** don’t record last action ([5b12042](https://github.com/getindiekit/indiekit/commit/5b12042dc1705e20c6a2ef640196583249646cfb))
- **endpoint-media:** remove path components from source query response ([d8ae9cb](https://github.com/getindiekit/indiekit/commit/d8ae9cb3f478732134ef46798cdc2149f5f145e9))
- **endpoint-micropub:** replace last action with post-status property ([6350d7f](https://github.com/getindiekit/indiekit/commit/6350d7faebb9a1b50e01a9e3cb9f26e619f0b465))
- **endpoint-micropub:** smarter replace operation for array values ([b610e3e](https://github.com/getindiekit/indiekit/commit/b610e3e7418760805047879992f29814a161ac41))
- **endpoint-micropub:** smarter replace operation with empty array ([dcdcf31](https://github.com/getindiekit/indiekit/commit/dcdcf315cc05652df3b1f8f743ece86268eb7380))
- **endpoint-posts:** delete post ([af98b4b](https://github.com/getindiekit/indiekit/commit/af98b4be57e4daee4ba855facc97945d496c27b2))
- **endpoint-posts:** homepage widget ([4191e94](https://github.com/getindiekit/indiekit/commit/4191e94fbeb671acecd3e940c29696ee6262982d))
- **endpoint-posts:** use prose for empty state ([daf205f](https://github.com/getindiekit/indiekit/commit/daf205f0b4b1ad510c616967565c34d20d2c8101))
- **endpoint-share:** plug-in icon ([eb8d660](https://github.com/getindiekit/indiekit/commit/eb8d660af83d28a0628b56e67ac57515cbbd6462))
- **endpoint-share:** remove navigation item ([718a9c7](https://github.com/getindiekit/indiekit/commit/718a9c7d46d73fb2b74d15f335c19cd925e33970))
- **endpoint-share:** use widget component ([7297678](https://github.com/getindiekit/indiekit/commit/7297678c653d27d0a926b11c9863b18deba9e3a4))
- **fronted:** allow card grid component to accept more media types and include a published date ([ea3f2bc](https://github.com/getindiekit/indiekit/commit/ea3f2bc223a06fcca41973a6d9b0bb807e198757))
- **frontend:** actions component ([17a15b4](https://github.com/getindiekit/indiekit/commit/17a15b412eb74f329f30669245fb2faf7d88d2f0))
- **frontend:** additional button component styles ([a2236a3](https://github.com/getindiekit/indiekit/commit/a2236a3f8b949c2da99791f2d73566ca90e3a60c))
- **frontend:** back link component ([5f4ed1d](https://github.com/getindiekit/indiekit/commit/5f4ed1db73dbbaa37d24cbde0b25c2d06e822e98))
- **frontend:** delete icon ([4570dec](https://github.com/getindiekit/indiekit/commit/4570dec4f91c3537172bdd89d6609f5f68411d22))
- **frontend:** deleted file style ([98a5778](https://github.com/getindiekit/indiekit/commit/98a5778ba140419059bd3c7dadb40f9b33584594))
- **frontend:** enforce line measure upon flow content ([ab1cab0](https://github.com/getindiekit/indiekit/commit/ab1cab000672c27bf6764496c8330c72afaa8f32))
- **frontend:** remove file grid component ([a45cb8a](https://github.com/getindiekit/indiekit/commit/a45cb8a4b38d6cd7fd0270f7b3b373c0165d9914))
- **frontend:** skip link component ([3e33881](https://github.com/getindiekit/indiekit/commit/3e338819b821ba28778aad6c7c15459e4ddfcf51))
- **frontend:** warning button style ([b0463f0](https://github.com/getindiekit/indiekit/commit/b0463f019da6e467ed6a8ed098f171869ebd54b9))
- **frontend:** widget component ([4de91b7](https://github.com/getindiekit/indiekit/commit/4de91b7c4b563866c5a155b5e90641dc59c666f0))
- **indiekit:** homepage widgets ([7446652](https://github.com/getindiekit/indiekit/commit/7446652298a00123359f8ee57212a50d652edeec))
- **indiekit:** remove json feed ([533a524](https://github.com/getindiekit/indiekit/commit/533a524f7883e031b4c976d379a5cc96695ddad4))
- **indiekit:** split homepage from server status ([f4782db](https://github.com/getindiekit/indiekit/commit/f4782db19ef1245ca4c1f7f879783482e2b27f80))
- **indiekit:** update label for delete scope ([dd52ef9](https://github.com/getindiekit/indiekit/commit/dd52ef99c249389ca2a855046cea19a7fb6be5e3))
- **preset-hugo:** rename rsvp post type ([00b7bf1](https://github.com/getindiekit/indiekit/commit/00b7bf1f1c5f34b3900386c84bb0d34fcb7e1ac6))
- **preset-jekyll:** rename rsvp post type ([d3e9cdb](https://github.com/getindiekit/indiekit/commit/d3e9cdb5f7e7a4e7f128f3492adc104ed8d9e7fe))

# [1.0.0-alpha.16](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2022-12-02)

### Bug Fixes

- **frontend:** background colour for client icon ([612f30a](https://github.com/getindiekit/indiekit/commit/612f30adaadbab403960dff04061cb554da617e8))
- **frontend:** dark mode ([5b488b2](https://github.com/getindiekit/indiekit/commit/5b488b2ffde65fe2fc9a4662e7d17c5e1f651733))
- **frontend:** don’t set theme-colour ([ae28807](https://github.com/getindiekit/indiekit/commit/ae28807f407d8e06ef374236362cb9b27077c093))
- **frontend:** error appearance with minimal ui ([a958b04](https://github.com/getindiekit/indiekit/commit/a958b040151a6137380ce6501c009270feb7a5ab))
- **frontend:** fieldset and field classes ([0837a7b](https://github.com/getindiekit/indiekit/commit/0837a7b3e2039a1184f39fd5cb7a2bd1660688d4))
- **frontend:** increase space below legend in nested fieldsets ([2c04dd2](https://github.com/getindiekit/indiekit/commit/2c04dd2aa5b2d2c4a764f2f754e16f043a407a93))
- **frontend:** notification anchor style ([c1544ff](https://github.com/getindiekit/indiekit/commit/c1544fff47009ff72a9f89c99e9f15b913a68436))
- **frontend:** rendering of line breaks in preview ([6332d83](https://github.com/getindiekit/indiekit/commit/6332d839f811719734ea649a44c168996506a473))
- **frontend:** summary row wrapping ([672554c](https://github.com/getindiekit/indiekit/commit/672554c5ccea01dbd4d6ba6eb744035bd56fa380))
- **frontend:** tweak adjusted height of textarea ([8789268](https://github.com/getindiekit/indiekit/commit/878926873935776fb2fddb9d5a9c9342896402ba))
- **indiekit:** non-closing dt element ([c3032a5](https://github.com/getindiekit/indiekit/commit/c3032a55d67f8281b1e0ffa0b357f2b147892950))
- **syndicator-twitter:** correct curve in logo ([d78bf99](https://github.com/getindiekit/indiekit/commit/d78bf995932696b4d8f4b1fb9e59748ac9ac6cee))

### Features

- **endpoint-auth:** add draft scope to consent form ([4297ab7](https://github.com/getindiekit/indiekit/commit/4297ab790e46d316717fbc16bc5f8abb281ddedf))
- **endpoint-auth:** expose username to password managers ([21ff717](https://github.com/getindiekit/indiekit/commit/21ff7176446b2619324357e0528b78881ae54770))
- **endpoint-auth:** remove scope hints ([4536090](https://github.com/getindiekit/indiekit/commit/4536090639f3d56f37a10b74145b3503d816bf33))
- **endpoint-auth:** use bcrypt for password hashing ([df0dd67](https://github.com/getindiekit/indiekit/commit/df0dd67cea0fc2d635ed0713677be1e2b630d2ff))
- **endpoint-micropub:** check scope for draft value ([3fe3e5c](https://github.com/getindiekit/indiekit/commit/3fe3e5c07893504a2bf82d99cb5547ca96bf9bf6))
- **endpoint-micropub:** update post status if draft scope ([0be8dcb](https://github.com/getindiekit/indiekit/commit/0be8dcb9d05bd7cfab243a6c8033090f1d8bc2d3))
- **frontend:** card grid component ([df4b0e4](https://github.com/getindiekit/indiekit/commit/df4b0e4a8c1c13ea50c650d5380c695bd1040f36))
- **frontend:** custom icon properties ([7f5ee2a](https://github.com/getindiekit/indiekit/commit/7f5ee2aa84f525c2c889b585a5f25614186b437a))
- **frontend:** heading component ([11aee2d](https://github.com/getindiekit/indiekit/commit/11aee2df2f1fd9410f83cf9df5aa9999bf797479))
- **frontend:** logo component ([19a9ee8](https://github.com/getindiekit/indiekit/commit/19a9ee8b2241ff1d7ae3feb998f65a3a070eab27))
- **frontend:** navigation component ([112c85b](https://github.com/getindiekit/indiekit/commit/112c85b09be262db29a83fed2e6700f4cdc662ac))
- **frontend:** prose component ([b99e8f4](https://github.com/getindiekit/indiekit/commit/b99e8f42611c21e8d397bfc823553ea0ad4bdafa))
- **frontend:** section component ([68835ff](https://github.com/getindiekit/indiekit/commit/68835ffa3398134635179ad231c07200fb2c61a2))
- **frontend:** slugify filter ([230bdb8](https://github.com/getindiekit/indiekit/commit/230bdb812b5deb945d90af9dbccf34cb77f393de))
- **frontend:** themed touch icon ([80924c5](https://github.com/getindiekit/indiekit/commit/80924c5b3f0914f8dd97f1cc5ab8c327e1f89814))
- **frontend:** wrap client url on authorize component ([d70156a](https://github.com/getindiekit/indiekit/commit/d70156ac2c2b42b21fb8c641c04efe572768dc7d))
- **indekit:** feeds ([be582d2](https://github.com/getindiekit/indiekit/commit/be582d219c803216a23a42980be7e2a2c2b4b8a5))
- **indiekit:** don’t include draft posts in feeds ([2f5f515](https://github.com/getindiekit/indiekit/commit/2f5f515cfe3e6528541a07d4ef0378e522867a92))
- **indiekit:** installed plugins. fixes [#510](https://github.com/getindiekit/indiekit/issues/510) ([296480e](https://github.com/getindiekit/indiekit/commit/296480e9e8f7d269bad1403162e345b212ecf57f))
- **indiekit:** simpler scope labels ([bc5ff7d](https://github.com/getindiekit/indiekit/commit/bc5ff7d768a3da51c2a1fbdba46dae617b614e78))
- **indiekit:** themed touch icon ([21513e4](https://github.com/getindiekit/indiekit/commit/21513e4d37c41c439823b0ad0da94ded330a5dd2))
- **indiekit:** update default theme colour ([bd7249c](https://github.com/getindiekit/indiekit/commit/bd7249c344a651ce6f6d3a087f28cc1322537b28))
- update locale catalogs ([ca0e8a9](https://github.com/getindiekit/indiekit/commit/ca0e8a902439945a71210096f0f5db9bbe97397b))

# [1.0.0-alpha.15](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.14...v1.0.0-alpha.15) (2022-11-23)

### Features

- **endpoint-auth:** include me paramter in authorization response ([f571735](https://github.com/getindiekit/indiekit/commit/f571735eadba8c9182988cb1b0688553fb9165df))
- **endpoint-auth:** use password input, to help with password managers ([6eacede](https://github.com/getindiekit/indiekit/commit/6eacede4f46a91f140742be7f2df2b507147c1f6))

# [1.0.0-alpha.14](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.13...v1.0.0-alpha.14) (2022-11-23)

### Bug Fixes

- add missing endpoint-auth dependency ([462c0c7](https://github.com/getindiekit/indiekit/commit/462c0c7c240a7009b42b313ab472972d171299e4))

# [1.0.0-alpha.13](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2022-11-23)

### Bug Fixes

- **endpoint-files:** use base64url encoding for item.id ([ef26dc5](https://github.com/getindiekit/indiekit/commit/ef26dc5ec3722a769c4584e7d498483c398013bf))
- **endpoint-posts:** use base64url encoding for item.id ([b9f71fe](https://github.com/getindiekit/indiekit/commit/b9f71fef086ec477e4ec40e6e2c90bf66b7cc3c6))
- **endpoint-token:** add missing parameters from access token request ([42f6f24](https://github.com/getindiekit/indiekit/commit/42f6f2420426bb956e69b930bf17d049cdcdf417))
- **frontend:** consistent monospace font size ([3973b43](https://github.com/getindiekit/indiekit/commit/3973b43238d0e290f3b3f497afc7a916d5a2799d))
- **frontend:** prevent readonly textareas showing resize ([ad81038](https://github.com/getindiekit/indiekit/commit/ad81038a3e5acacb3daee55f9f82595d5c73d046))
- **indiekit:** don’t throw if no database configured when getting post count ([71705df](https://github.com/getindiekit/indiekit/commit/71705df4fa98de9fb8e8b269a70c5d0edd868e17))
- **indiekit:** locale require path resolution. fixes [#497](https://github.com/getindiekit/indiekit/issues/497) ([7f708e8](https://github.com/getindiekit/indiekit/commit/7f708e88b154f384bbf76c227262aae378d142ca))
- **indiekit:** return custom post types if no preset provided. fixes [#465](https://github.com/getindiekit/indiekit/issues/465) ([5364aef](https://github.com/getindiekit/indiekit/commit/5364aef5aa730b574f14c5f1bdd32e0f927ce4d5))
- **indiekit:** use base64url encoding for code challenge ([c5db4a9](https://github.com/getindiekit/indiekit/commit/c5db4a9445351c439644558aaaa2ce792686d9f8))

### Features

- **create-indiekit:** create .gitignore file ([03da565](https://github.com/getindiekit/indiekit/commit/03da565a61b440748f5804eb4b19f5b0cadaf7cd))
- **create-indiekit:** don’t create .nvmrc file ([abade3c](https://github.com/getindiekit/indiekit/commit/abade3cdbfb8bf8b7468c66b69dc1a7105f462f5))
- **endpoint-authorization:** indieauth endpoint. fixes [#499](https://github.com/getindiekit/indiekit/issues/499) ([b58bcce](https://github.com/getindiekit/indiekit/commit/b58bcce678b12a9cf77d4272fac981125ccdc314))
- **endpoint-auth:** plugin icon ([b994ffa](https://github.com/getindiekit/indiekit/commit/b994ffa540f8cf96c120e28465adbc3d51a7b9b4))
- **endpoint-auth:** use scope strings from core ([46eddb5](https://github.com/getindiekit/indiekit/commit/46eddb52accc8bc992058b628a0fcae8c74bb5e6))
- **endpoint-files:** account for unauthorized user ([a13daea](https://github.com/getindiekit/indiekit/commit/a13daea04f74294f439d0d69b08ea93ff5939411))
- **endpoint-files:** use scope strings from core ([d9408d2](https://github.com/getindiekit/indiekit/commit/d9408d290661ba2b78d6815ad8db073ef724d829))
- **endpoint-media:** plugin icon ([976ad44](https://github.com/getindiekit/indiekit/commit/976ad44ace497a62eb501fc61633ef1141bbb0df))
- **endpoint-micropub:** enriched post properties. fixes [#147](https://github.com/getindiekit/indiekit/issues/147) ([1c74310](https://github.com/getindiekit/indiekit/commit/1c74310b862d373428f05320dcacf1eddf804a96))
- **endpoint-micropub:** plugin icon ([741df34](https://github.com/getindiekit/indiekit/commit/741df3416d2d0eb2490d76dda997ad0cd6081098))
- **endpoint-share:** account for unauthorized user ([b78f0ea](https://github.com/getindiekit/indiekit/commit/b78f0eafd4f4f1247818f8d59a83e1fbd39a4cf2))
- **endpoint-share:** use scope strings from core ([899cba6](https://github.com/getindiekit/indiekit/commit/899cba6daea630e796c1e7f0c35712b315090b69))
- **frontend:** add checkboxes component ([ee22ee0](https://github.com/getindiekit/indiekit/commit/ee22ee04c74c95aba274553af7504ec1569416fb))
- **frontend:** add checkboxes component ([f9c3add](https://github.com/getindiekit/indiekit/commit/f9c3add1bbf2b27bf5eed9cb6332b079b4814cb4))
- **frontend:** add friendly url filter ([a1f9a3b](https://github.com/getindiekit/indiekit/commit/a1f9a3b1d49f13d4d52d3d3a1a1efde64e93768a))
- **frontend:** add radios component ([a700614](https://github.com/getindiekit/indiekit/commit/a7006148734276ea0e227c5a2cef10fed9a2b3ba))
- **frontend:** adjust height of textarea based on content ([c618d72](https://github.com/getindiekit/indiekit/commit/c618d72ab545d6660bc1491c26091a1ef5e55c61))
- **frontend:** consolidate login and minimal app layouts ([045ff3b](https://github.com/getindiekit/indiekit/commit/045ff3b852aa5c3db542080d41655fc4b514c1f8))
- **frontend:** make hint component available to all layouts ([ab320a0](https://github.com/getindiekit/indiekit/commit/ab320a040a9e5f7183b7b271e6d1764a1fe53bb0))
- **frontend:** remove base styles for del and ins elements ([b2fa41f](https://github.com/getindiekit/indiekit/commit/b2fa41f1ea3cc2d1eae57a208b322bcc67076efb))
- **frontend:** smarter classes global ([b1efbae](https://github.com/getindiekit/indiekit/commit/b1efbae0896348a542f1de8ea8d6932619a41414))
- **frontend:** smarter summaryRows global ([a9f6da5](https://github.com/getindiekit/indiekit/commit/a9f6da588f7899c839c6ba30e0fdde6e6bc98010))
- **frontend:** support datetime-local input type ([3fe8e16](https://github.com/getindiekit/indiekit/commit/3fe8e163e475396fe5dc6621e49bc9d036a01572))
- **frontend:** use minimal layout for error pages ([5d9a02a](https://github.com/getindiekit/indiekit/commit/5d9a02a6efc6ca565fdd23e92506930ce13b498d))
- **frontend:** warning text component ([ecbf139](https://github.com/getindiekit/indiekit/commit/ecbf1396646adb389296432b0299556874e84b6e))
- **frontend:** wrap urls in hint text component ([0b72d68](https://github.com/getindiekit/indiekit/commit/0b72d68654251af155718ef9b35d41a6454e2529))
- **indiekit:** account for unauthorized user ([1cef882](https://github.com/getindiekit/indiekit/commit/1cef882fc54951f82a70f6fd857fb4170af09b1c))
- **indiekit:** better display of permitted scope ([38cb902](https://github.com/getindiekit/indiekit/commit/38cb902a50e49746747a2a406f9d2f61f01a8be4))
- **indiekit:** change order of application settings on status page ([b8de00c](https://github.com/getindiekit/indiekit/commit/b8de00c2122c12fe6c8a03c6209c9d16b8459023))
- **indiekit:** plugins can provide well-known resources ([b9a0144](https://github.com/getindiekit/indiekit/commit/b9a0144cc814761c6e7b99d5a04e1bfbb99e9875))
- **indiekit:** remove list of endpoints from status page ([5c53a18](https://github.com/getindiekit/indiekit/commit/5c53a188fb73d87f30a11216ec698948bc02d9a5))
- **indiekit:** show post type name on status page ([7e0cf31](https://github.com/getindiekit/indiekit/commit/7e0cf31e4119ebab7316f560fa46a34c017401a7))
- **preset-hugo:** plugin icon ([3d369ef](https://github.com/getindiekit/indiekit/commit/3d369ef0485aea08efee0d3673acf6814287c959))
- **preset-jekyll:** plugin icon ([b457561](https://github.com/getindiekit/indiekit/commit/b4575616d1e5ecebd584a7e814957db4b9894200))
- **token-endpoint:** remove token endpoint. fixes [#500](https://github.com/getindiekit/indiekit/issues/500) ([a3d44d7](https://github.com/getindiekit/indiekit/commit/a3d44d78deca0d2dcc210d960544e257fec1db51))
- update locale catalogs ([65c0cee](https://github.com/getindiekit/indiekit/commit/65c0ceefb0a6438f9e4de79579390fc7d2a1e861))
- update locale catalogs ([7648cd0](https://github.com/getindiekit/indiekit/commit/7648cd0aebc3e94afe2f7ddc02771886a91a1ccd))
- use shared server secret ([839dd54](https://github.com/getindiekit/indiekit/commit/839dd54e9ed13abe4f458c82842dfdd5d749c3a5))

# [1.0.0-alpha.12](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2022-07-15)

### Bug Fixes

- **create-indiekit:** correct syndicator dependencies ([0a2f16f](https://github.com/getindiekit/indiekit/commit/0a2f16fbe39a84c35ba863d1b979f6f7cf7601c9))
- **endpoint-posts:** use fetch from undici ([d9da860](https://github.com/getindiekit/indiekit/commit/d9da8600e41d7a53502a210cc40af77c8033d6c1))
- **error:** handle unspecified errors ([3243592](https://github.com/getindiekit/indiekit/commit/3243592d7326851b6eec3aa514e315209bcfa12b))
- **indiekit:** fix incorrect session link being shown ([d081ed1](https://github.com/getindiekit/indiekit/commit/d081ed1b9c5726d8cf2ea008584a2966dd2505ec))
- more robust error handling when rendering views ([7909f89](https://github.com/getindiekit/indiekit/commit/7909f891279f555152672a2a636d82b9775bd9e2))

### Features

- **endpoint-token:** throw error if missing token secret ([ebf5946](https://github.com/getindiekit/indiekit/commit/ebf59462ab66c99938fb3e95de34fd3d2d1b3da2))
- **error:** add localised string for missing token ([957adea](https://github.com/getindiekit/indiekit/commit/957adeaf1de26dd9799ed483e68c368173a69fb0))
- **error:** remove toJSON() method ([f69a9da](https://github.com/getindiekit/indiekit/commit/f69a9da4fa5f43d4b16afc1dc760332099225edf))
- **frontend:** refactor language filters ([0d3363c](https://github.com/getindiekit/indiekit/commit/0d3363cea018d075dd08c46a791cd182821087c6))
- **indekit:** use English name for unsupported language ([7eca162](https://github.com/getindiekit/indiekit/commit/7eca16287daeff9ccb80270df97d34d4cde7f54d))

# [1.0.0-alpha.11](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2022-07-12)

### Bug Fixes

- **frontend:** include scripts folder in package ([06f6d0c](https://github.com/getindiekit/indiekit/commit/06f6d0c12f822caa58022231987446c831780655))

# [1.0.0-alpha.10](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2022-07-12)

### Bug Fixes

- **error:** include errors.js in package ([d863aa6](https://github.com/getindiekit/indiekit/commit/d863aa65d24f80ff33e1daa5f4d9dfa2d0948245))

# [1.0.0-alpha.9](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2022-07-12)

### Bug Fixes

- **error:** correctly merge options on static methods ([d200ea5](https://github.com/getindiekit/indiekit/commit/d200ea552422e70f3bfd76b8e7eb3d06fc416bc9))
- watch files with .cjs extension (i.e. config file) ([ba30e5b](https://github.com/getindiekit/indiekit/commit/ba30e5b914515c6de57e72d905660c886b1b7488))

### Features

- add Polish localisation from Arookei The Wolf ([5432ddd](https://github.com/getindiekit/indiekit/commit/5432ddd6a2095e7f4fc09ec8517cee8bffdf17a2))
- add Serbian localisation from Anđela Radojlović ([ab54ef7](https://github.com/getindiekit/indiekit/commit/ab54ef74a07f3c7c35aed4959b3addb3f3330fbf))
- **endpoint-files:** use custom error handler ([cd618f1](https://github.com/getindiekit/indiekit/commit/cd618f14b17a8e619dd1f596a5800be7299409c2))
- **endpoint-media:** localise insufficient scope error ([a42f780](https://github.com/getindiekit/indiekit/commit/a42f7803ac4cea96589ea68ab95348b42ee9c77a))
- **endpoint-media:** localise upload errors ([d6121ab](https://github.com/getindiekit/indiekit/commit/d6121ab04afadf6820600192494147143b48cdb9))
- **endpoint-media:** remove unused read method on mediaData ([3c37ce3](https://github.com/getindiekit/indiekit/commit/3c37ce3212701b70998cdede4e8b90a770e46087))
- **endpoint-media:** use custom error handler ([f4f7193](https://github.com/getindiekit/indiekit/commit/f4f7193abe87510a10d18eebc5537506dad23455))
- **endpoint-micropub:** localise action errors ([e558baa](https://github.com/getindiekit/indiekit/commit/e558baae9bc50a952ece785492ec03a2936e50b2))
- **endpoint-micropub:** localise insufficient scope error ([86fdf84](https://github.com/getindiekit/indiekit/commit/86fdf84f422d139f5c402434fba932ef23c88fcc))
- **endpoint-micropub:** use custom error handler ([424d5c8](https://github.com/getindiekit/indiekit/commit/424d5c8824720cdf4285674fce862150dd80b24c))
- **endpoint-posts:** use custom error handler ([217b0b5](https://github.com/getindiekit/indiekit/commit/217b0b55856a5ce32ad3f99e2cd463059a903030))
- **endpoint-share:** use custom error handler ([68b1bce](https://github.com/getindiekit/indiekit/commit/68b1bceae960726864bdfec5b8d900c64674ed68))
- **endpoint-syndicate:** use custom error handler ([013c4d4](https://github.com/getindiekit/indiekit/commit/013c4d4d80b2b36dc8019fbc5489495e1df86676))
- **endpoint-token:** use custom error handler ([c9c7818](https://github.com/getindiekit/indiekit/commit/c9c7818d9c865d679d14f9335d55a823595c2f06))
- **error:** add custom error handlers ([8fa8868](https://github.com/getindiekit/indiekit/commit/8fa8868b3438867bfc7492cd93f14b43a8c444c8))
- **error:** include cause and plugin in error ([d92b608](https://github.com/getindiekit/indiekit/commit/d92b60878218c26c3d7120e141753d897bb0eaae))
- **frontend:** add error layout ([ac60358](https://github.com/getindiekit/indiekit/commit/ac60358c958a1e99eaa247ff6177c1e3d6255145))
- **frontend:** add error summary focus behaviours ([6b25104](https://github.com/getindiekit/indiekit/commit/6b25104d44f05329424732f4d220d3e7f439326b))
- **frontend:** add localised title to notifications ([101a416](https://github.com/getindiekit/indiekit/commit/101a41672399056f062d7fb4ef075d505df1fb09))
- **frontend:** component localisations ([f039b16](https://github.com/getindiekit/indiekit/commit/f039b16acde027be7542a356ada2f9ced4c66176))
- **frontend:** include publication me value in application head ([477ca4e](https://github.com/getindiekit/indiekit/commit/477ca4e949e8ee5c2dcb045dc58551d679a9b9be))
- **frontend:** link error message if uri given ([732156e](https://github.com/getindiekit/indiekit/commit/732156ed5b59cf3973ac2e1869908527b1731a07))
- **frontend:** support showing error uri ([d2c6db0](https://github.com/getindiekit/indiekit/commit/d2c6db06c85cb402baa649cc10506477bc511ef5))
- **frontend:** use stimulus to enhance components ([b9d05da](https://github.com/getindiekit/indiekit/commit/b9d05da4ef28856546e71062e85161b620958604))
- **indiekit:** check for publication URL before starting server ([de60363](https://github.com/getindiekit/indiekit/commit/de6036316772e91fa486ad37b7ebe9d525f2c1ff))
- **indiekit:** import frontend localisations ([c5bc3df](https://github.com/getindiekit/indiekit/commit/c5bc3dfeb1934473484ab4c8197375c15edb4215))
- **indiekit:** localise auth token response ([1e5834a](https://github.com/getindiekit/indiekit/commit/1e5834ab783cc86eb740f65179e03bd0caf995f2))
- **indiekit:** localise invalid token error ([d211300](https://github.com/getindiekit/indiekit/commit/d2113007196f4214e0a9cede73b9bb1017579387))
- **indiekit:** remove check for publication URL in token verification ([98881b9](https://github.com/getindiekit/indiekit/commit/98881b92d7433855611b2ab90a74d4b14e1b87a5))
- **indiekit:** showing error uri in HTML response ([a3a73ff](https://github.com/getindiekit/indiekit/commit/a3a73ffdccb2f3cf6c95104eea468f7e3c1a2215))
- **indiekit:** use custom error handler ([49ab698](https://github.com/getindiekit/indiekit/commit/49ab6983d1c16c2efd1835e85f45c685fc0e8690))
- link notification text if error_uri given ([4506821](https://github.com/getindiekit/indiekit/commit/4506821ab3174a629e4470601ef5090b583feb14))
- **store-github:** use custom error handler ([e1c1928](https://github.com/getindiekit/indiekit/commit/e1c19280f80e30cf4706c2a4aafe43210255a001))
- **syndicator-mastodon:** update mastodon logo ([f328151](https://github.com/getindiekit/indiekit/commit/f32815165ff76f69e42cf1af390f3e80ccdc87ab))
- **syndicator-mastodon:** use custom error handler ([57da7b7](https://github.com/getindiekit/indiekit/commit/57da7b74dee1508485e75b24e6e5f26708549618))

# [1.0.0-alpha.8](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2022-06-17)

### Bug Fixes

- **endpoint-token:** gets params from query not body ([26a2aad](https://github.com/getindiekit/indiekit/commit/26a2aadc7580796836023bfd85a8becc73634746))

### Features

- **frontend:** include publication endpoints in application head ([9bc06c5](https://github.com/getindiekit/indiekit/commit/9bc06c53409ded273dd96574bcd247fcf7a30b9f))

# [1.0.0-alpha.7](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2022-06-17)

### Bug Fixes

- **endpint-media:** error in error response ([08e25f0](https://github.com/getindiekit/indiekit/commit/08e25f01117c7b6c75b89aaf52fed8e959779e71))
- **endpoint-posts:** post count in pagination ([11964db](https://github.com/getindiekit/indiekit/commit/11964db8678b9830e110e7efbd1178025e1d4938))
- **endpoint-token:** gets params from query not body ([4f5808f](https://github.com/getindiekit/indiekit/commit/4f5808fd47ef73c7114b252e524d0eb267c3970e))
- **indiekit:** send query not body to token endpoint ([787af79](https://github.com/getindiekit/indiekit/commit/787af7953fcb0e7243d4c3423fd1dfdf1699bdd0))

### Features

- **endpoint-micropub:** strip any html from context text property ([0a4cbf0](https://github.com/getindiekit/indiekit/commit/0a4cbf04ae50ce5389eaff891d7e14083f79d26e))
- **endpoint-micropub:** trim whitespace from name and photo alt properties ([c878c79](https://github.com/getindiekit/indiekit/commit/c878c795f574fa40abec6fe3b44be0039c668276))
- **endpoint-token:** change token expiry to 90 days ([0f19d42](https://github.com/getindiekit/indiekit/commit/0f19d421321892e9c57f5f38fa912e81b2383cad))
- **endpoint-token:** correct format for token expiry ([87ae154](https://github.com/getindiekit/indiekit/commit/87ae154efbc7752d91435cd145006e3fcc8e3884))
- **endpoint-token:** include issuer in token ([286e314](https://github.com/getindiekit/indiekit/commit/286e3147215699beb89c93f9cc47774a70447b14))
- **endpoint-token:** remove duplicate issue date in token ([416b7c6](https://github.com/getindiekit/indiekit/commit/416b7c62462e3fd307bca7c4b7d214f1c30f9e17))

# [1.0.0-alpha.6](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2022-06-14)

### Bug Fixes

- **create-indiekit:** include lib folder in published package ([620aef5](https://github.com/getindiekit/indiekit/commit/620aef5c330ed705163892e4fe6c5e1b3d6c35df))
- **frontend:** prevent focus ring from being hidden ([ba349ac](https://github.com/getindiekit/indiekit/commit/ba349ac1476caa8d58f0e52abb112c20544ba049))

### Features

- **endpoint-files:** split file management into new plug-in ([0050864](https://github.com/getindiekit/indiekit/commit/0050864cd43128dc752833c50855edb289b0aa30))
- **endpoint-media:** query configured media endpoint api ([ad8069d](https://github.com/getindiekit/indiekit/commit/ad8069d93a69a69985369ded8f4447217d438ca7))
- **endpoint-media:** remove frontend interface ([34b1ef3](https://github.com/getindiekit/indiekit/commit/34b1ef391d9697416665f33d8549159c161ff136))
- **endpoint-micropub:** remove frontend interface ([36a63a7](https://github.com/getindiekit/indiekit/commit/36a63a79513eb40b3322032fc3ce227d849e48fb))
- **endpoint-micropub:** remove remote URL source querying ([b63ef8d](https://github.com/getindiekit/indiekit/commit/b63ef8d0ffa4d51a7cf61a5434afd529d80ce0c6))
- **endpoint-posts:** split post management into new plug-in ([cb1bf6c](https://github.com/getindiekit/indiekit/commit/cb1bf6c076371218df2fc4876bd48968df68e980))
- **frontend:** add secondary button style ([b6ee4fd](https://github.com/getindiekit/indiekit/commit/b6ee4fd70c5b4ed0951df1da3d212f14ec7adb74))
- **indiekit:** bundle endpoint-files plug-in ([e256c90](https://github.com/getindiekit/indiekit/commit/e256c90db3eac34440950c62a4a101a911859feb))
- **indiekit:** bundle endpoint-posts plug-in ([bf5a602](https://github.com/getindiekit/indiekit/commit/bf5a602eb9d7b582e14bb1c6574abf6a1d9fd854))

### Reverts

- Revert "refactor(indiekit): use json module import" ([44a27f8](https://github.com/getindiekit/indiekit/commit/44a27f8e02d301e85845fdf5c6f6416d272db045))
- Revert "refactor(create-indiekit): use json module import" ([7f15c16](https://github.com/getindiekit/indiekit/commit/7f15c16cf98b22012ed7c97d6a1adc85c7bc5137))

# [1.0.0-alpha.5](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2022-06-08)

### Bug Fixes

- add assets folders to package files ([047ef5e](https://github.com/getindiekit/indiekit/commit/047ef5e8fa23f14858bd0b9ecf442d45501dfc25))
- correct file paths when views have a query string ([1457773](https://github.com/getindiekit/indiekit/commit/14577736648d7800a0592b31f0c66034502f968a))
- **frontend:** don’t invert shadow colour in dark mode ([9a9fd25](https://github.com/getindiekit/indiekit/commit/9a9fd25f259442687ce98395fdfb0b6ee1e4ecc5))

### Features

- dev mode ([b3c186b](https://github.com/getindiekit/indiekit/commit/b3c186b6456a581cb8187530100d730f56d7193c))
- **endpoint-token:** add translation files ([7f02e6a](https://github.com/getindiekit/indiekit/commit/7f02e6aa703864302c3591acd68a1a1c26ada1c6))
- **endpoint-token:** upload locales for translation ([ddd6b14](https://github.com/getindiekit/indiekit/commit/ddd6b14036fd752fa3ead4a663a60efae07e57c5))
- **frontend:** add styles for file input ([df0fe69](https://github.com/getindiekit/indiekit/commit/df0fe697ea0a40a75fe418ae029628d9e91df020))
- **indiekit:** remove robots.txt ([650dd05](https://github.com/getindiekit/indiekit/commit/650dd056fa4602f0c43b665a861f353232631ccf))
- localise pagination component ([533022f](https://github.com/getindiekit/indiekit/commit/533022f8b21a8138366549faba4d8036c0f02283))
- require node.js v18 ([a7408db](https://github.com/getindiekit/indiekit/commit/a7408db7c3430cf51b76e793c5718245a7cae03c))
- **store-file-system:** add file system store ([9185121](https://github.com/getindiekit/indiekit/commit/9185121fd5daed5667379940cd010e563c41a479))

# [1.0.0-alpha.4](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2022-05-26)

### Bug Fixes

- **endpoint-micropub:** normalisation of mp-syndicate-to with syndication property ([621d45e](https://github.com/getindiekit/indiekit/commit/621d45e15edfa5a0fe9fe133b20a270017318faa))

# [1.0.0-alpha.3](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2022-05-22)

### Bug Fixes

- **endpoint-image:** cache settings ([e69eb05](https://github.com/getindiekit/indiekit/commit/e69eb05502c6e1510518714c15deba62df64b808))

# [1.0.0-alpha.2](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2022-05-22)

### Bug Fixes

- **endpoint-image:** make endpoint route public ([adcdb1e](https://github.com/getindiekit/indiekit/commit/adcdb1e133369a35dcb910bb00e741d354702b10))

# [1.0.0-alpha.1](https://github.com/getindiekit/indiekit/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2022-05-20)

### Bug Fixes

- **endpoint-image:** include got dependency ([50d706e](https://github.com/getindiekit/indiekit/commit/50d706ee6040dd7feef1e4c0c331cb82a8f313aa))
- **indiekit:** include missing plug-in dependencies ([a905b7d](https://github.com/getindiekit/indiekit/commit/a905b7dae960bff6559475f859b8d1ee4f41cc54))

# [1.0.0-alpha.0](https://github.com/getindiekit/indiekit/compare/v0.3.0...v1.0.0-alpha.0) (2022-05-20)

### Bug Fixes

- **endpoint-media:** throw useful errors when creating data ([d2ab6f4](https://github.com/getindiekit/indiekit/commit/d2ab6f4143b1e53c727eb076e1a691ff7788b230))
- **endpoint-micropub:** normalise properties after updating post data ([0d43082](https://github.com/getindiekit/indiekit/commit/0d430825bb6e3df9777c8feb519b2267e17ecaa8))
- **endpoint-micropub:** throw error if post type not configured. fixes [#423](https://github.com/getindiekit/indiekit/issues/423) ([fb56937](https://github.com/getindiekit/indiekit/commit/fb5693752f943ff664224ed9d31271abbd3004f8))
- **endpoint-micropub:** typo ([700e720](https://github.com/getindiekit/indiekit/commit/700e720de8ce359a7f74059ea6507ec5ad9650e3))
- **endpoint-token:** return 403 if token URL doesn’t match publication URL ([807690e](https://github.com/getindiekit/indiekit/commit/807690e67e0c5347febb601c04da0a0961e22a9a))
- **endpoint-token:** use body paramaters not query values when granting a token ([edec575](https://github.com/getindiekit/indiekit/commit/edec575d5aee241f8899c84438c72eff3a87c8dd))
- **frontend:** ensure app logo can be parsed ([fd315a5](https://github.com/getindiekit/indiekit/commit/fd315a59b65bafbc59e345acfffa6149dc337ec3))
- **frontend:** ensure icon size scales with text ([8b7c785](https://github.com/getindiekit/indiekit/commit/8b7c7856a2aa29e27c5c531f1db4ba350b7e823e))
- **frontend:** main padding on login layout ([0c29310](https://github.com/getindiekit/indiekit/commit/0c2931023605d50984d19153a76adea8bae7d585))
- **frontend:** missing border-radius on login form ([61d3d8a](https://github.com/getindiekit/indiekit/commit/61d3d8a248a7a717d11bd8e5eeef49adaea9c681))
- **frontend:** summary value content spacing ([a86ffc2](https://github.com/getindiekit/indiekit/commit/a86ffc26dd69afd349f93a2ded2ab8d738f142aa))
- **indiekit:** correct post request to token endpoint ([5b02665](https://github.com/getindiekit/indiekit/commit/5b02665fe1ad38b1dfdc842b65fbbeddc722c354))
- **indiekit:** save session to app locals ([6e8171f](https://github.com/getindiekit/indiekit/commit/6e8171f2506e6f556bfee2993a3b8e2132d3332c))
- **indiekit:** simpler check for database ([3ebccac](https://github.com/getindiekit/indiekit/commit/3ebccac8a861d435c26f756471ff49b3ed95290c))
- **syndicator-mastodon:** missing init function ([0a436d6](https://github.com/getindiekit/indiekit/commit/0a436d625767eea12a7c9a26d9b224fa73918fd0))
- use correct request format for authentication requests ([46836f8](https://github.com/getindiekit/indiekit/commit/46836f85f1c6372fb4b1b4eba5a440a7f07ef920))

### Features

- add and update plug-in icons ([56f5cf4](https://github.com/getindiekit/indiekit/commit/56f5cf46d741b96a0b3a4a3a2d47af419637fead))
- add Indonesian localisation from Zeky Chandra ([e5508f1](https://github.com/getindiekit/indiekit/commit/e5508f14bde8951b691e56490117552268c9c232))
- add Spanish translation from [@aciccarello](https://github.com/aciccarello) ([e556ada](https://github.com/getindiekit/indiekit/commit/e556ada815873d04b2147556c42198dcc1b3ccaa))
- **create-indiekit:** project initializer ([7f224d6](https://github.com/getindiekit/indiekit/commit/7f224d6f88bca5a4bd7006e0cc97aed8cd49510b))
- don’t use default environment variable for MongoDB ([abc1e64](https://github.com/getindiekit/indiekit/commit/abc1e64d35c14db48ad520cbc7ed32bf8fc37b08))
- enable all plug-ins to include an assets path ([d1083ab](https://github.com/getindiekit/indiekit/commit/d1083ab55e60a607377d7e3f3ca70c269637f770))
- **endpoint-image:** add image resizing endpoint ([21da1d3](https://github.com/getindiekit/indiekit/commit/21da1d3f9d99cdbd5a89a48ecde30eaae2d369d7))
- **endpoint-image:** use mongodb cache store ([da8de0d](https://github.com/getindiekit/indiekit/commit/da8de0ddcd7d581994cec90c0623667a9c7b9764))
- **endpoint-media:** show icon if media not found ([744ff7d](https://github.com/getindiekit/indiekit/commit/744ff7d1ed57614e60b4627341d19320ed33702d))
- **endpoint-media:** show media in files view ([dc40f79](https://github.com/getindiekit/indiekit/commit/dc40f79481d1990b158c9aa75bd88ba0968912e0))
- **endpoint-media:** show media in files view ([24981cc](https://github.com/getindiekit/indiekit/commit/24981cc465b9cb088925a017bc3833ad0398aace))
- **endpoint-micropub:** add post type count token for the day ([60f469b](https://github.com/getindiekit/indiekit/commit/60f469bc6acda4ae9bdaa55e5b97ee5e7b4124a2))
- **endpoint-micropub:** paginate posts ([a3b388e](https://github.com/getindiekit/indiekit/commit/a3b388e16c2646cf25784bf27fd7d72a54ec55b9))
- **endpoint-token:** token endpoint ([e8fbb4c](https://github.com/getindiekit/indiekit/commit/e8fbb4cf4a25dc5c1658e28188202568e5d35e12))
- **frontend:** file grid component ([aded86b](https://github.com/getindiekit/indiekit/commit/aded86b00743a8dd742fa625cc837b73fdea8e20))
- **frontend:** file list component ([0672ce6](https://github.com/getindiekit/indiekit/commit/0672ce62642becc5c3de8bc852322aa3675145a6))
- **frontend:** global to generate pagination data ([30b6d7c](https://github.com/getindiekit/indiekit/commit/30b6d7ca7a79d8252853a1a9ed9c08ca18ddbc21))
- **frontend:** pagination component ([683b559](https://github.com/getindiekit/indiekit/commit/683b55947fcdbc32b7bd9197ee4285d39e987c5d))
- **frontend:** revert to using es modules ([976e82c](https://github.com/getindiekit/indiekit/commit/976e82cdebf680cb994d814b951d223781e2ca40))
- **frontend:** support custom media constraints ([4dfd302](https://github.com/getindiekit/indiekit/commit/4dfd3026415ff2af9906bc9993453aa35e147409))
- **indiekit:** add debug option to serve command ([7659970](https://github.com/getindiekit/indiekit/commit/7659970b56cdefebe8095df803490be5ed48a743))
- **indiekit:** ensure client_id includes path component ([fcd416c](https://github.com/getindiekit/indiekit/commit/fcd416c53c82ad5f5fa0c9abb406137878553700))
- **indiekit:** force https ([cc9ece0](https://github.com/getindiekit/indiekit/commit/cc9ece0379b3ba8680fbc7e9cd0b3be3511eb535))
- **indiekit:** increase rate limit ([bd9b9a4](https://github.com/getindiekit/indiekit/commit/bd9b9a44e61be59fd499fc0f66983cef788f5682))
- **indiekit:** refactor config loading and format. fixes [#402](https://github.com/getindiekit/indiekit/issues/402) ([65ff927](https://github.com/getindiekit/indiekit/commit/65ff9273062cdeccda35a20aa2b24cf812e93111))
- register defined view directories for plug-ins ([77eeed2](https://github.com/getindiekit/indiekit/commit/77eeed2543feec92fde112f23c2f26b1b456a572))
- update Dutch localisation ([8d20a58](https://github.com/getindiekit/indiekit/commit/8d20a586b83300a79a01b0f6e80d069992171293))
- update French localisation ([f784e71](https://github.com/getindiekit/indiekit/commit/f784e717a525f7ef8b65ba1eca1c33488d393110))
- update German localisation ([1e8a9e9](https://github.com/getindiekit/indiekit/commit/1e8a9e9efe0cc9348f5abeac7eaf8de39ad5a36d))
- update Portuguese localisation ([d730157](https://github.com/getindiekit/indiekit/commit/d730157c4869130594cd38def5366d82dd6e9177))

# [0.3.0](https://github.com/getindiekit/indiekit/compare/v0.2.0...v0.3.0) (2022-02-06)

### Bug Fixes

- **endpoint-micropub:** typos ([bf71b09](https://github.com/getindiekit/indiekit/commit/bf71b0904b80c4a84e84af39d4c5c96e764800fe))
- **endpoint-micropub:** use absolute url for media items ([3903845](https://github.com/getindiekit/indiekit/commit/39038453e1d91db81e0f96cb0334d28b4cbc05ef))
- **frontend:** fix size of footer logo ([6b9b9ec](https://github.com/getindiekit/indiekit/commit/6b9b9ec4487e02b5539910b074febc018555d857))
- **frontend:** use text colour for summary values ([42b7caf](https://github.com/getindiekit/indiekit/commit/42b7cafe701274123cce7a8066433e92394614d2))
- improve appearance of post and syndication target icons ([0fe768e](https://github.com/getindiekit/indiekit/commit/0fe768ee0fd79421bb05ad3edae0c1931061abb0))
- **indiekit:** env vars as default values for options that accept secrets ([1af9707](https://github.com/getindiekit/indiekit/commit/1af97073109da9f07fe107125ca4af8686647422))
- **indiekit:** get application info from indiekit package.json ([439d845](https://github.com/getindiekit/indiekit/commit/439d845b466d4b6daff1aa9b38b03adcdb63525c))
- **indiekit:** handle timeout connecting to mongodb ([79e6206](https://github.com/getindiekit/indiekit/commit/79e6206b2574062ab249e004b066c2031f05f5b8))
- **indiekit:** remove prototype-polluting assignment ([45042f4](https://github.com/getindiekit/indiekit/commit/45042f4a94f7a77598a031690a00a138fb684570))
- make it easier to see and copy access token ([7f381b5](https://github.com/getindiekit/indiekit/commit/7f381b571e774b14f6a95a4b7fe8c27feab57a81))
- **store-bitbucket:** env vars as default values for options that accept secrets ([78e4bbb](https://github.com/getindiekit/indiekit/commit/78e4bbbb3a3812aa9196b6d4c1bcd4bc011807b0))
- **store-ftp:** env vars as default values for options that accept secrets ([06fd746](https://github.com/getindiekit/indiekit/commit/06fd746dab0ac72859b12d3b6c46a42e51418238))
- **store-gitea:** env vars as default values for options that accept secrets ([32124bd](https://github.com/getindiekit/indiekit/commit/32124bd68b4a5402f8e66d5a464074d906c8b723))
- **store-github:** env vars as default values for options that accept secrets ([da9d998](https://github.com/getindiekit/indiekit/commit/da9d99817dcc480992d804a803a66dfe579d629e))
- **store-gitlab:** env vars as default values for options that accept secrets ([fe3512d](https://github.com/getindiekit/indiekit/commit/fe3512d0b2e530a5db96fbd40c13ff1795451d4a))
- **syndicator-internet-archive:** env vars as default values for options that accept secrets ([894a886](https://github.com/getindiekit/indiekit/commit/894a8865860c563e15be149298c867c6c70e7574))
- **syndicator-twitter:** env vars as default values for options that accept secrets ([ce436e7](https://github.com/getindiekit/indiekit/commit/ce436e77bcf4185ea528c97e9e41b0a788d8709f))
- **syndicator-twitter:** only post replies to tweets ([a40e58d](https://github.com/getindiekit/indiekit/commit/a40e58dff4c9c8d39dbe4f23ee031b517744a8f5))
- use package.json vars ([4005873](https://github.com/getindiekit/indiekit/commit/40058738a9b6a1a05b0354fe78f63e5184c362ba))

### Features

- add default exports for plug-ins ([8518285](https://github.com/getindiekit/indiekit/commit/85182856c93bb733bd98f2f221c529ca299869b8))
- add plug-in info ([f289df4](https://github.com/getindiekit/indiekit/commit/f289df4dec1851b1ea45233b9f24c9a0c58091ee))
- **frontend:** add absoluteUrl filter ([dcc0616](https://github.com/getindiekit/indiekit/commit/dcc061631953d96f689a9f3a283e09c5885694f7))
- **indiekit:** rate limit some requests ([6a7d520](https://github.com/getindiekit/indiekit/commit/6a7d5203b22095855723f464dad8444be3bbc530))
- **indiekit:** split express app config from server ([b1f7364](https://github.com/getindiekit/indiekit/commit/b1f7364dd3a70d4906bc137ca5f41ecfa67a6128))
- **indiekit:** split express app config from server ([f388d6d](https://github.com/getindiekit/indiekit/commit/f388d6d23768e0ab065ec5633f86ee7272e25362))
- **indiekit:** use localazy localisation service ([004caa0](https://github.com/getindiekit/indiekit/commit/004caa044ea9c71835108c4347ec918ceefbb399))
- plug-ins no longer need to add locales ([e489594](https://github.com/getindiekit/indiekit/commit/e489594dd377ce793cbeac34fa12d20fd8f6301a))
- **syndicator-mastodon:** add mastodon syndicator ([b8148ca](https://github.com/getindiekit/indiekit/commit/b8148cabde3fb6a3e5720f3de04b538bd5e2f996))

# [0.2.0](https://github.com/getindiekit/indiekit/compare/v0.1.4...v0.2.0) (2021-12-19)

### Bug Fixes

- **frontend:** tweak styles for documentation site ([59f65bc](https://github.com/getindiekit/indiekit/commit/59f65bc499fd48a8d23add34c32cd7880d36cd9b))
- **micropub:** return list of categories ([305588d](https://github.com/getindiekit/indiekit/commit/305588d47e46a54714832d002502d7fa501271a5))

### Features

- default to ‘main’ for git store branch name ([9d6d8ef](https://github.com/getindiekit/indiekit/commit/9d6d8efd9366e19685da6e8526e36f6af3fe6678))
- **store-ftp:** add ftp content store. fixes [#278](https://github.com/getindiekit/indiekit/issues/278) ([fa7267f](https://github.com/getindiekit/indiekit/commit/fa7267f5a988581b373d8ecf2ca2551f7f4187cd))

## [0.1.4](https://github.com/getindiekit/indiekit/compare/v0.1.3...v0.1.4) (2021-08-01)

### Bug Fixes

- throw error if feature requires database. fixes [#358](https://github.com/getindiekit/indiekit/issues/358) ([9316eaa](https://github.com/getindiekit/indiekit/commit/9316eaa1c87903fc1df0c4bbb1b800ad2b043773))

## [0.1.3](https://github.com/getindiekit/indiekit/compare/v0.1.2...v0.1.3) (2021-06-14)

### Bug Fixes

- **indiekit:** override application url in config. fixes [#352](https://github.com/getindiekit/indiekit/issues/352) ([56affa5](https://github.com/getindiekit/indiekit/commit/56affa53849b94aafb51ecb065fff2da01a164a7))

## [0.1.2](https://github.com/getindiekit/indiekit/compare/v0.1.1...v0.1.2) (2021-05-30)

### Bug Fixes

- **indiekit:** incorrect this assignment in postTemplate function. fixes [#344](https://github.com/getindiekit/indiekit/issues/344) ([52812b8](https://github.com/getindiekit/indiekit/commit/52812b82d7bf8e522de900393e7275999d348965))
- **preset-hugo:** add missing like-of property ([75da03d](https://github.com/getindiekit/indiekit/commit/75da03d5047802af21394425da6387dd1fa3611b))
- **preset-hugo:** use camelcased frontmatter keys. fixes [#345](https://github.com/getindiekit/indiekit/issues/345) ([a4a6e93](https://github.com/getindiekit/indiekit/commit/a4a6e93a62420aefeea0c19a521dbe4ead297453))
- **preset-jekyll:** add missing like-of property ([6b0f60a](https://github.com/getindiekit/indiekit/commit/6b0f60ada43db4fa6b8b55e98605174d535f915e))

## [0.1.1](https://github.com/getindiekit/indiekit/compare/v0.1.0...v0.1.1) (2021-05-16)

### Bug Fixes

- media uploads failing. fixes [#343](https://github.com/getindiekit/indiekit/issues/343) ([3ad644d](https://github.com/getindiekit/indiekit/commit/3ad644d790345abe14335715666f2cb44403318b))

# [0.1.0](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.23...v0.1.0) (2021-03-15)

### Features

- **frontend:** support heading anchors and definition lists in Markdown ([dab1a2e](https://github.com/getindiekit/indiekit/commit/dab1a2edee4fbf7e9dc6b8c7543965a9a63a43d2))

# [0.1.0-alpha.23](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.22...v0.1.0-alpha.23) (2021-02-19)

### Bug Fixes

- disable watch for nunjucks templates to stop chokidar dependency errors ([b29e9e2](https://github.com/getindiekit/indiekit/commit/b29e9e2e6ed949ab4659bf631ff6b5577232504a))

# [0.1.0-alpha.22](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2021-02-19)

### Bug Fixes

- always syndicate to Twitter using HTML content property ([dea22bb](https://github.com/getindiekit/indiekit/commit/dea22bbb73393084bf39d7ffd04d3e61f851f4f5))
- **endpoint-micropub:** relative media path for publication url with path component ([9dd58ef](https://github.com/getindiekit/indiekit/commit/9dd58ef524635a90d714f86eb2e5c3fc94192f8a))

### Features

- **endpoint-media:** show message when no files to show ([6110ff1](https://github.com/getindiekit/indiekit/commit/6110ff1fe93bd9f7274764bac88fcc36cee58ce0))
- **endpoint-micropub:** parse geo uri for location property ([b28d789](https://github.com/getindiekit/indiekit/commit/b28d789d14f9d298a2fba6d736572f54577f8df0))
- **endpoint-micropub:** show message when no posts to show ([a3d9bce](https://github.com/getindiekit/indiekit/commit/a3d9bcec2e8f3dbf23c7b9b588166027cd45859c))
- **indiekit:** localise 404 page ([09ac3ac](https://github.com/getindiekit/indiekit/commit/09ac3ac03a2364c13bf26405a8926e2e5dafd68e))
- **preset-jekyll:** disable line folding on yaml strings ([ba3b21b](https://github.com/getindiekit/indiekit/commit/ba3b21b7824017c19e49e546173e6d3bd7793e3b))
- **syndicator-twitter:** always use absolute urls for uploading media ([5190195](https://github.com/getindiekit/indiekit/commit/51901959a36d37a91b362c818b63b6854e905b7d))
- pass publication config to syndicator ([32e1f35](https://github.com/getindiekit/indiekit/commit/32e1f356c7374c880c576f327a2d2754c2141b9f))
- **preset-hugo:** disable line folding on yaml strings ([c72a598](https://github.com/getindiekit/indiekit/commit/c72a5985db668fca7b47fe9f7b40b69a8f5ad7f0))

# [0.1.0-alpha.21](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2021-02-01)

### Bug Fixes

- **endpoint-micropub:** adding item to value which is not yet an array ([1067e8d](https://github.com/getindiekit/indiekit/commit/1067e8dfa6d8b9e64c3aa1bd77099e8dafbb3242))
- **endpoint-micropub:** creating posts with single media property ([901ad93](https://github.com/getindiekit/indiekit/commit/901ad93fcfc9615c76c014005f2094c108251268))
- **indiekit:** add default for publication.jf2Feed ([2d667a1](https://github.com/getindiekit/indiekit/commit/2d667a15e07402edb2d8eb4adefca95245044f44))
- **indiekit:** always return responses in auth flow ([069eac4](https://github.com/getindiekit/indiekit/commit/069eac4e6daa229dd4de2baf9b3227d68401e741))
- **indiekit:** remove extraenous form input ([4620f5d](https://github.com/getindiekit/indiekit/commit/4620f5db7f9520d615165412b93a0fece22238b7))
- **preset-hugo:** update content fallback values ([1794e34](https://github.com/getindiekit/indiekit/commit/1794e34a9d70cc9cb7377281a136419cbe7d2cc8))
- **preset-jekyll:** update content fallback values ([29111ae](https://github.com/getindiekit/indiekit/commit/29111ae9c9340df5840189ef45611e8c80c059c2))

### Features

- **frontend:** show ’Error:’ prefix for validated page title ([f9622b6](https://github.com/getindiekit/indiekit/commit/f9622b69ad5f57bef2742d0c51d5b23667b3b815))
- **frontend:** updated markup for error message ([22a7f5d](https://github.com/getindiekit/indiekit/commit/22a7f5d76d26ac3cdc2f97b82bd824d575011625))
- **indiekit:** remove media endpoint resolution ([3025aa7](https://github.com/getindiekit/indiekit/commit/3025aa747f04837a9ecff1326230b3e044f12242))
- abstract `summaryRow` filter for post and file views ([f32e28c](https://github.com/getindiekit/indiekit/commit/f32e28ce2640c6c3319276bbfbb077220a0e4b9e))
- make syndicator plug-ins dryer ([bc68462](https://github.com/getindiekit/indiekit/commit/bc684620597f78fe5b0fbe0b0d9e6ee73e7041f2))
- remove syncing website post data using a JF2 Feed ([6f39349](https://github.com/getindiekit/indiekit/commit/6f39349a98aaf4cc664f66f9b3bdec0c928dcfc1))
- **endpoint-micropub:** add available queries to config query ([5545c59](https://github.com/getindiekit/indiekit/commit/5545c59d0e6eb3ebddb3fbd34df785f4da0950a7))
- **endpoint-micropub:** convert stored jf2 to mf2 on source query ([33e248c](https://github.com/getindiekit/indiekit/commit/33e248c87fd0fb290eb35d83b80400ab7dc0ab2d))
- **endpoint-micropub:** normalise properties when updating post data ([b498868](https://github.com/getindiekit/indiekit/commit/b498868d8471e502b418e492a8bc09bc60fca4c8))
- **endpoint-micropub:** only return categories for category query ([3d63ea0](https://github.com/getindiekit/indiekit/commit/3d63ea0767c7b5c4cd1cc62e06227b5f7545922d))
- **endpoint-micropub:** remove mf2 from post view ([4f85678](https://github.com/getindiekit/indiekit/commit/4f85678f419edbc948c6d9a3a99edce81c991101))
- **indiekit:** prevent pages from being crawled or indexed ([53bc449](https://github.com/getindiekit/indiekit/commit/53bc449ecb49e383262ba1d16c3b484b1e0e69d1))

# [0.1.0-alpha.20](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2021-01-07)

### Bug Fixes

- show 404 page if item not found in database ([f737d0a](https://github.com/getindiekit/indiekit/commit/f737d0af58970f8426711e773eb4360e8e4595a3))
- **endpoint-micropub:** fix content display error ([1d33c94](https://github.com/getindiekit/indiekit/commit/1d33c94bff923127b47ed34e3e0d8d30055abc94))

### Features

- **endpoint-micropub:** use relative media URLs ([e76abde](https://github.com/getindiekit/indiekit/commit/e76abdeb1698b378e4413d9a3b3741bfd406699f))
- **preset-hugo:** fallback to html content ([0022b71](https://github.com/getindiekit/indiekit/commit/0022b71e176012e991eba7565424a3ce48c03b0d))
- **preset-jekyll:** fallback to html content ([5d96402](https://github.com/getindiekit/indiekit/commit/5d96402f4bd911faf9205eafa9636ad57def9bba))

# [0.1.0-alpha.19](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2021-01-03)

### Bug Fixes

- always use mp-slug key for slug property ([49a2bf1](https://github.com/getindiekit/indiekit/commit/49a2bf1f4df3e0a67f7a0ad693bedef1e8c59928))
- **endpoint-micropub:** use timezone when updating post paths ([a55bed5](https://github.com/getindiekit/indiekit/commit/a55bed506c76756169fd2ea9f9d3ebfa039e0609))
- **endpoint-syndicate:** import JF2 properties into database ([daf2784](https://github.com/getindiekit/indiekit/commit/daf278413e35edc882e58d6a985c5dde004c694f))

# [0.1.0-alpha.18](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2021-01-01)

### Features

- **endpoint-syndicate:** use JF2 Feed, not JSON Feed ([78d515a](https://github.com/getindiekit/indiekit/commit/78d515a342a96db04b062009b1c00a62e2e378a6))

# [0.1.0-alpha.17](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2021-01-01)

### Features

- **endpoint-micropub:** reinstate forced syndication ([3a11ffe](https://github.com/getindiekit/indiekit/commit/3a11ffe80deae19e951b55947d28d47e91a6e838))
- **endpoint-syndicate:** check if post in json feed has already been syndicated ([abb1898](https://github.com/getindiekit/indiekit/commit/abb189826d7c42f2ccb7d1eb51f9ec8c7fa47112))

# [0.1.0-alpha.16](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2020-12-31)

### Bug Fixes

- **syndicator-twitter:** improve status text creation ([e59f166](https://github.com/getindiekit/indiekit/commit/e59f16660237b3fb8ae68e64efba82d7e3e470fd))

### Features

- **endpoint-micropub:** add text and html values to content property ([95d4724](https://github.com/getindiekit/indiekit/commit/95d47240f7a49e32a32da01fee3ae811b0383c07))
- **endpoint-syndicate:** add syndication from a json feed ([9f545f0](https://github.com/getindiekit/indiekit/commit/9f545f0786292f428282fa288907f1b689d59d17))
- **preset-hugo:** always use content.text value ([3243e8a](https://github.com/getindiekit/indiekit/commit/3243e8a332b1f8659d75b3f67596d6dc939c46cf))
- **preset-jekyll:** always use content.text value ([6659a45](https://github.com/getindiekit/indiekit/commit/6659a45033ecb68d63445b9664ef5a98ca5e0a22))
- **syndicator-twitter:** add alt text to photo uploads ([7a2eac2](https://github.com/getindiekit/indiekit/commit/7a2eac22970cce40a9fa22b7bb22dd9b7997cad9))
- **syndicator-twitter:** more robust in-reply-to check ([3e7d012](https://github.com/getindiekit/indiekit/commit/3e7d0127e6ffc772edf55ed37a62cc51619484d1))
- **syndicator-twitter:** more robust status text creation ([7159d81](https://github.com/getindiekit/indiekit/commit/7159d8193238777e933b3dc579e6514411873d1f))

# [0.1.0-alpha.15](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2020-12-28)

### Bug Fixes

- respect force syndication option ([14824b5](https://github.com/getindiekit/indiekit/commit/14824b5fa9a520fd1be640b4b9d8835e59399547))
- update demo config to not require a MongoDB URL ([933fdcd](https://github.com/getindiekit/indiekit/commit/933fdcd0f29198a20577deff1b636d5118842c62))

### Features

- **store-bitbucket:** add bitbucket store. fixes [#277](https://github.com/getindiekit/indiekit/issues/277) ([a0cb424](https://github.com/getindiekit/indiekit/commit/a0cb4249ef26c3846078844fc5eba65dc40b6bb7))
- **syndicator-twitter:** add twitter syndicator. fixes [#307](https://github.com/getindiekit/indiekit/issues/307) ([b8122a3](https://github.com/getindiekit/indiekit/commit/b8122a389e5509eac7f6347cf0653492202f7cea))

# [0.1.0-alpha.14](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2020-11-16)

### Bug Fixes

- **endpoint-syndicate:** correct success message. fixes [#295](https://github.com/getindiekit/indiekit/issues/295) ([210ee79](https://github.com/getindiekit/indiekit/commit/210ee7965342f6f35b924768ec8dbb3c97cc842a))
- **indiekit:** only show access token in status if session token present ([f97fa0b](https://github.com/getindiekit/indiekit/commit/f97fa0b56a3ed3376c981228898a045c798d567d))
- **indiekit:** validate redirect given to auth callback ([32af0c0](https://github.com/getindiekit/indiekit/commit/32af0c0d462596ef50f817d9b5a60421f50e2597))
- **syndicator-internet-archive:** add assets folder to module package ([2f1839a](https://github.com/getindiekit/indiekit/commit/2f1839a4eb870ae95ddadf39024c2f9b3ba3fea4))

### Features

- **endpoint-micropub:** allow server to override client checked syndication targets. fixes [#296](https://github.com/getindiekit/indiekit/issues/296) ([af57800](https://github.com/getindiekit/indiekit/commit/af5780099764fecf7a973585dba35a20cbac8b75))
- allow syndicators to supply assets ([fdf8b87](https://github.com/getindiekit/indiekit/commit/fdf8b87bb0b5a4331ced265d3258d53401791c98))
- **syndicator-internet-archive:** add support for ‘checked’ property ([c5666b8](https://github.com/getindiekit/indiekit/commit/c5666b8a6b96dc22edb062860217bab96ac43174))

# [0.1.0-alpha.13](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2020-10-29)

### Bug Fixes

- **endpoint-syndicate:** return 200 status code when responding ([882c2f9](https://github.com/getindiekit/indiekit/commit/882c2f967cdaf019cfd438c65d927f4820903fce))

# [0.1.0-alpha.12](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.10...v0.1.0-alpha.12) (2020-10-29)

### Bug Fixes

- **endpoint-media:** correctly identify dates without a time ([52066f3](https://github.com/getindiekit/indiekit/commit/52066f303599b9865bddc8c9b38fc787568c52d6))
- **endpoint-micropub:** capture missing operation when updating post data ([96bfeb8](https://github.com/getindiekit/indiekit/commit/96bfeb843ea6b83e85f628e33ee5884073aa3cad))
- **endpoint-micropub:** correct query to find published post ([cac37c5](https://github.com/getindiekit/indiekit/commit/cac37c57304f89d6bdd033da11af00111d73e500))
- **endpoint-micropub:** correctly identify dates without a time ([10af2a7](https://github.com/getindiekit/indiekit/commit/10af2a7eee1670d83a000453a0db926f3170867b))
- **endpoint-micropub:** fix undelete action ([502d465](https://github.com/getindiekit/indiekit/commit/502d4659a7f1ba25bbd48ce22673585e81f3a79b))
- **endpoint-micropub:** throw error with an invalid replacement value ([bdea302](https://github.com/getindiekit/indiekit/commit/bdea302fb46dd727e2847d9271bc921077359af5))
- **endpoint-micropub:** undelete action uses create scope ([a308618](https://github.com/getindiekit/indiekit/commit/a308618b8ccff5f27a3bb2dddc8e9cbc6301b80a))
- **indiekit:** merge values when adding a locale ([767c6dd](https://github.com/getindiekit/indiekit/commit/767c6dda4f253e474832d8147d04dbd486fe90c8))
- **preset-hugo:** correct property key for mp-syndicate-to ([656efa4](https://github.com/getindiekit/indiekit/commit/656efa44116e4a4b8c4f5c39d7f3f92ea43d6d80))
- **preset-jekyll:** correct property key for mp-syndicate-to ([73475d5](https://github.com/getindiekit/indiekit/commit/73475d554b197670fbdbc962f74cc18f2372ec28))

### Features

- authenticate syndication requests via token query ([b3d4f0c](https://github.com/getindiekit/indiekit/commit/b3d4f0cd0496e5edff9958a3e0166d840830d547))
- **endpoint-share:** translate status include ([02b9dc2](https://github.com/getindiekit/indiekit/commit/02b9dc230210f59af1cbeae3e3631b0a6aa2a6a6))
- **endpoint-syndicate:** endpoint for triggering syndication ([4cf89fa](https://github.com/getindiekit/indiekit/commit/4cf89faaac402390b234d16778f429b2ef36ed5f))
- **frontend:** use commonjs modules for compatibility ([cec14bb](https://github.com/getindiekit/indiekit/commit/cec14bb31850814073faf9b99e08354527f6ac50))
- **indiekit:** add theme to status page with german localisation ([becfe34](https://github.com/getindiekit/indiekit/commit/becfe344cc8e1b6410b9cd95822520f70ec3ec23))
- **preset-hugo:** add syndication property ([5826963](https://github.com/getindiekit/indiekit/commit/58269632a9e984cba014b23458a00c1d556c187c))
- **preset-jekyll:** add syndication property ([540bb51](https://github.com/getindiekit/indiekit/commit/540bb51f7ffd2bedc6d4e73b4181d80135c545d5))
- **store-gitea:** add store support for gitea. fixes [#100](https://github.com/getindiekit/indiekit/issues/100) ([255be67](https://github.com/getindiekit/indiekit/commit/255be670585f1fe8cf45e243580334736afd03cb))
- **syndicator-internet-archive:** syndicate to internet archive. fixes [#35](https://github.com/getindiekit/indiekit/issues/35) ([818eabd](https://github.com/getindiekit/indiekit/commit/818eabd24353dfc301b6a227d0f330c5d22c0c01))
- french translation ([ccb0eea](https://github.com/getindiekit/indiekit/commit/ccb0eea1a19c9051d3d400be107920838ef5d8fc))
- move documentation to new website ([6e9d62f](https://github.com/getindiekit/indiekit/commit/6e9d62f8994be2d1ab8db3e1b1f829700ee3007d))

# [0.1.0-alpha.11](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2020-10-12)

### Bug Fixes

- **endpoint-media:** correctly identify dates without a time ([52066f3](https://github.com/getindiekit/indiekit/commit/52066f303599b9865bddc8c9b38fc787568c52d6))
- **endpoint-micropub:** capture missing operation when updating post data ([96bfeb8](https://github.com/getindiekit/indiekit/commit/96bfeb843ea6b83e85f628e33ee5884073aa3cad))
- **endpoint-micropub:** correct query to find published post ([cac37c5](https://github.com/getindiekit/indiekit/commit/cac37c57304f89d6bdd033da11af00111d73e500))
- **endpoint-micropub:** correctly identify dates without a time ([10af2a7](https://github.com/getindiekit/indiekit/commit/10af2a7eee1670d83a000453a0db926f3170867b))
- **endpoint-micropub:** fix undelete action ([502d465](https://github.com/getindiekit/indiekit/commit/502d4659a7f1ba25bbd48ce22673585e81f3a79b))
- **endpoint-micropub:** throw error with an invalid replacement value ([bdea302](https://github.com/getindiekit/indiekit/commit/bdea302fb46dd727e2847d9271bc921077359af5))
- **endpoint-micropub:** undelete action uses create scope ([a308618](https://github.com/getindiekit/indiekit/commit/a308618b8ccff5f27a3bb2dddc8e9cbc6301b80a))
- **indiekit:** merge values when adding a locale ([767c6dd](https://github.com/getindiekit/indiekit/commit/767c6dda4f253e474832d8147d04dbd486fe90c8))
- **preset-hugo:** correct property key for mp-syndicate-to ([656efa4](https://github.com/getindiekit/indiekit/commit/656efa44116e4a4b8c4f5c39d7f3f92ea43d6d80))
- **preset-jekyll:** correct property key for mp-syndicate-to ([73475d5](https://github.com/getindiekit/indiekit/commit/73475d554b197670fbdbc962f74cc18f2372ec28))

### Features

- **indiekit-share:** translate status include ([0e8c701](https://github.com/getindiekit/indiekit/commit/0e8c70132b95c460add6ee85269e7036eaf35d4a))
- french translation ([ccb0eea](https://github.com/getindiekit/indiekit/commit/ccb0eea1a19c9051d3d400be107920838ef5d8fc))
- **frontend:** use commonjs modules for compatibility ([cec14bb](https://github.com/getindiekit/indiekit/commit/cec14bb31850814073faf9b99e08354527f6ac50))
- **store-gitea:** add store support for gitea. fixes [#100](https://github.com/getindiekit/indiekit/issues/100) ([255be67](https://github.com/getindiekit/indiekit/commit/255be670585f1fe8cf45e243580334736afd03cb))
- move documentation to new website ([6e9d62f](https://github.com/getindiekit/indiekit/commit/6e9d62f8994be2d1ab8db3e1b1f829700ee3007d))
- **indiekit:** add theme to status page with german localisation ([becfe34](https://github.com/getindiekit/indiekit/commit/becfe344cc8e1b6410b9cd95822520f70ec3ec23))

# [0.1.0-alpha.10](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2020-10-03)

### Bug Fixes

- correct time zone implementation. fixes [#294](https://github.com/getindiekit/indiekit/issues/294) ([a6f30b1](https://github.com/getindiekit/indiekit/commit/a6f30b1d93ec7a39fda5aa7f6933fc8f699b9bc2))
- german translations ([#293](https://github.com/getindiekit/indiekit/issues/293)) ([3dfdf76](https://github.com/getindiekit/indiekit/commit/3dfdf766e77bdd62cb282668f82e1f9f6252e0f8))

### Features

- configurable colour scheme ([7be2ba8](https://github.com/getindiekit/indiekit/commit/7be2ba8d103cc63469c98b242ebda029f78b723a))

# [0.1.0-alpha.9](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2020-09-28)

### Bug Fixes

- use timezone for path tokens ([0618656](https://github.com/getindiekit/indiekit/commit/06186568d9de9d333c70ab8a488685ec51ad3b3e))
- **endpoint-media:** correct time zone handling. fixes [#288](https://github.com/getindiekit/indiekit/issues/288) ([3dc5f09](https://github.com/getindiekit/indiekit/commit/3dc5f0955c7acfc56ab56b7ffc099d89ab32c605))
- **endpoint-micropub:** correct time zone handling. fixes [#287](https://github.com/getindiekit/indiekit/issues/287) ([7ae18c4](https://github.com/getindiekit/indiekit/commit/7ae18c4b446bdad26cc7db4783057004e9caf47b))
- **endpoint-micropub:** microformats display on post page ([e758f4d](https://github.com/getindiekit/indiekit/commit/e758f4d81cdc6ea5a1cf78bcba386a6536370ec8))
- **frontend:** unclosed div element ([a515c65](https://github.com/getindiekit/indiekit/commit/a515c651483e8c8b8129d28a338b24d095876ab9))

# [0.1.0-alpha.8](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2020-09-20)

### Bug Fixes

- make error summary title localisable ([aea81a4](https://github.com/getindiekit/indiekit/commit/aea81a47b658cdf42a3ad409ca2e2548925e2ee5))
- **indiekit:** add missing translation string for session.logout ([ddd1776](https://github.com/getindiekit/indiekit/commit/ddd1776eae4ef0f65541b236a5265c5fe164b19a))
- **indiekit:** prevent log in with other URLs. fixes [#283](https://github.com/getindiekit/indiekit/issues/283) ([9c151b7](https://github.com/getindiekit/indiekit/commit/9c151b79680a2b836ac2fc3d79c28770b54269b6))
- application name shown on status page ([7a83028](https://github.com/getindiekit/indiekit/commit/7a830288232024205585c7668dda95fd2ad18fef))
- locale used and shown on status page ([30ba27d](https://github.com/getindiekit/indiekit/commit/30ba27d8cb215e703078b1fe90600962d4ffbcd5))

### Features

- **endpoint-share:** add validation to share page. fixes [#284](https://github.com/getindiekit/indiekit/issues/284) ([31a875d](https://github.com/getindiekit/indiekit/commit/31a875de5b6bfe8366fab8c455fdf6804d15288c))
- **endpoint-share:** move url field above others ([88f6d32](https://github.com/getindiekit/indiekit/commit/88f6d32931fcd887867ed200dd49662e93717761))
- **endpoint-share:** translate validation errors. fixes [#285](https://github.com/getindiekit/indiekit/issues/285) ([df5067d](https://github.com/getindiekit/indiekit/commit/df5067d4612ad526381d555da3f06eb2196f96cb))
- **indiekit:** add translation string for optional value ([568be40](https://github.com/getindiekit/indiekit/commit/568be404200a65d00f3bb82160178cc68cf8f70c))

# [0.1.0-alpha.7](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2020-09-19)

### Bug Fixes

- list missing files in package.json ([fa48e0b](https://github.com/getindiekit/indiekit/commit/fa48e0be7473cd0da7a4af395b664355c73bdf02))

# [0.1.0-alpha.6](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.4...v0.1.0-alpha.6) (2020-09-18)

### Bug Fixes

- authenticate access to status page ([eb42847](https://github.com/getindiekit/indiekit/commit/eb42847b2a7a2eca2ee74b05ef4855c89730149f))
- inherit application.locale within default config ([d881ff8](https://github.com/getindiekit/indiekit/commit/d881ff8b3bcca9e00def1d6b15ffbbfcc33b1985))
- **frontend:** ensure u-logo can be parsed. fixes [#275](https://github.com/getindiekit/indiekit/issues/275) ([6f3f45e](https://github.com/getindiekit/indiekit/commit/6f3f45e05ddf191c5d4c57482b085cc6ff5912b9))
- only query previously published items if saving is enabled ([902d452](https://github.com/getindiekit/indiekit/commit/902d452974cef06585b417409945d398a79b4456))
- **frontend:** banner text legibility with dark color scheme ([4995ba3](https://github.com/getindiekit/indiekit/commit/4995ba39d4c1dd105f7bfa0782a7a71329812f24))
- remove environment variable no longer needed to set up app on Heroku ([b22224d](https://github.com/getindiekit/indiekit/commit/b22224de7998941e6ee6b834ae5134dc0e748ecd))
- update logging ([a52b4f4](https://github.com/getindiekit/indiekit/commit/a52b4f4c7a7dba15634138d1395c06add4ef7a76))
- **endpoint-micropub:** add lodash as dependency ([7c9db31](https://github.com/getindiekit/indiekit/commit/7c9db3118070c3c847b8d724e405142700cb84f2))
- make dotenv a runtime dependency ([0a831b0](https://github.com/getindiekit/indiekit/commit/0a831b0fa02f7f7e85600f2d9160caa89593c8bd))

### Features

- add mongodbUrl to application config ([fa418c7](https://github.com/getindiekit/indiekit/commit/fa418c7b4f4dd04f6e2c75e9e61c359038b1eeea))
- add preset and store directly to publication ([93a6677](https://github.com/getindiekit/indiekit/commit/93a667720fe5d68e0c728bc3d1b0026f91f50c66))
- add uuid path variable. fixes [#276](https://github.com/getindiekit/indiekit/issues/276) ([6790462](https://github.com/getindiekit/indiekit/commit/67904624f6bdc2c9d2d1a89d03bddc1e09a14e71))
- add zero padded seconds token ([c3994dd](https://github.com/getindiekit/indiekit/commit/c3994dd3dced235eee979ca34b8cc8d0cd9b9659))
- customise commit message format. fixes [#63](https://github.com/getindiekit/indiekit/issues/63) ([b2e43a5](https://github.com/getindiekit/indiekit/commit/b2e43a58f3810f24756ebc62d2b9c54c6445ad03))
- internationalisation ([e1eeb71](https://github.com/getindiekit/indiekit/commit/e1eeb7198bcc271a07538fc2a2396c8768d76590))
- move slug separator to publication settings ([baa4219](https://github.com/getindiekit/indiekit/commit/baa42197b3953ba62d44a90b4051392d1716b2e4))
- redirect signed out users to sign in page. fixes [#281](https://github.com/getindiekit/indiekit/issues/281) ([7750c32](https://github.com/getindiekit/indiekit/commit/7750c320793953f8831d92d795d7a61803563971))
- reinstate time zone support. fixes [#280](https://github.com/getindiekit/indiekit/issues/280) ([21bf932](https://github.com/getindiekit/indiekit/commit/21bf932bebff72e214320d4d84ef4fcb3328927b))
- remove hosted documentation ([18edd86](https://github.com/getindiekit/indiekit/commit/18edd865f12fc146b8767772002d8e0b7cba20ba))
- simplify publication config ([7ef1e45](https://github.com/getindiekit/indiekit/commit/7ef1e45f4a1d99eaaa50bdc5caaf9a70f6012fd2))
- use uuids for secrets ([48d6aa7](https://github.com/getindiekit/indiekit/commit/48d6aa7b42755ecd9efbc3aca2e4a088da91c99d))

# [0.1.0-alpha.5](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2020-09-06)

### Bug Fixes

- only query previously published items if saving is enabled ([902d452](https://github.com/getindiekit/indiekit/commit/902d452974cef06585b417409945d398a79b4456))
- **frontend**: banner text legibility with dark color scheme ([4995ba3](https://github.com/getindiekit/indiekit/commit/4995ba39d4c1dd105f7bfa0782a7a71329812f24))
- remove environment variable no longer needed to set up app on Heroku ([b22224d](https://github.com/getindiekit/indiekit/commit/b22224de7998941e6ee6b834ae5134dc0e748ecd))
- update logging ([a52b4f4](https://github.com/getindiekit/indiekit/commit/a52b4f4c7a7dba15634138d1395c06add4ef7a76))
- **endpoint-micropub:** add lodash as dependency ([7c9db31](https://github.com/getindiekit/indiekit/commit/7c9db3118070c3c847b8d724e405142700cb84f2))
- make dotenv a runtime dependency ([0a831b0](https://github.com/getindiekit/indiekit/commit/0a831b0fa02f7f7e85600f2d9160caa89593c8bd))

### Features

- remove hosted documentation ([18edd86](https://github.com/getindiekit/indiekit/commit/18edd865f12fc146b8767772002d8e0b7cba20ba))
- add zero padded seconds token ([c3994d](https://github.com/getindiekit/indiekit/commit/c3994dd3dced235eee979ca34b8cc8d0cd9b9659))
- add mongodbUrl to application config ([fa418c7](https://github.com/getindiekit/indiekit/commit/fa418c7b4f4dd04f6e2c75e9e61c359038b1eeea))
- add preset and store directly to publication config ([93a6677](https://github.com/getindiekit/indiekit/commit/93a667720fe5d68e0c728bc3d1b0026f91f50c66))
- add uuid path variable. fixes [#276](https://github.com/getindiekit/indiekit/issues/276) ([6790462](https://github.com/getindiekit/indiekit/commit/67904624f6bdc2c9d2d1a89d03bddc1e09a14e71))
- simplify publication config ([7ef1e45](https://github.com/getindiekit/indiekit/commit/7ef1e45f4a1d99eaaa50bdc5caaf9a70f6012fd2))
- move slug separator to publication settings ([baa4219](https://github.com/getindiekit/indiekit/commit/baa42197b3953ba62d44a90b4051392d1716b2e4))
- use uuids for secrets ([48d6aa7](https://github.com/getindiekit/indiekit/commit/48d6aa7b42755ecd9efbc3aca2e4a088da91c99d))
