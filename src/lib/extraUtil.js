import evalCss from './evalCss'

export default function (util) {
  Object.assign(util, {
    evalCss,
    isErudaEl,
  })
}

export function isErudaEl(el) {
  let parentNode = el.parentNode

  if (!parentNode) return false

  while (parentNode) {
    parentNode = parentNode.parentNode
    if (parentNode && parentNode.id === 'eruda') return true
  }

  return false
}
