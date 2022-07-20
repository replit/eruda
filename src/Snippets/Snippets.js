import Tool from '../DevTools/Tool'
import defSnippets from './defSnippets'
import { $, each } from '../lib/util'
import evalCss from '../lib/evalCss'

import style from './Snippets.scss'
import template from './Snippets.hbs'

export default class Snippets extends Tool {
  constructor() {
    super()

    this._style = evalCss(style)

    this.name = 'snippets'

    this._snippets = []
    this._tpl = template
  }
  init($el) {
    super.init($el)

    this._bindEvent()
    this._addDefSnippets()
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
  }
  add(name, fn, desc) {
    this._snippets.push({ name, fn, desc })

    this._render()

    return this
  }
  remove(name) {
    const snippets = this._snippets

    for (let i = 0, len = snippets.length; i < len; i++) {
      if (snippets[i].name === name) snippets.splice(i, 1)
    }

    this._render()

    return this
  }
  run(name) {
    const snippets = this._snippets

    for (let i = 0, len = snippets.length; i < len; i++) {
      if (snippets[i].name === name) this._run(i)
    }

    return this
  }
  clear() {
    this._snippets = []
    this._render()

    return this
  }
  _bindEvent() {
    const self = this

    this._$el.on('click', '.eruda-run', function () {
      const idx = $(this).data('idx')

      self._run(idx)
    })
  }
  _run(idx) {
    this._snippets[idx].fn.call(null)
  }
  _addDefSnippets() {
    each(defSnippets, (snippet) => {
      this.add(snippet.name, snippet.fn, snippet.desc)
    })
  }
  _render() {
    this._renderHtml(
      this._tpl({
        snippets: this._snippets,
      })
    )
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$el.html(html)
  }
}
