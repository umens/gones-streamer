Changelog

# :rocket: Release [v2.1.0-beta.5](https://github.com/umens/gones-streamer/compare/v2.1.0-beta.4...v2.1.0-beta.5) (2022-05-30)
          

### :bug: Bug Fixes

* **charts:** fix infinite value display of bytes/s ([e5c0d7d](https://github.com/umens/gones-streamer/commit/e5c0d7d71bc878beb90ab4a1535e780ab22e035a))
* **settings:** fix buffer value display in settings ([46dcfe9](https://github.com/umens/gones-streamer/commit/46dcfe93ba52e1e484486055bdf6df7563a425b3))


### :robot: Continuous Integration

* **binaries:** lock version of dependencies binaries ([25d7e6a](https://github.com/umens/gones-streamer/commit/25d7e6ae0ba3c65c855d74b98f635781f2b5b354))

# :rocket: Release [v2.1.0-beta.4](https://github.com/umens/gones-streamer/compare/v2.1.0-beta.3...v2.1.0-beta.4) (2022-05-14)
          

### :sparkles: Enhancements

* **charts:** toggle chart display ([4a08f43](https://github.com/umens/gones-streamer/commit/4a08f437101cefa147748f2e66faae4f77c71803))
* **scoreboard:** add multiple scoreboard designs ([960f9ef](https://github.com/umens/gones-streamer/commit/960f9efec657541a46885f652cb4cb498480fe93))


### :fast_forward: Performance Improvements

* **chart rerendering:** disable rerendering for component which doesn't need to ([477d4b4](https://github.com/umens/gones-streamer/commit/477d4b4ecf8b0d21f5c5e8a81cb7283700a8005e))

# :rocket: Release [v2.1.0-beta.3](https://github.com/umens/gones-streamer/compare/v2.1.0-beta.2...v2.1.0-beta.3) (2022-04-28)
          

### :sparkles: Enhancements

* **charts:** add ability to toogle stream and core stats ([82afab8](https://github.com/umens/gones-streamer/commit/82afab8a60cb6db4fe0675d0da73c083bb7b68fa))

# :rocket: Release [v2.1.0-beta.2](https://github.com/umens/gones-streamer/compare/v2.1.0-beta.1...v2.1.0-beta.2) (2022-04-28)
          

### :sparkles: Enhancements

* **auto updater:** add auto update feature with update channel setting ([ff0bbae](https://github.com/umens/gones-streamer/commit/ff0bbaec66e7483b47738980c1c407454300ab3b))

# :rocket: Release [v2.1.0-beta.1](https://github.com/umens/gones-streamer/compare/v2.0.0...v2.1.0-beta.1) (2022-04-27)
          

### :recycle: Chores

* **dependencies:** update deps ([5d0bf94](https://github.com/umens/gones-streamer/commit/5d0bf9440433a30a56e356c47c834d5785d1fd67))


### :sparkles: Enhancements

* **audio:** add ability to manage audio (add/edit/delete) ([b7241d8](https://github.com/umens/gones-streamer/commit/b7241d8e30ff821183b44a08a4c67587ce7c3a02))
* **cameras:** add the ability to manage cameras (add/edit/delete) ([7aa9162](https://github.com/umens/gones-streamer/commit/7aa916211afc477afe92db7c8067265758bed5e5))
* **display:** add ability to change texts color and font ([3000fc6](https://github.com/umens/gones-streamer/commit/3000fc683eef89be6fcf5995167ceb6f3d3220de))
* **hardware setup:** add multi cam support ([9537dc4](https://github.com/umens/gones-streamer/commit/9537dc4edac5f6194d906d1061cfb57bdbc3eec8))


### :bug: Bug Fixes

* **audio form:** fix display of audio type in select ([7d4e96f](https://github.com/umens/gones-streamer/commit/7d4e96f6bdbc51dda7aa27720a720b8179d1b75c))
* **cameras:** fix displayed camera after first run in settings ([fd15073](https://github.com/umens/gones-streamer/commit/fd15073ce101530ef2b1c3f8c6b950949a43b424))
* **scoreboard:** fix text color (team and score) based on background color (team color) ([de9957b](https://github.com/umens/gones-streamer/commit/de9957b7bee94c174608cc3f779ea31eae73d10d))


### :zap: Code Refactoring

* **charts:** replace charts library to decrease build size ([ef9fd2b](https://github.com/umens/gones-streamer/commit/ef9fd2b27bfe79e8ccfeee1ad517bf64d7442e4c))
* **config store:** add new elements to Config Store for update existing install ([84ef5eb](https://github.com/umens/gones-streamer/commit/84ef5ebba07f09de7e93b0536f8cf4775afd3854))
* **updates deps:** use new obs websocket v5 ([990ae32](https://github.com/umens/gones-streamer/commit/990ae32abcb0a674e1d5c2de872c213ba7c381cc))


### :robot: Continuous Integration

* **ci:** update node version in release step ([497e06a](https://github.com/umens/gones-streamer/commit/497e06a4b772be7648ac446f83afeaca96bc3bee))
* **ci:** upgrade  node version in CI ([802f222](https://github.com/umens/gones-streamer/commit/802f222173648509d3ec96aa10c8a2c38809ad95))

# :rocket: Release [v2.0.0](https://github.com/umens/gones-streamer/compare/v1.3.0...v2.0.0) (2020-11-12)
          

### ⚠ BREAKING CHANGES

* **app:** Move from Angular to react framework for the frontend app

### :sparkles: Enhancements

* **app:** migrate to react ([243babf](https://github.com/umens/gones-streamer/commit/243babf16d91002ac0936152439843b0b51173aa))
* **sponsor:** add Sponsor feature ([48b9090](https://github.com/umens/gones-streamer/commit/48b90908531147bb2b50345de1bea90f1f81c398))
* **statistics:** add charts and statistics to Cockpit ([fb52f45](https://github.com/umens/gones-streamer/commit/fb52f4545f81195635db7784a0ba622d8d703b0c))


### :fast_forward: Performance Improvements

* **electron:** fix process still running after closing ([66f7011](https://github.com/umens/gones-streamer/commit/66f70117c808ea031bd91884a1bc0a27d9a99601))


### :bug: Bug Fixes

* **obs config:** fix missing file on fresh install ([e43a2d5](https://github.com/umens/gones-streamer/commit/e43a2d5676f2bccef7209cd3f6bc0e9c1832b618))


### :recycle: Chores

* **release:** 2.0.0-beta.1 [skip ci] ([876ad1e](https://github.com/umens/gones-streamer/commit/876ad1e245f647e460ba4b5df44471ae8e1ab570))
* **release:** 2.0.0-beta.2 [skip ci] ([81adc0c](https://github.com/umens/gones-streamer/commit/81adc0c80a275c64998ef3dcde2ad5811422f416))
* **release:** 2.0.0-beta.3 [skip ci] ([16ce031](https://github.com/umens/gones-streamer/commit/16ce031c445b5bb12be72fafd979581247b01a85))
* **release:** 2.0.0-beta.4 [skip ci] ([b533e21](https://github.com/umens/gones-streamer/commit/b533e21ba4fa8fa2c2308e2e6ecf7bbea36bac85))
* **release:** 2.0.0-beta.5 [skip ci] ([14bbf32](https://github.com/umens/gones-streamer/commit/14bbf32a73ee35a23d1c70f68f02d04396731658))


### :robot: Continuous Integration

* **ci:** add trigger ci on pull request on master ([442a5bc](https://github.com/umens/gones-streamer/commit/442a5bcc65b5aebc37673c9c3f6969ae8a84dbe5))
* **ci:** fix ci script ([40d4dd0](https://github.com/umens/gones-streamer/commit/40d4dd080a9b846eff8421085bc8debed205ea47))
* **ci:** fix ci script ([5a035cf](https://github.com/umens/gones-streamer/commit/5a035cf80e35f3916a5c8f43961ca3a7bf68d418))
* **ci:** fix ci script ([1648186](https://github.com/umens/gones-streamer/commit/16481862b9d08f3e792f40476cfc58cb177a196b))
* **ci:** fix ci script ([259dc95](https://github.com/umens/gones-streamer/commit/259dc95e380ceda5e4aaf9a5ca84c45196349479))
* **ci:** fix ci script ([98b11d0](https://github.com/umens/gones-streamer/commit/98b11d06f85bc5d4afeabdf67bfc868613f581c1))
* **ci:** fix ci script ([f5752f0](https://github.com/umens/gones-streamer/commit/f5752f0642da86cba64c5e414e820dfb27209383))
* **ci:** fix ci script for stable app release ([8322264](https://github.com/umens/gones-streamer/commit/832226430aa644c1743103870a45728a532a77e3))
* **ci:** update caching method in ci ([686f67c](https://github.com/umens/gones-streamer/commit/686f67c61aacbfe676b005a65e1b4e8ca459b6d8))
* **ci release:** update release job in workflow which crash ([ad9257a](https://github.com/umens/gones-streamer/commit/ad9257a1ceb0f3143ca57417125450beba7107d5))
* **ci workflow:** update ci workflow ([feeed9d](https://github.com/umens/gones-streamer/commit/feeed9d255a328ccf9927a1063ec15967dac4953))
* **hook:** remove husky from CI ([dba57cf](https://github.com/umens/gones-streamer/commit/dba57cf231759b8003da3961a95a3f7243e83090))
* **release:** add app targets ([66d08af](https://github.com/umens/gones-streamer/commit/66d08af03c54c76c82c101174835f6ac3e6cee8d))
* **release:** add beta step to ci ([60c60b0](https://github.com/umens/gones-streamer/commit/60c60b0beb48910c3c9b7b03fe53ec27464922d9))
* **release:** update release job ([f490cd8](https://github.com/umens/gones-streamer/commit/f490cd8982b690fdfe1708130352c02d63d42822))
* **release:** update release job ([d22def5](https://github.com/umens/gones-streamer/commit/d22def517103e09da5f45fb634cba2e1a242ed23))
* **release:** update release job ([0881b0e](https://github.com/umens/gones-streamer/commit/0881b0e770719a377918c5e792991926216be984))
* **release:** update release job ([cab9733](https://github.com/umens/gones-streamer/commit/cab97339ca142ca58b442f00dd2e7ba0dcdc7350))
* **release job:** fix ci release job ([6f2ddc1](https://github.com/umens/gones-streamer/commit/6f2ddc1eafdb0bb84a829c9b5dcfa6d8628d2f49))
* **semantic-release:** adjust ci scripts ([7189180](https://github.com/umens/gones-streamer/commit/71891801c4fd4464892932b3f30626385e4647dd))
* **test ci:** update test ci script ([4fab307](https://github.com/umens/gones-streamer/commit/4fab307ec32e13a01bd481c08525c437d592b69d))
* **workflow:** fix typo in workflow test ([2b21f6c](https://github.com/umens/gones-streamer/commit/2b21f6c8d2af74072f7494293375db4adc811a24))
* **workflow:** fix typo in workflow test ([7484c6e](https://github.com/umens/gones-streamer/commit/7484c6e6853a862780fc99a125866ad532f7417c))

# :rocket: Release [v2.0.0-beta.5](https://github.com/umens/gones-streamer/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2020-11-11)
          

### :bug: Bug Fixes

* **obs config:** fix missing file on fresh install ([e43a2d5](https://github.com/umens/gones-streamer/commit/e43a2d5676f2bccef7209cd3f6bc0e9c1832b618))

# :rocket: Release [v2.0.0-beta.4](https://github.com/umens/gones-streamer/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2020-11-09)
          

### :fast_forward: Performance Improvements

* **electron:** fix process still running after closing ([66f7011](https://github.com/umens/gones-streamer/commit/66f70117c808ea031bd91884a1bc0a27d9a99601))

# :rocket: Release [v2.0.0-beta.3](https://github.com/umens/gones-streamer/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2020-11-08)

# :rocket: Release [v2.0.0-beta.2](https://github.com/umens/gones-streamer/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2020-11-07)
          

### :robot: Continuous Integration

* **release:** add app targets ([66d08af](https://github.com/umens/gones-streamer/commit/66d08af03c54c76c82c101174835f6ac3e6cee8d))

# :rocket: Release [v2.0.0-beta.1](https://github.com/umens/gones-streamer/compare/v1.3.0...v2.0.0-beta.1) (2020-11-06)
          

### ⚠ BREAKING CHANGES

* **app:** Move from Angular to react framework for the frontend app

### :sparkles: Enhancements

* **app:** migrate to react ([243babf](https://github.com/umens/gones-streamer/commit/243babf16d91002ac0936152439843b0b51173aa))
* **sponsor:** add Sponsor feature ([48b9090](https://github.com/umens/gones-streamer/commit/48b90908531147bb2b50345de1bea90f1f81c398))
* **statistics:** add charts and statistics to Cockpit ([fb52f45](https://github.com/umens/gones-streamer/commit/fb52f4545f81195635db7784a0ba622d8d703b0c))


### :robot: Continuous Integration

* **ci:** update caching method in ci ([686f67c](https://github.com/umens/gones-streamer/commit/686f67c61aacbfe676b005a65e1b4e8ca459b6d8))
* **ci release:** update release job in workflow which crash ([ad9257a](https://github.com/umens/gones-streamer/commit/ad9257a1ceb0f3143ca57417125450beba7107d5))
* **ci workflow:** update ci workflow ([feeed9d](https://github.com/umens/gones-streamer/commit/feeed9d255a328ccf9927a1063ec15967dac4953))
* **hook:** remove husky from CI ([dba57cf](https://github.com/umens/gones-streamer/commit/dba57cf231759b8003da3961a95a3f7243e83090))
* **release:** add beta step to ci ([60c60b0](https://github.com/umens/gones-streamer/commit/60c60b0beb48910c3c9b7b03fe53ec27464922d9))
* **release:** update release job ([f490cd8](https://github.com/umens/gones-streamer/commit/f490cd8982b690fdfe1708130352c02d63d42822))
* **release:** update release job ([d22def5](https://github.com/umens/gones-streamer/commit/d22def517103e09da5f45fb634cba2e1a242ed23))
* **release:** update release job ([0881b0e](https://github.com/umens/gones-streamer/commit/0881b0e770719a377918c5e792991926216be984))
* **release:** update release job ([cab9733](https://github.com/umens/gones-streamer/commit/cab97339ca142ca58b442f00dd2e7ba0dcdc7350))
* **release job:** fix ci release job ([6f2ddc1](https://github.com/umens/gones-streamer/commit/6f2ddc1eafdb0bb84a829c9b5dcfa6d8628d2f49))
* **semantic-release:** adjust ci scripts ([7189180](https://github.com/umens/gones-streamer/commit/71891801c4fd4464892932b3f30626385e4647dd))
* **test ci:** update test ci script ([4fab307](https://github.com/umens/gones-streamer/commit/4fab307ec32e13a01bd481c08525c437d592b69d))
* **workflow:** fix typo in workflow test ([2b21f6c](https://github.com/umens/gones-streamer/commit/2b21f6c8d2af74072f7494293375db4adc811a24))
* **workflow:** fix typo in workflow test ([7484c6e](https://github.com/umens/gones-streamer/commit/7484c6e6853a862780fc99a125866ad532f7417c))


# :rocket: Release v1.3.0 (16/10/2019)


### :zap: Enhancements:

- [#13](https://github.com/umens/gones-streamer/issues/13) Add default websocket login to localhost:4444
- [#12](https://github.com/umens/gones-streamer/issues/12) Add trigger to change Quarter display
- [#11](https://github.com/umens/gones-streamer/issues/11) Update how to handle score for both team separately
- [#10](https://github.com/umens/gones-streamer/issues/10) Add trigger for Flag event
- [#9](https://github.com/umens/gones-streamer/issues/9) Change how to handle Away Team Name and City Name


### :hammer: Bug Fixes:

- [#17](https://github.com/umens/gones-streamer/issues/17) Fix e2e tests for travis to pass e2e tests
- [#16](https://github.com/umens/gones-streamer/issues/16) Fix tests for travis to pass tests


### :recycle: Dependencies Updates && Other chores:

- [#15](https://github.com/umens/gones-streamer/issues/15) Enable e2e tests in travis
- [#14](https://github.com/umens/gones-streamer/issues/14) Add changelog updates and release creation to travis build
- [#8](https://github.com/umens/gones-streamer/issues/8) Update Angular to v8


# :rocket: Release v1.2.0 (14/10/2019)


### :zap: Enhancements:

- [#4](https://github.com/umens/gones-streamer/issues/4) Add ability to connect to secure websocket (wss://)


### :hammer: Bug Fixes:

- [#5](https://github.com/umens/gones-streamer/issues/5) Can't set score to 0


# :rocket: Release v1.1.1 (15/10/2019)


*No changelog for this release.*


# :rocket: Release v1.1.0 (15/10/2019)


*No changelog for this release.*


# :rocket: Release v1.0.0 (15/10/2019)


*No changelog for this release.*
