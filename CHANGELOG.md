## 2.5.0 (9 Jul 2022)

* feat: add ts declaration [#187](https://github.com/liriliri/eruda/pull/187)
* refactor: use luna console
* refactor: use chobitsu for highlighting element

## 2.4.1 (28 Sep 2020)

* fix: remove arrow function [#160](https://github.com/liriliri/eruda/issues/160)

## 2.4.0 (14 Sep 2020)

* feat: default settings [#141](https://github.com/liriliri/eruda/issues/141)
* fix(elements): highlight
* fix(console): blinks frequently as it scroll to the border
* refactor: use chobitsu

## 2.3.3 (3 May 2020)

* fix: unsafe-eval CSP violation [#140](https://github.com/liriliri/eruda/issues/140)

## v2.3.2 (29 Apr 2020)

* fix(console): scroll performance

## v2.3.1 (28 Apr 2020)

* fix(elements): content highlight

## v2.3.0 (28 Apr 2020)

* feat: refresh notification
* fix(console): safari bounce effect
* fix(elements): highlight

## v2.2.2 (17 Apr 2020)

* fix(console): extra info from
* chore: update icons

## v2.2.1 (20 Mar 2020)

* fix: redundant evaluated style
* chore: use [luna-object-viewer](https://github.com/liriliri/luna) for viewing object

## v2.2.0 (9 Feb 2020)

* feat: use dark theme for dark mode
* feat(elements): computed style filter
* feat(resources): storage and cookie filter
* fix(snippet): error loading plugin for local page
* fix(console): unable to clear filter

## v2.1.0 (2 Feb 2020)

* feat: change navigation bar height
* feat: change default transparency to 1
* feat: change loaded plugin position
* feat(console): remove debug filter
* feat(console): improve input style
* feat(console): show filter text
* feat(network): add requests api [#132](https://github.com/liriliri/eruda/issues/132)

## v2.0.2 (9 Jan 2020)

* chore: reduce file size (452kb -> 418kb)

## v2.0.1 (6 Jan 2020)

* chore: update plugins

## v2.0.0 (3 Jan 2020)

* feat: theme support
* feat(console): $x utility
* feat(console): remove useWorker
* feat(sources): indent size configuration
* fix(console): url recognition
* fix(console): log style
* fix(sources): scrolling
* perf(console): large object expansion
* chore: reduce file size (472kb -> 452kb)

## v1.10.3 (8 Nov 2019)

* fix(info): escape location [#127](https://github.com/liriliri/eruda/issues/127)
* chore: update refresh icon
* chore: update timing plugin version

## v1.10.2 (5 Nov 2019)

* fix: must add .default if using require 

## v1.10.1 (4 Nov 2019)

* fix(console): error display when js execution disabled

## v1.10.0 (4 Nov 2019)

* chore: updated to babel7, must add .default if using require 
* feat(console): multiple console instance
* perf(console): rendering for a large number of logs

## v1.9.2 (1 Nov 2019)

* perf(console): rendering

## v1.9.1 (27 Oct 2019)

* perf(console): asynchronous log render
* perf(console): reduce memory usage, 50% drop

## v1.9.0 (20 Oct 2019)

* feat: add snippet for loading touches plugin
* feat: add fit screen snippet
* fix(console): filter shouldn't affect group

## v1.8.1 (14 Oct 2019)

* fix(network): style [#121](https://github.com/liriliri/eruda/issues/121)

## v1.8.0 (13 Oct 2019)

* feat(network): display optimization
* feat: move http view from sources to network
* fix(console): group object expansion

## v1.7.2 (11 Oct 2019)

* fix(console): blank bottom if js input is disabled
* chore: update eruda-dom version

## v1.7.1 (10 Oct 2019)

* fix: resize

## v1.7.0 (8 Oct 2019)

* feat: resize [#89](https://github.com/liriliri/eruda/issues/89)
* feat(console): replace help button with filter
* feat(console): disable js execution
* feat(console): [utilities api](https://developers.google.cn/web/tools/chrome-devtools/console/utilities)
* fix(console): disable log collapsing for group
* fix(elements): select not working for desktop

## v1.6.3 (1 Oct 2019)

* fix(console): log border style

## v1.6.2 (29 Sep 2019)

* fix: container style affected [#119](https://github.com/liriliri/eruda/issues/119)
* fix(console): log style, line-height should be normal

## v1.6.1 (27 Sep 2019)

* feat(network): catch fetch request headers
* feat(console): timeLog, countReset
* fix(console): clear not working
* fix(console): table

## v1.6.0 (26 Sep 2019)

* feat: console group
* fix: console style, width and height is forbidden
* fix: regexp json view
* chore: update fps and memory plugin version

## v1.5.8 (2 Aug 2019)

* fix: safeStorage undefined [#108](https://github.com/liriliri/eruda/issues/108)

## v1.5.7 (15 Jul 2019)

* Fix iOS max log number
* Disable calling init if already initialized
* Disable worker by default
* Support xhr blob response type [#104](https://github.com/liriliri/eruda/issues/100)

## v1.5.6 (17 Jun 2019)

* Disable log collapse for objects

## v1.5.5 (25 May 2019)

* Fix resources error when cookie has % [#100](https://github.com/liriliri/eruda/issues/100)
* Update dom plugin version

## v1.5.4 (23 Sep 2018)

* Fix network url start with //
* Smaller padding for logs

## v1.5.3 (2 Sep 2018)

* Add load dom plugin snippet
* Disable highlight for invisible elements
* Fix unexpected token \t in JSON
* Add load orientation plugin snippet

## v1.5.2 (23 Aug 2018)

* Fix console show in sources panel
* Fix log merge
* Support getting entryBtn instance
* Update timing plugin version
* Add remove setting api
* Fix safari merge log exception

## v1.5.1 (18 Aug 2018)

* Fix uglifyjs unicode escape [#69](https://github.com/liriliri/eruda/issues/69)
* Update icons, use [iconfont](http://www.iconfont.cn) instead of [icomoon](https://icomoon.io/)
* Show custom request headers [#78](https://github.com/liriliri/eruda/pull/78)
* Add get api to info panel [#83](https://github.com/liriliri/eruda/issues/83)
* Fix responseType json error [#82](https://github.com/liriliri/eruda/issues/82)
* Support console lazy evaluation

## v1.5.0 (19 Jun 2018)

* Use shadow dom to encapsulate css
* Enable sources copy [#71](https://github.com/liriliri/eruda/issues/71)
* Improve **borderAll** style
* Add **position** api [#74](https://github.com/liriliri/eruda/issues/74)
* Fix nav bottom bar wrong position when removed

## v1.4.4 (27 May 2018)

* Improve console line break display
* Add **rmCookie** util
* Add **Load Geolocation Plugin** snippet
* Fix Elements cssRules [#63](https://github.com/liriliri/eruda/issues/63)
* Support console events [#66](https://github.com/liriliri/eruda/issues/66)
* Fix Uc browser console worker [#62](https://github.com/liriliri/eruda/issues/62)

## v1.4.3 (7 Feb 2018)

* Dynamic info content support [#51](https://github.com/liriliri/eruda/issues/51)
* Fix console input covered by error log
* Add elements box model chart
* Fix source code white-space style [#53](https://github.com/liriliri/eruda/issues/53)
* Resources support iframe
* Add **Load Benchmark Plugin** snippet

## v1.4.2 (28 Jan 2018)

* Extract viewportScale util into [eris](https://github.com/liriliri/eris)
* Improve image list view using flex
* Add DevTools display event hooks [#50](https://github.com/liriliri/eruda/issues/50)

## v1.4.1 (13 Jan 2018)

* Update timing plugin version
* Fix viewportScale
* Optimize console performance for big data
* Expose snippets run api
* Delete desktop scrollbar style
* Add code plugin to snippets

## v1.4.0 (7 Jan 2018)

* Remove network timing into external plugin
* Add system info
* Add memory plugin snippet
* Monitor fetch requests [#24](https://github.com/liriliri/eruda/issues/24)
* Reduce json viewer click area
* Use resource timing for image capture

## v1.3.2 (14 Dec 2017)

* Fix restore settings snippet
* Extract *features* into an external plugin

## v1.3.1 (19 Nov 2017)

* Observe elements in resources panel
* Fix performance timing not supported [#40](https://github.com/liriliri/eruda/issues/40)

## v1.3.0 (5 Nov 2017)

* Remove log margin
* Fix css custom properties [#33](https://github.com/liriliri/eruda/issues/33)
* Add version info
* Change icomoon generated font name
* Improve snippets style
* Add *Load Fps Plugin* and *Restore Settings* snippets
* Support navbar color customization
* Support range in settings panel
* Support auto scale [#32](https://github.com/liriliri/eruda/issues/32)
* Improve *Border All* snippet
* Use high resolution time for console time

## v1.2.6 (31 Aug 2017)

* Fix catch global errors

## v1.2.5 (20 Aug 2017)

* Fix cookie URI malformed
* Fix single string argument unescaped
* Update util library and dependencies
* Fix catch event listeners [#31](https://github.com/liriliri/eruda/issues/31)
* Console log scroll automatically only at bottom
* Fix unformatted html tag

## v1.2.4 (1 Jul 2017)

* Fix uncaught promise error [#29](https://github.com/liriliri/eruda/issues/23)
* Fix bad classes [#28](https://github.com/liriliri/eruda/issues/23)

## v1.2.3 (15 May 2017)

* Disable modernizr classes
* Update eustia util
* Fix console resize [#23](https://github.com/liriliri/eruda/issues/23)
* Improve object log
* Use outline for borderAll snippet

## v1.2.2 (11 Mar 2017)

* Fix log url recognition
* Fix error log stack url and style
* Fix table log ouput
* Fix storage initialization [#20](https://github.com/liriliri/eruda/issues/20)
* Update eustia lib
* Elements auto refresh
* Add pc scrollbar style