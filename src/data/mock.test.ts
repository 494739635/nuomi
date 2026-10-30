import { describe, expect, it } from 'vitest'
import { filterTemplates, templates } from './mock'

describe('filterTemplates', () => {
  it('filters by category and returns every item for 全部', () => {
    expect(filterTemplates(templates, '商品广告', '').map((item) => item.id)).toEqual(['t-01'])
    expect(filterTemplates(templates, '全部', '')).toHaveLength(templates.length)
  })

  it('matches title and tags without case or surrounding-space sensitivity', () => {
    expect(filterTemplates(templates, '全部', '  小红书 ').map((item) => item.id)).toEqual(['t-04'])
    expect(filterTemplates(templates, '全部', 'CLEANING')).toEqual([])
  })
})
