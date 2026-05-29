import { createI18n } from 'vue-i18n'
import { messages } from './messages'
import { translateSentence } from './sentenceTranslator'

export const LANGUAGE_STORAGE_KEY = 'language'
const DEFAULT_LOCALE = 'en'

function normalizeLocale(raw) {
  if (!raw) return DEFAULT_LOCALE
  const locale = raw.toLowerCase()
  if (locale.startsWith('zh')) return 'zh'
  if (locale.startsWith('en')) return 'en'
  return DEFAULT_LOCALE
}

function getInitialLocale() {
  const persisted = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (persisted) return normalizeLocale(persisted)
  return normalizeLocale(navigator.language)
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages
})

export function setLocale(locale) {
  const normalized = normalizeLocale(locale)
  i18n.global.locale.value = normalized
  localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized)
  document.documentElement.setAttribute('lang', normalized === 'zh' ? 'zh-CN' : 'en')
}

export function initLocale() {
  setLocale(getInitialLocale())
}

export function tSentence(rawText, options = {}) {
  return translateSentence(rawText, i18n.global.locale.value, options)
}
