/**
 * Patch UserManagementView.vue template strings with s().
 * Run: node scripts/patch-user-management-i18n.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { userManagementZhCN } from '../src/i18n/user-management.zh-CN.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, '../src/views/admin/UserManagementView.vue')
let content = fs.readFileSync(filePath, 'utf8')

const keys = Object.keys(userManagementZhCN)
  .filter((k) => !k.includes('{') && k.length < 80)
  .sort((a, b) => b.length - a.length)

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let count = 0
for (const key of keys) {
  const escaped = escapeRegex(key)
  const re = new RegExp(`>(\\s*)${escaped}(\\s*)<`, 'g')
  content = content.replace(re, (m, pre, post) => {
    if (m.includes('s(') || m.includes('{{')) return m
    count++
    return `>${pre}{{ s('${key.replace(/'/g, "\\'")}') }}${post}<`
  })
}

fs.writeFileSync(filePath, content)
console.log(`Patched ${count} occurrences`)
