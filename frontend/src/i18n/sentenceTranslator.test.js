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

  it('translates notifications page strings', () => {
    expect(translateSentenceToZh('Notifications')).toBe('通知')
    expect(translateSentenceToZh('Mark all read')).toBe('全部标为已读')
    expect(translateSentenceToZh('No notifications yet')).toBe('暂无通知')
  })

  it('translates notification dynamic messages', () => {
    expect(translateSentenceToZh('Delete 3')).toBe('删除 3 条')
    expect(translateSentenceToZh('Showing 1 to 20 of 45 notifications')).toBe('显示 1–20 / 共 45 条通知')
    expect(translateSentenceToZh('5 minutes ago')).toBe('5 分钟前')
    expect(translateSentenceToZh('Achievement unlocked: First Trade')).toBe('成就已解锁：First Trade')
    expect(translateSentenceToZh('AAPL has reached $150.00, which is above your target of $140.00'))
      .toBe('AAPL 已达到 $150.00，高于您设定的目标价 $140.00')
  })
})
