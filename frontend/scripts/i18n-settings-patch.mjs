/**
 * One-off helper: wrap SettingsView.vue static UI strings with s().
 * Run from frontend/: node scripts/i18n-settings-patch.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { settingsZhCN } from '../src/i18n/settings.zh-CN.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, '../src/views/SettingsView.vue')
let content = fs.readFileSync(filePath, 'utf8')

// Keys longest-first to avoid partial matches
const keys = Object.keys(settingsZhCN).sort((a, b) => b.length - a.length)

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let count = 0
for (const key of keys) {
  if (key.includes('{') || key.includes('}')) continue
  const escaped = escapeRegex(key)

  // >Text<  (same line, no nested tags)
  const re1 = new RegExp(`>(\\s*)${escaped}(\\s*)<`, 'g')
  const before1 = content
  content = content.replace(re1, (m, pre, post) => {
    if (m.includes('s(') || m.includes('{{')) return m
    count++
    return `>${pre}{{ s('${key.replace(/'/g, "\\'")}') }}${post}<`
  })

  // label text on its own line between tags (multiline label)
  const re2 = new RegExp(
    `(<label[^>]*>\\s*)${escaped}(\\s*</label>)`,
    'g'
  )
  content = content.replace(re2, (m, open, close) => {
    if (m.includes('s(')) return m
    count++
    return `${open}{{ s('${key.replace(/'/g, "\\'")}') }}${close}`
  })

  // option text
  const re3 = new RegExp(
    `(<option[^>]*>\\s*)${escaped}(\\s*</option>)`,
    'g'
  )
  content = content.replace(re3, (m, open, close) => {
    if (m.includes('s(')) return m
    count++
    return `${open}{{ s('${key.replace(/'/g, "\\'")}') }}${close}`
  })
}

fs.writeFileSync(filePath, content)
console.log(`Patched ${count} template occurrences in SettingsView.vue`)
