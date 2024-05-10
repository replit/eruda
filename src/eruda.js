import EntryBtn from './EntryBtn/EntryBtn'
import DevTools from './DevTools/DevTools'
import Tool from './DevTools/Tool'
import Dom from './Dom/Dom'
import Console from './Console/Console'
import Network from './Network/Network'
import Elements from './Elements/Elements'
import Snippets from './Snippets/Snippets'
import Resources from './Resources/Resources'
import Info from './Info/Info'
import Sources from './Sources/Sources'
import Settings from './Settings/Settings'
import emitter from './lib/emitter'
import logger from './lib/logger'
import extraUtil from './lib/extraUtil'
import * as util from './lib/util'
import {
  isFn,
  isNum,
  isObj,
  isMobile,
  viewportScale,
  detectBrowser,
  $,
  toArr,
  upperFirst,
  nextTick,
} from './lib/util'
import evalCss from './lib/evalCss'
import chobitsu from 'chobitsu'

import style from './style/style.scss'
import resetStyle from './style/reset.scss'
import iconStyle from './style/icon.css'
import lunaConsoleStyle from 'luna-console/luna-console.css'
import lunaObjectViewerStyle from 'luna-object-viewer/luna-object-viewer.css'
import lunaNotificationStyle from 'luna-notification/luna-notification.css'

export default {
  init({
    container,
    tool,
    autoScale = true,
    useShadowDom = true,
    defaults = {},
  } = {}) {
    if (this._isInit) return

    this._isInit = true
    this._scale = 1

    this._initContainer(container, useShadowDom)
    this._initStyle()
    this._initDevTools(defaults)
    this._initEntryBtn()
    this._initSettings()
    this._initTools(tool)
    this._registerListener()

    if (autoScale) this._autoScale()
  },
  _isInit: false,
  version: VERSION,
  util,
  chobitsu,
  Tool,
  Console,
  Elements,
  Network,
  Sources,
  Resources,
  Info,
  Snippets,
  Dom,
  Settings,
  get(name) {
    if (!this._checkInit()) return

    if (name === 'entryBtn') return this._entryBtn

    const devTools = this._devTools

    return name ? devTools.get(name) : devTools
  },
  add(tool) {
    if (!this._checkInit()) return

    if (isFn(tool)) tool = tool(this)

    this._devTools.add(tool)

    return this
  },
  remove(name) {
    this._devTools.remove(name)

    return this
  },
  show(name) {
    if (!this._checkInit()) return

    const devTools = this._devTools

    name ? devTools.showTool(name) : devTools.show()

    return this
  },
  hide() {
    if (!this._checkInit()) return

    this._devTools.hide()

    return this
  },
  destroy() {
    this._devTools.destroy()
    delete this._devTools
    this._entryBtn.destroy()
    delete this._entryBtn
    this._unregisterListener()
    this._$el.remove()
    evalCss.clear()
    this._isInit = false
  },
  scale(s) {
    if (isNum(s)) {
      this._scale = s
      emitter.emit(emitter.SCALE, s)
      return this
    }

    return this._scale
  },
  position(p) {
    const entryBtn = this._entryBtn

    if (isObj(p)) {
      entryBtn.setPos(p)
      return this
    }

    return entryBtn.getPos()
  },
  _autoScale() {
    if (!isMobile()) return

    this.scale(1 / viewportScale())
  },
  _registerListener() {
    this._addListener = (...args) => this.add(...args)
    this._showListener = (...args) => this.show(...args)

    emitter.on(emitter.ADD, this._addListener)
    emitter.on(emitter.SHOW, this._showListener)
    emitter.on(emitter.SCALE, evalCss.setScale)
  },
  _unregisterListener() {
    emitter.off(emitter.ADD, this._addListener)
    emitter.off(emitter.SHOW, this._showListener)
    emitter.off(emitter.SCALE, evalCss.setScale)
  },
  _checkInit() {
    if (!this._isInit) logger.error('Please call "eruda.init()" first')
    return this._isInit
  },
  _initContainer(el, useShadowDom) {
    if (!el) {
      el = document.createElement('div')
      document.documentElement.appendChild(el)
      el.style.all = 'initial'
    }

    let shadowRoot
    if (useShadowDom) {
      if (el.attachShadow) {
        shadowRoot = el.attachShadow({ mode: 'open' })
      } else if (el.createShadowRoot) {
        shadowRoot = el.createShadowRoot()
      }
      if (shadowRoot) {
        // font-face doesn't work inside shadow dom.
        evalCss.container = document.head
        evalCss(['.luna-dom-highlighter { all: initial }', iconStyle, lunaConsoleStyle, lunaObjectViewerStyle])

        el = document.createElement('div')
        shadowRoot.appendChild(el)
        this._shadowRoot = shadowRoot
      }
    }

    Object.assign(el, {
      id: 'eruda',
      className: 'eruda-container',
      contentEditable: false,
    })

    // http://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
    if (detectBrowser().name === 'ios') el.setAttribute('ontouchstart', '')

    this._$el = $(el)
  },
  _initDevTools(defaults) {
    this._devTools = new DevTools(this._$el, {
      defaults,
    })
  },
  _initStyle() {
    const className = 'eruda-style-container'
    const $el = this._$el

    if (this._shadowRoot) {
      evalCss.container = this._shadowRoot
      evalCss(':host { all: initial }')
    } else {
      $el.append(`<div class="${className}"></div>`)
      evalCss.container = $el.find(`.${className}`).get(0)
    }

    evalCss([
      lunaObjectViewerStyle,
      lunaConsoleStyle,
      lunaNotificationStyle,
      style,
      resetStyle,
      iconStyle,
    ])
  },
  _initEntryBtn() {
    this._entryBtn = new EntryBtn(this._$el)
    this._entryBtn.on('click', () => this._devTools.toggle())
  },
  _initSettings() {
    const devTools = this._devTools
    const settings = new Settings()

    devTools.add(settings)

    this._entryBtn.initCfg(settings)
    devTools.initCfg(settings)
  },
  _initTools(
    tool = [
      'console',
      'elements',
      'network',
      'resources',
      'sources',
      'info',
      'snippets',
      'dom',
    ]
  ) {
    tool = toArr(tool)

    const devTools = this._devTools

    tool.forEach((name) => {
      const Tool = this[upperFirst(name)]
      try {
        if (Tool) devTools.add(new Tool())
      } catch (e) {
        // Use nextTick to make sure it is possible to be caught by console panel.
        nextTick(() => {
          logger.error(
            `Something wrong when initializing tool ${name}:`,
            e.message
          )
        })
      }
    })

    devTools.showTool(tool[0] || 'settings')
  },
}

extraUtil(util)
