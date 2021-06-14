# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.3](https://github.com/getindiekit/indiekit/compare/v0.1.2...v0.1.3) (2021-06-14)


### Bug Fixes

* **indiekit:** override application url in config. fixes [#352](https://github.com/getindiekit/indiekit/issues/352) ([56affa5](https://github.com/getindiekit/indiekit/commit/56affa53849b94aafb51ecb065fff2da01a164a7))





## [0.1.2](https://github.com/getindiekit/indiekit/compare/v0.1.1...v0.1.2) (2021-05-30)


### Bug Fixes

* **indiekit:** incorrect this assignment in postTemplate function. fixes [#344](https://github.com/getindiekit/indiekit/issues/344) ([52812b8](https://github.com/getindiekit/indiekit/commit/52812b82d7bf8e522de900393e7275999d348965))
* **preset-hugo:** add missing like-of property ([75da03d](https://github.com/getindiekit/indiekit/commit/75da03d5047802af21394425da6387dd1fa3611b))
* **preset-hugo:** use camelcased frontmatter keys. fixes [#345](https://github.com/getindiekit/indiekit/issues/345) ([a4a6e93](https://github.com/getindiekit/indiekit/commit/a4a6e93a62420aefeea0c19a521dbe4ead297453))
* **preset-jekyll:** add missing like-of property ([6b0f60a](https://github.com/getindiekit/indiekit/commit/6b0f60ada43db4fa6b8b55e98605174d535f915e))





## [0.1.1](https://github.com/getindiekit/indiekit/compare/v0.1.0...v0.1.1) (2021-05-16)


### Bug Fixes

* media uploads failing. fixes [#343](https://github.com/getindiekit/indiekit/issues/343) ([3ad644d](https://github.com/getindiekit/indiekit/commit/3ad644d790345abe14335715666f2cb44403318b))





# [0.1.0](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.23...v0.1.0) (2021-03-15)


### Features

* **frontend:** support heading anchors and definition lists in Markdown ([dab1a2e](https://github.com/getindiekit/indiekit/commit/dab1a2edee4fbf7e9dc6b8c7543965a9a63a43d2))





# [0.1.0-alpha.23](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.22...v0.1.0-alpha.23) (2021-02-19)


### Bug Fixes

* disable watch for nunjucks templates to stop chokidar dependency errors ([b29e9e2](https://github.com/getindiekit/indiekit/commit/b29e9e2e6ed949ab4659bf631ff6b5577232504a))





# [0.1.0-alpha.22](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2021-02-19)


### Bug Fixes

* always syndicate to Twitter using HTML content property ([dea22bb](https://github.com/getindiekit/indiekit/commit/dea22bbb73393084bf39d7ffd04d3e61f851f4f5))
* **endpoint-micropub:** relative media path for publication url with path component ([9dd58ef](https://github.com/getindiekit/indiekit/commit/9dd58ef524635a90d714f86eb2e5c3fc94192f8a))


### Features

* **endpoint-media:** show message when no files to show ([6110ff1](https://github.com/getindiekit/indiekit/commit/6110ff1fe93bd9f7274764bac88fcc36cee58ce0))
* **endpoint-micropub:** parse geo uri for location property ([b28d789](https://github.com/getindiekit/indiekit/commit/b28d789d14f9d298a2fba6d736572f54577f8df0))
* **endpoint-micropub:** show message when no posts to show ([a3d9bce](https://github.com/getindiekit/indiekit/commit/a3d9bcec2e8f3dbf23c7b9b588166027cd45859c))
* **indiekit:** localise 404 page ([09ac3ac](https://github.com/getindiekit/indiekit/commit/09ac3ac03a2364c13bf26405a8926e2e5dafd68e))
* **preset-jekyll:** disable line folding on yaml strings ([ba3b21b](https://github.com/getindiekit/indiekit/commit/ba3b21b7824017c19e49e546173e6d3bd7793e3b))
* **syndicator-twitter:** always use absolute urls for uploading media ([5190195](https://github.com/getindiekit/indiekit/commit/51901959a36d37a91b362c818b63b6854e905b7d))
* pass publication config to syndicator ([32e1f35](https://github.com/getindiekit/indiekit/commit/32e1f356c7374c880c576f327a2d2754c2141b9f))
* **preset-hugo:** disable line folding on yaml strings ([c72a598](https://github.com/getindiekit/indiekit/commit/c72a5985db668fca7b47fe9f7b40b69a8f5ad7f0))





# [0.1.0-alpha.21](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2021-02-01)


### Bug Fixes

* **endpoint-micropub:** adding item to value which is not yet an array ([1067e8d](https://github.com/getindiekit/indiekit/commit/1067e8dfa6d8b9e64c3aa1bd77099e8dafbb3242))
* **endpoint-micropub:** creating posts with single media property ([901ad93](https://github.com/getindiekit/indiekit/commit/901ad93fcfc9615c76c014005f2094c108251268))
* **indiekit:** add default for publication.jf2Feed ([2d667a1](https://github.com/getindiekit/indiekit/commit/2d667a15e07402edb2d8eb4adefca95245044f44))
* **indiekit:** always return responses in auth flow ([069eac4](https://github.com/getindiekit/indiekit/commit/069eac4e6daa229dd4de2baf9b3227d68401e741))
* **indiekit:** remove extraenous form input ([4620f5d](https://github.com/getindiekit/indiekit/commit/4620f5db7f9520d615165412b93a0fece22238b7))
* **preset-hugo:** update content fallback values ([1794e34](https://github.com/getindiekit/indiekit/commit/1794e34a9d70cc9cb7377281a136419cbe7d2cc8))
* **preset-jekyll:** update content fallback values ([29111ae](https://github.com/getindiekit/indiekit/commit/29111ae9c9340df5840189ef45611e8c80c059c2))


### Features

* **frontend:** show ’Error:’ prefix for validated page title ([f9622b6](https://github.com/getindiekit/indiekit/commit/f9622b69ad5f57bef2742d0c51d5b23667b3b815))
* **frontend:** updated markup for error message ([22a7f5d](https://github.com/getindiekit/indiekit/commit/22a7f5d76d26ac3cdc2f97b82bd824d575011625))
* **indiekit:** remove media endpoint resolution ([3025aa7](https://github.com/getindiekit/indiekit/commit/3025aa747f04837a9ecff1326230b3e044f12242))
* abstract `summaryRow` filter for post and file views ([f32e28c](https://github.com/getindiekit/indiekit/commit/f32e28ce2640c6c3319276bbfbb077220a0e4b9e))
* make syndicator plug-ins dryer ([bc68462](https://github.com/getindiekit/indiekit/commit/bc684620597f78fe5b0fbe0b0d9e6ee73e7041f2))
* remove syncing website post data using a JF2 Feed ([6f39349](https://github.com/getindiekit/indiekit/commit/6f39349a98aaf4cc664f66f9b3bdec0c928dcfc1))
* **endpoint-micropub:** add available queries to config query ([5545c59](https://github.com/getindiekit/indiekit/commit/5545c59d0e6eb3ebddb3fbd34df785f4da0950a7))
* **endpoint-micropub:** convert stored jf2 to mf2 on source query ([33e248c](https://github.com/getindiekit/indiekit/commit/33e248c87fd0fb290eb35d83b80400ab7dc0ab2d))
* **endpoint-micropub:** normalise properties when updating post data ([b498868](https://github.com/getindiekit/indiekit/commit/b498868d8471e502b418e492a8bc09bc60fca4c8))
* **endpoint-micropub:** only return categories for category query ([3d63ea0](https://github.com/getindiekit/indiekit/commit/3d63ea0767c7b5c4cd1cc62e06227b5f7545922d))
* **endpoint-micropub:** remove mf2 from post view ([4f85678](https://github.com/getindiekit/indiekit/commit/4f85678f419edbc948c6d9a3a99edce81c991101))
* **indiekit:** prevent pages from being crawled or indexed ([53bc449](https://github.com/getindiekit/indiekit/commit/53bc449ecb49e383262ba1d16c3b484b1e0e69d1))





# [0.1.0-alpha.20](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2021-01-07)


### Bug Fixes

* show 404 page if item not found in database ([f737d0a](https://github.com/getindiekit/indiekit/commit/f737d0af58970f8426711e773eb4360e8e4595a3))
* **endpoint-micropub:** fix content display error ([1d33c94](https://github.com/getindiekit/indiekit/commit/1d33c94bff923127b47ed34e3e0d8d30055abc94))


### Features

* **endpoint-micropub:** use relative media URLs ([e76abde](https://github.com/getindiekit/indiekit/commit/e76abdeb1698b378e4413d9a3b3741bfd406699f))
* **preset-hugo:** fallback to html content ([0022b71](https://github.com/getindiekit/indiekit/commit/0022b71e176012e991eba7565424a3ce48c03b0d))
* **preset-jekyll:** fallback to html content ([5d96402](https://github.com/getindiekit/indiekit/commit/5d96402f4bd911faf9205eafa9636ad57def9bba))





# [0.1.0-alpha.19](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2021-01-03)


### Bug Fixes

* always use mp-slug key for slug property ([49a2bf1](https://github.com/getindiekit/indiekit/commit/49a2bf1f4df3e0a67f7a0ad693bedef1e8c59928))
* **endpoint-micropub:** use timezone when updating post paths ([a55bed5](https://github.com/getindiekit/indiekit/commit/a55bed506c76756169fd2ea9f9d3ebfa039e0609))
* **endpoint-syndicate:** import JF2 properties into database ([daf2784](https://github.com/getindiekit/indiekit/commit/daf278413e35edc882e58d6a985c5dde004c694f))





# [0.1.0-alpha.18](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2021-01-01)


### Features

* **endpoint-syndicate:** use JF2 Feed, not JSON Feed ([78d515a](https://github.com/getindiekit/indiekit/commit/78d515a342a96db04b062009b1c00a62e2e378a6))





# [0.1.0-alpha.17](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2021-01-01)


### Features

* **endpoint-micropub:** reinstate forced syndication ([3a11ffe](https://github.com/getindiekit/indiekit/commit/3a11ffe80deae19e951b55947d28d47e91a6e838))
* **endpoint-syndicate:** check if post in json feed has already been syndicated ([abb1898](https://github.com/getindiekit/indiekit/commit/abb189826d7c42f2ccb7d1eb51f9ec8c7fa47112))





# [0.1.0-alpha.16](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2020-12-31)


### Bug Fixes

* **syndicator-twitter:** improve status text creation ([e59f166](https://github.com/getindiekit/indiekit/commit/e59f16660237b3fb8ae68e64efba82d7e3e470fd))


### Features

* **endpoint-micropub:** add text and html values to content property ([95d4724](https://github.com/getindiekit/indiekit/commit/95d47240f7a49e32a32da01fee3ae811b0383c07))
* **endpoint-syndicate:** add syndication from a json feed ([9f545f0](https://github.com/getindiekit/indiekit/commit/9f545f0786292f428282fa288907f1b689d59d17))
* **preset-hugo:** always use content.text value ([3243e8a](https://github.com/getindiekit/indiekit/commit/3243e8a332b1f8659d75b3f67596d6dc939c46cf))
* **preset-jekyll:** always use content.text value ([6659a45](https://github.com/getindiekit/indiekit/commit/6659a45033ecb68d63445b9664ef5a98ca5e0a22))
* **syndicator-twitter:** add alt text to photo uploads ([7a2eac2](https://github.com/getindiekit/indiekit/commit/7a2eac22970cce40a9fa22b7bb22dd9b7997cad9))
* **syndicator-twitter:** more robust in-reply-to check ([3e7d012](https://github.com/getindiekit/indiekit/commit/3e7d0127e6ffc772edf55ed37a62cc51619484d1))
* **syndicator-twitter:** more robust status text creation ([7159d81](https://github.com/getindiekit/indiekit/commit/7159d8193238777e933b3dc579e6514411873d1f))





# [0.1.0-alpha.15](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2020-12-28)


### Bug Fixes

* respect force syndication option ([14824b5](https://github.com/getindiekit/indiekit/commit/14824b5fa9a520fd1be640b4b9d8835e59399547))
* update demo config to not require a MongoDB URL ([933fdcd](https://github.com/getindiekit/indiekit/commit/933fdcd0f29198a20577deff1b636d5118842c62))


### Features

* **store-bitbucket:** add bitbucket store. fixes [#277](https://github.com/getindiekit/indiekit/issues/277) ([a0cb424](https://github.com/getindiekit/indiekit/commit/a0cb4249ef26c3846078844fc5eba65dc40b6bb7))
* **syndicator-twitter:** add twitter syndicator. fixes [#307](https://github.com/getindiekit/indiekit/issues/307) ([b8122a3](https://github.com/getindiekit/indiekit/commit/b8122a389e5509eac7f6347cf0653492202f7cea))





# [0.1.0-alpha.14](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2020-11-16)


### Bug Fixes

* **endpoint-syndicate:** correct success message. fixes [#295](https://github.com/getindiekit/indiekit/issues/295) ([210ee79](https://github.com/getindiekit/indiekit/commit/210ee7965342f6f35b924768ec8dbb3c97cc842a))
* **indiekit:** only show access token in status if session token present ([f97fa0b](https://github.com/getindiekit/indiekit/commit/f97fa0b56a3ed3376c981228898a045c798d567d))
* **indiekit:** validate redirect given to auth callback ([32af0c0](https://github.com/getindiekit/indiekit/commit/32af0c0d462596ef50f817d9b5a60421f50e2597))
* **syndicator-internet-archive:** add assets folder to module package ([2f1839a](https://github.com/getindiekit/indiekit/commit/2f1839a4eb870ae95ddadf39024c2f9b3ba3fea4))


### Features

* **endpoint-micropub:** allow server to override client checked syndication targets. fixes [#296](https://github.com/getindiekit/indiekit/issues/296) ([af57800](https://github.com/getindiekit/indiekit/commit/af5780099764fecf7a973585dba35a20cbac8b75))
* allow syndicators to supply assets ([fdf8b87](https://github.com/getindiekit/indiekit/commit/fdf8b87bb0b5a4331ced265d3258d53401791c98))
* **syndicator-internet-archive:** add support for ‘checked’ property ([c5666b8](https://github.com/getindiekit/indiekit/commit/c5666b8a6b96dc22edb062860217bab96ac43174))





# [0.1.0-alpha.13](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2020-10-29)


### Bug Fixes

* **endpoint-syndicate:** return 200 status code when responding ([882c2f9](https://github.com/getindiekit/indiekit/commit/882c2f967cdaf019cfd438c65d927f4820903fce))





# [0.1.0-alpha.12](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.10...v0.1.0-alpha.12) (2020-10-29)


### Bug Fixes

* **endpoint-media:** correctly identify dates without a time ([52066f3](https://github.com/getindiekit/indiekit/commit/52066f303599b9865bddc8c9b38fc787568c52d6))
* **endpoint-micropub:** capture missing operation when updating post data ([96bfeb8](https://github.com/getindiekit/indiekit/commit/96bfeb843ea6b83e85f628e33ee5884073aa3cad))
* **endpoint-micropub:** correct query to find published post ([cac37c5](https://github.com/getindiekit/indiekit/commit/cac37c57304f89d6bdd033da11af00111d73e500))
* **endpoint-micropub:** correctly identify dates without a time ([10af2a7](https://github.com/getindiekit/indiekit/commit/10af2a7eee1670d83a000453a0db926f3170867b))
* **endpoint-micropub:** fix undelete action ([502d465](https://github.com/getindiekit/indiekit/commit/502d4659a7f1ba25bbd48ce22673585e81f3a79b))
* **endpoint-micropub:** throw error with an invalid replacement value ([bdea302](https://github.com/getindiekit/indiekit/commit/bdea302fb46dd727e2847d9271bc921077359af5))
* **endpoint-micropub:** undelete action uses create scope ([a308618](https://github.com/getindiekit/indiekit/commit/a308618b8ccff5f27a3bb2dddc8e9cbc6301b80a))
* **indiekit:** merge values when adding a locale ([767c6dd](https://github.com/getindiekit/indiekit/commit/767c6dda4f253e474832d8147d04dbd486fe90c8))
* **preset-hugo:** correct property key for mp-syndicate-to ([656efa4](https://github.com/getindiekit/indiekit/commit/656efa44116e4a4b8c4f5c39d7f3f92ea43d6d80))
* **preset-jekyll:** correct property key for mp-syndicate-to ([73475d5](https://github.com/getindiekit/indiekit/commit/73475d554b197670fbdbc962f74cc18f2372ec28))


### Features

* authenticate syndication requests via token query ([b3d4f0c](https://github.com/getindiekit/indiekit/commit/b3d4f0cd0496e5edff9958a3e0166d840830d547))
* **endpoint-share:** translate status include ([02b9dc2](https://github.com/getindiekit/indiekit/commit/02b9dc230210f59af1cbeae3e3631b0a6aa2a6a6))
* **endpoint-syndicate:** endpoint for triggering syndication ([4cf89fa](https://github.com/getindiekit/indiekit/commit/4cf89faaac402390b234d16778f429b2ef36ed5f))
* **frontend:** use commonjs modules for compatibility ([cec14bb](https://github.com/getindiekit/indiekit/commit/cec14bb31850814073faf9b99e08354527f6ac50))
* **indiekit:** add theme to status page with german localisation ([becfe34](https://github.com/getindiekit/indiekit/commit/becfe344cc8e1b6410b9cd95822520f70ec3ec23))
* **preset-hugo:** add syndication property ([5826963](https://github.com/getindiekit/indiekit/commit/58269632a9e984cba014b23458a00c1d556c187c))
* **preset-jekyll:** add syndication property ([540bb51](https://github.com/getindiekit/indiekit/commit/540bb51f7ffd2bedc6d4e73b4181d80135c545d5))
* **store-gitea:** add store support for gitea. fixes [#100](https://github.com/getindiekit/indiekit/issues/100) ([255be67](https://github.com/getindiekit/indiekit/commit/255be670585f1fe8cf45e243580334736afd03cb))
* **syndicator-internet-archive:** syndicate to internet archive. fixes [#35](https://github.com/getindiekit/indiekit/issues/35) ([818eabd](https://github.com/getindiekit/indiekit/commit/818eabd24353dfc301b6a227d0f330c5d22c0c01))
* french translation ([ccb0eea](https://github.com/getindiekit/indiekit/commit/ccb0eea1a19c9051d3d400be107920838ef5d8fc))
* move documentation to new website ([6e9d62f](https://github.com/getindiekit/indiekit/commit/6e9d62f8994be2d1ab8db3e1b1f829700ee3007d))





# [0.1.0-alpha.11](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2020-10-12)


### Bug Fixes

* **endpoint-media:** correctly identify dates without a time ([52066f3](https://github.com/getindiekit/indiekit/commit/52066f303599b9865bddc8c9b38fc787568c52d6))
* **endpoint-micropub:** capture missing operation when updating post data ([96bfeb8](https://github.com/getindiekit/indiekit/commit/96bfeb843ea6b83e85f628e33ee5884073aa3cad))
* **endpoint-micropub:** correct query to find published post ([cac37c5](https://github.com/getindiekit/indiekit/commit/cac37c57304f89d6bdd033da11af00111d73e500))
* **endpoint-micropub:** correctly identify dates without a time ([10af2a7](https://github.com/getindiekit/indiekit/commit/10af2a7eee1670d83a000453a0db926f3170867b))
* **endpoint-micropub:** fix undelete action ([502d465](https://github.com/getindiekit/indiekit/commit/502d4659a7f1ba25bbd48ce22673585e81f3a79b))
* **endpoint-micropub:** throw error with an invalid replacement value ([bdea302](https://github.com/getindiekit/indiekit/commit/bdea302fb46dd727e2847d9271bc921077359af5))
* **endpoint-micropub:** undelete action uses create scope ([a308618](https://github.com/getindiekit/indiekit/commit/a308618b8ccff5f27a3bb2dddc8e9cbc6301b80a))
* **indiekit:** merge values when adding a locale ([767c6dd](https://github.com/getindiekit/indiekit/commit/767c6dda4f253e474832d8147d04dbd486fe90c8))
* **preset-hugo:** correct property key for mp-syndicate-to ([656efa4](https://github.com/getindiekit/indiekit/commit/656efa44116e4a4b8c4f5c39d7f3f92ea43d6d80))
* **preset-jekyll:** correct property key for mp-syndicate-to ([73475d5](https://github.com/getindiekit/indiekit/commit/73475d554b197670fbdbc962f74cc18f2372ec28))


### Features

* **indiekit-share:** translate status include ([0e8c701](https://github.com/getindiekit/indiekit/commit/0e8c70132b95c460add6ee85269e7036eaf35d4a))
* french translation ([ccb0eea](https://github.com/getindiekit/indiekit/commit/ccb0eea1a19c9051d3d400be107920838ef5d8fc))
* **frontend:** use commonjs modules for compatibility ([cec14bb](https://github.com/getindiekit/indiekit/commit/cec14bb31850814073faf9b99e08354527f6ac50))
* **store-gitea:** add store support for gitea. fixes [#100](https://github.com/getindiekit/indiekit/issues/100) ([255be67](https://github.com/getindiekit/indiekit/commit/255be670585f1fe8cf45e243580334736afd03cb))
* move documentation to new website ([6e9d62f](https://github.com/getindiekit/indiekit/commit/6e9d62f8994be2d1ab8db3e1b1f829700ee3007d))
* **indiekit:** add theme to status page with german localisation ([becfe34](https://github.com/getindiekit/indiekit/commit/becfe344cc8e1b6410b9cd95822520f70ec3ec23))





# [0.1.0-alpha.10](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2020-10-03)


### Bug Fixes

* correct time zone implementation. fixes [#294](https://github.com/getindiekit/indiekit/issues/294) ([a6f30b1](https://github.com/getindiekit/indiekit/commit/a6f30b1d93ec7a39fda5aa7f6933fc8f699b9bc2))
* german translations ([#293](https://github.com/getindiekit/indiekit/issues/293)) ([3dfdf76](https://github.com/getindiekit/indiekit/commit/3dfdf766e77bdd62cb282668f82e1f9f6252e0f8))


### Features

* configurable colour scheme ([7be2ba8](https://github.com/getindiekit/indiekit/commit/7be2ba8d103cc63469c98b242ebda029f78b723a))





# [0.1.0-alpha.9](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2020-09-28)


### Bug Fixes

* use timezone for path tokens ([0618656](https://github.com/getindiekit/indiekit/commit/06186568d9de9d333c70ab8a488685ec51ad3b3e))
* **endpoint-media:** correct time zone handling. fixes [#288](https://github.com/getindiekit/indiekit/issues/288) ([3dc5f09](https://github.com/getindiekit/indiekit/commit/3dc5f0955c7acfc56ab56b7ffc099d89ab32c605))
* **endpoint-micropub:** correct time zone handling. fixes [#287](https://github.com/getindiekit/indiekit/issues/287) ([7ae18c4](https://github.com/getindiekit/indiekit/commit/7ae18c4b446bdad26cc7db4783057004e9caf47b))
* **endpoint-micropub:** microformats display on post page ([e758f4d](https://github.com/getindiekit/indiekit/commit/e758f4d81cdc6ea5a1cf78bcba386a6536370ec8))
* **frontend:** unclosed div element ([a515c65](https://github.com/getindiekit/indiekit/commit/a515c651483e8c8b8129d28a338b24d095876ab9))





# [0.1.0-alpha.8](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2020-09-20)


### Bug Fixes

* make error summary title localisable ([aea81a4](https://github.com/getindiekit/indiekit/commit/aea81a47b658cdf42a3ad409ca2e2548925e2ee5))
* **indiekit:** add missing translation string for session.logout ([ddd1776](https://github.com/getindiekit/indiekit/commit/ddd1776eae4ef0f65541b236a5265c5fe164b19a))
* **indiekit:** prevent log in with other URLs. fixes [#283](https://github.com/getindiekit/indiekit/issues/283) ([9c151b7](https://github.com/getindiekit/indiekit/commit/9c151b79680a2b836ac2fc3d79c28770b54269b6))
* application name shown on status page ([7a83028](https://github.com/getindiekit/indiekit/commit/7a830288232024205585c7668dda95fd2ad18fef))
* locale used and shown on status page ([30ba27d](https://github.com/getindiekit/indiekit/commit/30ba27d8cb215e703078b1fe90600962d4ffbcd5))


### Features

* **endpoint-share:** add validation to share page. fixes [#284](https://github.com/getindiekit/indiekit/issues/284) ([31a875d](https://github.com/getindiekit/indiekit/commit/31a875de5b6bfe8366fab8c455fdf6804d15288c))
* **endpoint-share:** move url field above others ([88f6d32](https://github.com/getindiekit/indiekit/commit/88f6d32931fcd887867ed200dd49662e93717761))
* **endpoint-share:** translate validation errors. fixes [#285](https://github.com/getindiekit/indiekit/issues/285) ([df5067d](https://github.com/getindiekit/indiekit/commit/df5067d4612ad526381d555da3f06eb2196f96cb))
* **indiekit:** add translation string for optional value ([568be40](https://github.com/getindiekit/indiekit/commit/568be404200a65d00f3bb82160178cc68cf8f70c))





# [0.1.0-alpha.7](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2020-09-19)


### Bug Fixes

* list missing files in package.json ([fa48e0b](https://github.com/getindiekit/indiekit/commit/fa48e0be7473cd0da7a4af395b664355c73bdf02))





# [0.1.0-alpha.6](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.4...v0.1.0-alpha.6) (2020-09-18)


### Bug Fixes

* authenticate access to status page ([eb42847](https://github.com/getindiekit/indiekit/commit/eb42847b2a7a2eca2ee74b05ef4855c89730149f))
* inherit application.locale within default config ([d881ff8](https://github.com/getindiekit/indiekit/commit/d881ff8b3bcca9e00def1d6b15ffbbfcc33b1985))
* **frontend:** ensure u-logo can be parsed. fixes [#275](https://github.com/getindiekit/indiekit/issues/275) ([6f3f45e](https://github.com/getindiekit/indiekit/commit/6f3f45e05ddf191c5d4c57482b085cc6ff5912b9))
* only query previously published items if saving is enabled ([902d452](https://github.com/getindiekit/indiekit/commit/902d452974cef06585b417409945d398a79b4456))
* **frontend:** banner text legiblility with dark color scheme ([4995ba3](https://github.com/getindiekit/indiekit/commit/4995ba39d4c1dd105f7bfa0782a7a71329812f24))
* remove environment variable no longer needed to set up app on Heroku ([b22224d](https://github.com/getindiekit/indiekit/commit/b22224de7998941e6ee6b834ae5134dc0e748ecd))
* update logging ([a52b4f4](https://github.com/getindiekit/indiekit/commit/a52b4f4c7a7dba15634138d1395c06add4ef7a76))
* **endpoint-micropub:** add lodash as dependency ([7c9db31](https://github.com/getindiekit/indiekit/commit/7c9db3118070c3c847b8d724e405142700cb84f2))
* make dotenv a runtime dependency ([0a831b0](https://github.com/getindiekit/indiekit/commit/0a831b0fa02f7f7e85600f2d9160caa89593c8bd))


### Features

* add mongodbUrl to application config ([fa418c7](https://github.com/getindiekit/indiekit/commit/fa418c7b4f4dd04f6e2c75e9e61c359038b1eeea))
* add preset and store directly to publication ([93a6677](https://github.com/getindiekit/indiekit/commit/93a667720fe5d68e0c728bc3d1b0026f91f50c66))
* add uuid path variable. fixes [#276](https://github.com/getindiekit/indiekit/issues/276) ([6790462](https://github.com/getindiekit/indiekit/commit/67904624f6bdc2c9d2d1a89d03bddc1e09a14e71))
* add zero padded seconds token ([c3994dd](https://github.com/getindiekit/indiekit/commit/c3994dd3dced235eee979ca34b8cc8d0cd9b9659))
* customise commit message format. fixes [#63](https://github.com/getindiekit/indiekit/issues/63) ([b2e43a5](https://github.com/getindiekit/indiekit/commit/b2e43a58f3810f24756ebc62d2b9c54c6445ad03))
* internationalisation ([e1eeb71](https://github.com/getindiekit/indiekit/commit/e1eeb7198bcc271a07538fc2a2396c8768d76590))
* move slug separator to publication settings ([baa4219](https://github.com/getindiekit/indiekit/commit/baa42197b3953ba62d44a90b4051392d1716b2e4))
* redirect signed out users to sign in page. fixes [#281](https://github.com/getindiekit/indiekit/issues/281) ([7750c32](https://github.com/getindiekit/indiekit/commit/7750c320793953f8831d92d795d7a61803563971))
* reinstate time zone support. fixes [#280](https://github.com/getindiekit/indiekit/issues/280) ([21bf932](https://github.com/getindiekit/indiekit/commit/21bf932bebff72e214320d4d84ef4fcb3328927b))
* remove hosted documentation ([18edd86](https://github.com/getindiekit/indiekit/commit/18edd865f12fc146b8767772002d8e0b7cba20ba))
* simplify publication config ([7ef1e45](https://github.com/getindiekit/indiekit/commit/7ef1e45f4a1d99eaaa50bdc5caaf9a70f6012fd2))
* use uuids for secrets ([48d6aa7](https://github.com/getindiekit/indiekit/commit/48d6aa7b42755ecd9efbc3aca2e4a088da91c99d))





# [0.1.0-alpha.5](https://github.com/getindiekit/indiekit/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2020-09-06)


### Bug Fixes

* only query previously published items if saving is enabled ([902d452](https://github.com/getindiekit/indiekit/commit/902d452974cef06585b417409945d398a79b4456))
* **frontend**: banner text legiblility with dark color scheme ([4995ba3](https://github.com/getindiekit/indiekit/commit/4995ba39d4c1dd105f7bfa0782a7a71329812f24))
* remove environment variable no longer needed to set up app on Heroku ([b22224d](https://github.com/getindiekit/indiekit/commit/b22224de7998941e6ee6b834ae5134dc0e748ecd))
* update logging ([a52b4f4](https://github.com/getindiekit/indiekit/commit/a52b4f4c7a7dba15634138d1395c06add4ef7a76))
* **endpoint-micropub:** add lodash as dependency ([7c9db31](https://github.com/getindiekit/indiekit/commit/7c9db3118070c3c847b8d724e405142700cb84f2))
* make dotenv a runtime dependency ([0a831b0](https://github.com/getindiekit/indiekit/commit/0a831b0fa02f7f7e85600f2d9160caa89593c8bd))

### Features

* remove hosted documentation ([18edd86](https://github.com/getindiekit/indiekit/commit/18edd865f12fc146b8767772002d8e0b7cba20ba))
* add zero padded seconds token ([c3994d](https://github.com/getindiekit/indiekit/commit/c3994dd3dced235eee979ca34b8cc8d0cd9b9659))
* add mongodbUrl to application config ([fa418c7](https://github.com/getindiekit/indiekit/commit/fa418c7b4f4dd04f6e2c75e9e61c359038b1eeea))
* add preset and store directly to publication config ([93a6677](https://github.com/getindiekit/indiekit/commit/93a667720fe5d68e0c728bc3d1b0026f91f50c66))
* add uuid path variable. fixes [#276](https://github.com/getindiekit/indiekit/issues/276) ([6790462](https://github.com/getindiekit/indiekit/commit/67904624f6bdc2c9d2d1a89d03bddc1e09a14e71))
* simplify publication config ([7ef1e45](https://github.com/getindiekit/indiekit/commit/7ef1e45f4a1d99eaaa50bdc5caaf9a70f6012fd2))
* move slug separator to publication settings ([baa4219](https://github.com/getindiekit/indiekit/commit/baa42197b3953ba62d44a90b4051392d1716b2e4))
* use uuids for secrets ([48d6aa7](https://github.com/getindiekit/indiekit/commit/48d6aa7b42755ecd9efbc3aca2e4a088da91c99d))
