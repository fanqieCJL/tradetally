import { zhCNMap } from './sentenceMap.zh-CN'

function normalizeSentence(input) {
  return String(input || '').replace(/\s+/g, ' ').trim()
}

function translateByExact(sentence, map) {
  return map.exact[sentence] || null
}

function translateByTemplate(sentence, map) {
  for (const entry of map.templated) {
    const match = sentence.match(entry.pattern)
    if (match) {
      return entry.render(match)
    }
  }
  return null
}

function translateByContext(sentence, context, map) {
  if (!context) return null
  const scoped = map.contextual[context]
  if (!scoped) return null
  return scoped[sentence] || null
}

function translateByToken(sentence, map, enableTokenFallback) {
  if (!enableTokenFallback) return null
  let translated = sentence
  let changed = false
  for (const [token, value] of Object.entries(map.token)) {
    if (translated.includes(token)) {
      translated = translated.split(token).join(value)
      changed = true
    }
  }
  return changed ? translated : null
}

export function translateSentenceToZh(rawText, options = {}) {
  const sentence = normalizeSentence(rawText)
  if (!sentence) return rawText

  const byExact = translateByExact(sentence, zhCNMap)
  if (byExact) return byExact

  const byTemplate = translateByTemplate(sentence, zhCNMap)
  if (byTemplate) return byTemplate

  const byContext = translateByContext(sentence, options.context, zhCNMap)
  if (byContext) return byContext

  const byToken = translateByToken(sentence, zhCNMap, options.enableTokenFallback === true)
  if (byToken) return byToken

  return rawText
}

export function translateSentence(rawText, locale, options = {}) {
  if (locale !== 'zh') return rawText
  return translateSentenceToZh(rawText, options)
}
