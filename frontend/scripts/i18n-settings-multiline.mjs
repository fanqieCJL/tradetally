/**
 * Replace multiline template text blocks with s() using settings.zh-CN.js keys.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { settingsZhCN } from '../src/i18n/settings.zh-CN.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, '../src/views/SettingsView.vue')
let content = fs.readFileSync(filePath, 'utf8')

function normalizeWs(s) {
  return s.replace(/\s+/g, ' ').trim()
}

const keys = Object.keys(settingsZhCN)
  .filter((k) => k.length > 40 && !k.includes('{'))
  .sort((a, b) => b.length - a.length)

let count = 0
for (const key of keys) {
  const normKey = normalizeWs(key)
  // Match text nodes that span lines (between > and <)
  const pattern = normKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
  const re = new RegExp(`>\\s*${pattern}\\s*<`, 'gs')
  const before = content
  content = content.replace(re, () => {
    count++
    return `>{{ s('${key.replace(/'/g, "\\'")}') }}<`
  })
  if (content !== before) continue

  // Inside <p> without immediate closing tag on same line - multiline block
  const re2 = new RegExp(`(\\n\\s*)${pattern}(\\s*\\n)`, 'gs')
  content = content.replace(re2, (m, pre, post) => {
    if (m.includes('s(')) return m
    count++
    return `${pre}{{ s('${key.replace(/'/g, "\\'")}') }}${post}`
  })
}

fs.writeFileSync(filePath, content)
console.log(`Multiline patches: ${count}`)
