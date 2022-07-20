import handlebars from 'handlebars/lib/handlebars.runtime'

// https://github.com/helpers/handlebars-helper-repeat
handlebars.registerHelper('repeat', function (count = 0, options) {
  if (count < 1) return options.inverse(this)

  const step = 1
  const start = 0
  const max = count * step + start
  let index = start
  let str = ''

  do {
    const data = {
      index,
      count,
      start,
      step,
      first: index === start,
      last: index >= max - step,
    }
    const blockParams = [index, data]
    str += options.fn(this, { data, blockParams })
    index += data.step
  } while (index < max)

  return str
})

handlebars.registerHelper('class', function (value) {
  let classes = value.split(/\s+/)

  classes = classes.map((c) => `eruda-${c}`)

  return `class="${classes.join(' ')}"`
})

handlebars.registerHelper('concat', function () {
  let ret = ''

  for (let i = 0, len = arguments.length; i < len; i++) {
    const arg = arguments[i]
    if (typeof arg === 'string') ret += arg
  }

  return ret
})

export default handlebars
