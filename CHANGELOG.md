# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
