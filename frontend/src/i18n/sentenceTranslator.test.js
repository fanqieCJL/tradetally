import { describe, expect, it } from 'vitest'
import { translateSentenceToZh } from './sentenceTranslator'

describe('sentenceTranslator', () => {
  it('translates exact sentence', () => {
    expect(translateSentenceToZh('All Time')).toBe('全部时间')
  })

  it('translates template sentence', () => {
    expect(translateSentenceToZh('Delete 3 trades')).toBe('删除 3 笔交易')
  })

  it('translates context sentence', () => {
    expect(translateSentenceToZh('All Strategies', { context: 'trades' })).toBe('全部策略')
  })

  it('translates hold time filter labels', () => {
    expect(translateSentenceToZh('All')).toBe('全部')
    expect(translateSentenceToZh('1-5 min')).toBe('1-5 分钟')
    expect(translateSentenceToZh('1-2 hours')).toBe('1-2 小时')
    expect(translateSentenceToZh('1+ months')).toBe('1+ 个月')
  })

  it('keeps original sentence when not matched', () => {
    expect(translateSentenceToZh('Unmapped sentence')).toBe('Unmapped sentence')
  })
})
