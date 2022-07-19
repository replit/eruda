import NavBar from './NavBar'
import logger from '../lib/logger'
import Tool from './Tool'
import Settings from '../Settings/Settings'
import {
  Emitter,
  isMobile,
  defaults,
  keys,
  last,
  each,
  isNum,
  $,
  throttle,
  isDarkMode,
  extend,
} from '../lib/util'
import evalCss from '../lib/evalCss'
import LunaNotification from 'luna-notification'

export default class DevTools extends Emitter {
  constructor($container, { defaults = {} } = {}) {
    super()

    this._defCfg = extend(
      {
        transparency: 1,
        displaySize: 80,
        theme: isDarkMode() ? 'Dark' : 'Light',
      },
      defaults
    )

    this._style = evalCss(require('./DevTools.scss'))

    this.$container = $container
    this._isShow = false
    this._opacity = 1
    this._tools = {}
    this._isResizing = false
    this._resizeTimer = null
    this._resizeStartY = 0
    this._resizeStartSize = 0

    this._appendTpl()
    this._initNavBar()
    this._initNotification()
    this._bindEvent()
  }
  show() {
    this._isShow = true

    this._$el.show()
    this._navBar.resetBottomBar()

    // Need a delay after show to enable transition effect.
    setTimeout(() => {
      this._$el.css('opacity', this._opacity)
    }, 50)

    this.emit('show')

    return this
  }
  hide() {
    this._isShow = false
    this.emit('hide')

    this._$el.css({ opacity: 0 })
    setTimeout(() => this._$el.hide(), 300)

    return this
  }
  toggle() {
    return this._isShow ? this.hide() : this.show()
  }
  add(tool) {
    if (!(tool instanceof Tool)) {
      const { init, show, hide, destroy } = new Tool()
      defaults(tool, { init, show, hide, destroy })
    }

    let name = tool.name
    if (!name) return logger.error('You must specify a name for a tool')
    name = name.toLowerCase()
    if (this._tools[name]) return logger.warn(`Tool ${name} already exists`)

    this._$tools.prepend(
      `<div id="eruda-${name}" class="eruda-${name} eruda-tool"></div>`
    )
    tool.init(this._$tools.find(`.eruda-${name}.eruda-tool`), this)
    tool.active = false
    this._tools[name] = tool

    this._navBar.add(name)

    return this
  }
  remove(name) {
    const tools = this._tools

    if (!tools[name]) return logger.warn(`Tool ${name} doesn't exist`)

    this._navBar.remove(name)

    const tool = tools[name]
    delete tools[name]
    if (tool.active) {
      const toolKeys = keys(tools)
      if (toolKeys.length > 0) this.showTool(tools[last(toolKeys)].name)
    }
    tool.destroy()

    return this
  }
  removeAll() {
    each(this._tools, (tool) => this.remove(tool.name))

    return this
  }
  get(name) {
    const tool = this._tools[name]

    if (tool) return tool
  }
  showTool(name) {
    if (this._curTool === name) return this
    this._curTool = name

    const tools = this._tools

    const tool = tools[name]
    if (!tool) return

    let lastTool = {}

    each(tools, (tool) => {
      if (tool.active) {
        lastTool = tool
        tool.active = false
        tool.hide()
      }
    })

    tool.active = true
    tool.show()

    this._navBar.activateTool(name)

    this.emit('showTool', name, lastTool)

    return this
  }
  initCfg(settings) {
    const cfg = (this.config = Settings.createCfg('dev-tools', this._defCfg))

    this._setTransparency(cfg.get('transparency'))
    this._setDisplaySize(cfg.get('displaySize'))
    evalCss.setTheme(cfg.get('theme'))

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'transparency':
          return this._setTransparency(val)
        case 'displaySize':
          return this._setDisplaySize(val)
        case 'theme':
          return evalCss.setTheme(val)
      }
    })

    settings
      .separator()
      .select(cfg, 'theme', 'Theme', keys(evalCss.getThemes()))
      .range(cfg, 'transparency', 'Transparency', {
        min: 0.2,
        max: 1,
        step: 0.01,
      })
      .range(cfg, 'displaySize', 'Display Size', {
        min: 40,
        max: 100,
        step: 1,
      })
      .separator()
  }
  notify(content, options) {
    this._notification.notify(content, options)
  }
  destroy() {
    evalCss.remove(this._style)
    this.removeAll()
    this._navBar.destroy()
    this._$el.remove()
  }
  _setTransparency(opacity) {
    if (!isNum(opacity)) return

    this._opacity = opacity
    if (this._isShow) this._$el.css({ opacity })
  }
  _setDisplaySize(height) {
    if (!isNum(height)) return

    this._$el.css({ height: height + '%' })
  }
  _appendTpl() {
    const $container = this.$container

    $container.append(require('./DevTools.hbs')())

    this._$el = $container.find('.eruda-dev-tools')
    this._$tools = this._$el.find('.eruda-tools')
  }
  _initNavBar() {
    this._navBar = new NavBar(this._$el.find('.eruda-nav-bar-container'))
    this._navBar.on('showTool', (name) => this.showTool(name))
  }
  _initNotification() {
    this._notification = new LunaNotification(
      this._$el.find('.eruda-notification').get(0),
      {
        position: {
          x: 'center',
          y: 'top',
        },
      }
    )
  }
  _bindEvent() {
    const $navBar = this._$el.find('.eruda-nav-bar')
    const startListener = (e) => {
      e = e.origEvent
      this._resizeTimer = setTimeout(() => {
        e.preventDefault()
        e.stopPropagation()
        this._isResizing = true
        this._resizeStartSize = this.config.get('displaySize')
        this._resizeStartY = getClientY(e)
        $navBar.css('filter', 'brightness(1.2)')
      }, 1000)
    }
    const setDisplaySize = throttle(
      (size) => this.config.set('displaySize', size),
      50
    )
    const moveListener = (e) => {
      if (!this._isResizing) {
        return clearTimeout(this._resizeTimer)
      }
      e.preventDefault()
      e.stopPropagation()

      e = e.origEvent
      const deltaY = Math.round(
        ((this._resizeStartY - getClientY(e)) / window.innerHeight) * 100
      )
      let displaySize = this._resizeStartSize + deltaY
      if (displaySize < 40) {
        displaySize = 40
      } else if (displaySize > 100) {
        displaySize = 100
      }
      setDisplaySize(displaySize)
    }
    const endListener = () => {
      clearTimeout(this._resizeTimer)
      this._isResizing = false
      $navBar.css('filter', 'brightness(1)')
    }
    const getClientY = (e) => {
      if (e.clientY) return e.clientY

      if (e.touches) return e.touches[0].clientY

      return 0
    }
    $navBar.on('contextmenu', (e) => e.preventDefault())
    const $root = $(document.documentElement)
    if (isMobile()) {
      $navBar.on('touchstart', startListener).on('touchmove', moveListener)
      $root.on('touchend', endListener)
    } else {
      $navBar.on('mousedown', startListener)
      $root.on('mousemove', moveListener)
      $root.on('mouseup', endListener)
    }
  }
}
