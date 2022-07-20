import Tool from '../DevTools/Tool'
import { $, LocalStore, uniqId, each, filter, isStr, clone } from '../lib/util'
import evalCss from '../lib/evalCss'
import style from './Settings.scss'

import switchTpl from './switch.hbs'
import selectTpl from './select.hbs'
import rangeTpl from './range.hbs'
import colorTpl from './color.hbs'

export default class Settings extends Tool {
  constructor() {
    super()

    this._style = evalCss(style)

    this.name = 'settings'
    this._switchTpl = switchTpl
    this._selectTpl = selectTpl
    this._rangeTpl = rangeTpl
    this._colorTpl = colorTpl
    this._settings = []
  }
  init($el) {
    super.init($el)

    this._bindEvent()
  }
  remove(config, key) {
    if (isStr(config)) {
      this._$el.find('.eruda-text').each(function () {
        const $this = $(this)
        if ($this.text() === config) $this.remove()
      })
    } else {
      this._settings = filter(this._settings, (setting) => {
        if (setting.config === config && setting.key === key) {
          this._$el.find('#' + setting.id).remove()
          return false
        }

        return true
      })
    }

    this._cleanSeparator()

    return this
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
  }
  clear() {
    this._settings = []
    this._$el.html('')
  }
  switch(config, key, desc) {
    const id = this._genId('settings')

    this._settings.push({ config, key, id })

    this._$el.append(
      this._switchTpl({
        desc,
        key,
        id,
        val: config.get(key),
      })
    )

    return this
  }
  color(
    config,
    key,
    desc,
    colors = ['#2196f3', '#707d8b', '#f44336', '#009688', '#ffc107']
  ) {
    const id = this._genId('settings')

    this._settings.push({ config, key, id })

    this._$el.append(
      this._colorTpl({
        desc,
        colors,
        id,
        val: config.get(key),
      })
    )

    return this
  }
  select(config, key, desc, selections) {
    const id = this._genId('settings')

    this._settings.push({ config, key, id })

    this._$el.append(
      this._selectTpl({
        desc,
        selections,
        id,
        val: config.get(key),
      })
    )

    return this
  }
  range(config, key, desc, { min = 0, max = 1, step = 0.1 }) {
    const id = this._genId('settings')

    this._settings.push({ config, key, min, max, step, id })

    const val = config.get(key)

    this._$el.append(
      this._rangeTpl({
        desc,
        min,
        max,
        step,
        val,
        progress: progress(val, min, max),
        id,
      })
    )

    return this
  }
  separator() {
    this._$el.append('<div class="eruda-separator"></div>')

    return this
  }
  text(text) {
    this._$el.append(`<div class="eruda-text">${text}</div>`)

    return this
  }
  // Merge adjacent separators
  _cleanSeparator() {
    const children = clone(this._$el.get(0).children)

    function isSeparator(node) {
      return node.getAttribute('class') === 'eruda-separator'
    }

    for (let i = 0, len = children.length; i < len - 1; i++) {
      if (isSeparator(children[i]) && isSeparator(children[i + 1])) {
        $(children[i]).remove()
      }
    }
  }
  _genId() {
    return uniqId('eruda-settings')
  }
  _closeAll() {
    this._$el.find('.eruda-open').rmClass('eruda-open')
  }
  _getSetting(id) {
    let ret

    each(this._settings, (setting) => {
      if (setting.id === id) ret = setting
    })

    return ret
  }
  _bindEvent() {
    const self = this

    this._$el
      .on('click', '.eruda-checkbox', function () {
        const $input = $(this).find('input')
        const id = $input.data('id')
        const val = $input.get(0).checked

        const setting = self._getSetting(id)
        setting.config.set(setting.key, val)
      })
      .on('click', '.eruda-select .eruda-head', function () {
        const $el = $(this).parent().find('ul')
        const isOpen = $el.hasClass('eruda-open')

        self._closeAll()
        isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open')
      })
      .on('click', '.eruda-select li', function () {
        const $this = $(this)
        const $ul = $this.parent()
        const val = $this.text()
        const id = $ul.data('id')
        const setting = self._getSetting(id)

        $ul.rmClass('eruda-open')
        $ul.parent().find('.eruda-head span').text(val)

        setting.config.set(setting.key, val)
      })
      .on('click', '.eruda-range .eruda-head', function () {
        const $el = $(this).parent().find('.eruda-input-container')
        const isOpen = $el.hasClass('eruda-open')

        self._closeAll()
        isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open')
      })
      .on('change', '.eruda-range input', function () {
        const $this = $(this)
        const $container = $this.parent()
        const id = $container.data('id')
        const val = +$this.val()
        const setting = self._getSetting(id)

        setting.config.set(setting.key, val)
      })
      .on('input', '.eruda-range input', function () {
        const $this = $(this)
        const $container = $this.parent()
        const id = $container.data('id')
        const val = +$this.val()
        const setting = self._getSetting(id)
        const { min, max } = setting

        $container.parent().find('.eruda-head span').text(val)
        $container
          .find('.eruda-range-track-progress')
          .css('width', progress(val, min, max) + '%')
      })
      .on('click', '.eruda-color .eruda-head', function () {
        const $el = $(this).parent().find('ul')
        const isOpen = $el.hasClass('eruda-open')

        self._closeAll()
        isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open')
      })
      .on('click', '.eruda-color li', function () {
        const $this = $(this)
        const $ul = $this.parent()
        const val = $this.css('background-color')
        const id = $ul.data('id')
        const setting = self._getSetting(id)

        $ul.rmClass('eruda-open')
        $ul.parent().find('.eruda-head span').css('background-color', val)

        setting.config.set(setting.key, val)
      })
  }
  static createCfg(name, data) {
    return new LocalStore('eruda-' + name, data)
  }
}

const progress = (val, min, max) =>
  (((val - min) / (max - min)) * 100).toFixed(2)
