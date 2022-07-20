import Tool from '../DevTools/Tool'
import { isEmpty, $, ms, trim, each, last } from '../lib/util'
import { getFileName } from '../lib/fione'
import evalCss from '../lib/evalCss'
import chobitsu from 'chobitsu'
import style from './Network.scss'
import template from './Network.hbs'
import detail from './detail.hbs'
import requests from './requests.hbs'

export default class Network extends Tool {
  constructor() {
    super()

    this._style = evalCss(style)

    this.name = 'network'
    this._requests = {}
    this._tpl = template
    this._detailTpl = detail
    this._requestsTpl = requests
    this._detailData = {}
  }
  init($el, container) {
    super.init($el)

    this._container = container
    this._bindEvent()
    this._appendTpl()
  }
  show() {
    super.show()

    this._render()
  }
  clear() {
    this._requests = {}
    this._render()
  }
  requests() {
    const ret = []
    each(this._requests, (request) => {
      ret.push(request)
    })
    return ret
  }
  _reqWillBeSent = (params) => {
    this._requests[params.requestId] = {
      name: getFileName(params.request.url),
      url: params.request.url,
      status: 'pending',
      type: 'unknown',
      subType: 'unknown',
      size: 0,
      data: params.request.postData,
      method: params.request.method,
      startTime: params.timestamp * 1000,
      time: 0,
      resTxt: '',
      done: false,
      reqHeaders: params.request.headers || {},
      resHeaders: {},
    }
  }
  _resReceivedExtraInfo = (params) => {
    const target = this._requests[params.requestId]
    if (!target) {
      return
    }

    target.resHeaders = params.headers

    this._updateType(target)
    this._render()
  }
  _updateType(target) {
    const contentType = target.resHeaders['content-type'] || ''
    const { type, subType } = getType(contentType)
    target.type = type
    target.subType = subType
  }
  _resReceived = (params) => {
    const target = this._requests[params.requestId]
    if (!target) {
      return
    }

    const { response } = params
    const { status, headers } = response
    target.status = status
    if (status < 200 || status >= 300) {
      target.hasErr = true
    }
    if (headers) {
      target.resHeaders = headers
      this._updateType(target)
    }

    this._render()
  }
  _loadingFinished = (params) => {
    const target = this._requests[params.requestId]
    if (!target) {
      return
    }

    const time = params.timestamp * 1000
    target.time = time - target.startTime
    target.displayTime = ms(target.time)

    target.size = params.encodedDataLength
    target.done = true
    target.resTxt = chobitsu.domain('Network').getResponseBody({
      requestId: params.requestId,
    }).body

    this._render()
  }
  _bindEvent() {
    const $el = this._$el
    const container = this._container

    const self = this

    $el
      .on('click', '.eruda-request', function () {
        const id = $(this).data('id')
        const data = self._requests[id]

        if (!data.done) return

        self._showDetail(data)
      })
      .on('click', '.eruda-clear-request', () => this.clear())
      .on('click', '.eruda-back', () => this._hideDetail())
      .on('click', '.eruda-http .eruda-response', () => {
        const data = this._detailData
        const resTxt = data.resTxt

        switch (data.subType) {
          case 'css':
            return showSources('css', resTxt)
          case 'html':
            return showSources('html', resTxt)
          case 'javascript':
            return showSources('js', resTxt)
          case 'json':
            return showSources('object', resTxt)
        }
        switch (data.type) {
          case 'image':
            return showSources('img', data.url)
        }
      })

    function showSources(type, data) {
      const sources = container.get('sources')
      if (!sources) return

      sources.set(type, data)

      container.showTool('sources')
    }

    chobitsu.domain('Network').enable()

    const network = chobitsu.domain('Network')
    network.on('requestWillBeSent', this._reqWillBeSent)
    network.on('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.on('responseReceived', this._resReceived)
    network.on('loadingFinished', this._loadingFinished)
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)

    const network = chobitsu.domain('Network')
    network.off('requestWillBeSent', this._reqWillBeSent)
    network.off('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.off('responseReceived', this._resReceived)
    network.off('loadingFinished', this._loadingFinished)
  }
  _showDetail(data) {
    if (data.resTxt && trim(data.resTxt) === '') {
      delete data.resTxt
    }
    if (isEmpty(data.resHeaders)) {
      delete data.resHeaders
    }
    if (isEmpty(data.reqHeaders)) {
      delete data.reqHeaders
    }
    this._$detail.html(this._detailTpl(data)).show()
    this._detailData = data
  }
  _hideDetail() {
    this._$detail.hide()
  }
  _appendTpl() {
    const $el = this._$el
    $el.html(this._tpl())
    this._$detail = $el.find('.eruda-detail')
    this._$requests = $el.find('.eruda-requests')
  }
  _render() {
    if (!this.active) return

    const renderData = {}

    if (!isEmpty(this._requests)) renderData.requests = this._requests

    this._renderHtml(this._requestsTpl(renderData))
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$requests.html(html)
  }
}

function getType(contentType) {
  if (!contentType) return 'unknown'

  const type = contentType.split(';')[0].split('/')

  return {
    type: type[0],
    subType: last(type),
  }
}
