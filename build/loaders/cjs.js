// @ts-check

/** @param {string} src */
module.exports = (src) => {
  /** @type {Set<string>} */
  const defaultImports = new Set()

  let text = src
    .replace(
      'Object.defineProperty(exports, "__esModule", { value: true });',
      ''
    )
    .replace(
      /var (\w+) = __importStar\(require\("([\w-$./]+)"\)\);/g,
      'import $1 from "$2";'
    )
    .replace(
      /var (\w+) = __importDefault\(require\("([\w-$./]+)"\)\);/g,
      (_, local, remote) => {
        defaultImports.add(local)
        return `import ${local} from "${remote}";`
      }
    )

  defaultImports.forEach((local) => {
    text = text.replaceAll(`${local}.default`, local)
  })

  const result = text
    .replace(
      /var (\w+) = require\("([\w/.]+)"\);/g,
      'import * as $1 from "$2";'
    )
    // luna shenanigans
    .replace(/module\.exports = \w+;/, '')
    .replace(/module\.exports\.default = \w+;/, '')
    .replace(/module\.exports = \(0, extend[^)]+\)\(\w+, exports\);/g, '')
    // rest
    .replace(/exports\.default = /, 'export default ')
    .replace(/(exports\.\w+ = )+void 0;?/g, '')
    .replace(/exports\.(\w+) = \1;/g, 'export { $1 };')
    .replace(/\nexports\.(\w+) = (.+)\.default;/g, '\nexport const $1 = $2;')
    .replace(/\nexports\.(\w+) = (.+);/g, '\nexport const $1 = $2;')

  if (result.includes('var Log = ')) {
    require('fs').writeFileSync('/Users/aet/Git/eruda-base/test.js', result)
  }

  return result
}
