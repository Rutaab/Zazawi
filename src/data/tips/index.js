import { TIP_CATEGORIES } from './categories.js'
import { immunity } from './immunity.js'
import { nutrition } from './nutrition.js'
import { hydration } from './hydration.js'
import { mental } from './mental.js'
import { women } from './women.js'
import { child } from './child.js'
import { chronic } from './chronic.js'
import { fitness } from './fitness.js'
import { medication } from './medication.js'
import { skin } from './skin.js'

export { TIP_CATEGORIES }

export const HEALTH_TIPS = [
  ...immunity,
  ...nutrition,
  ...hydration,
  ...mental,
  ...women,
  ...child,
  ...chronic,
  ...fitness,
  ...medication,
  ...skin,
]

export const CATEGORY_BY_ID = Object.fromEntries(
  TIP_CATEGORIES.map((c) => [c.id, c]),
)

export function getCategory(id) {
  return CATEGORY_BY_ID[id] || null
}

export function getCategoryTips(categoryId) {
  return HEALTH_TIPS.filter((t) => t.cat === categoryId)
}

export function getTip(categoryId, slug) {
  return (
    HEALTH_TIPS.find((t) => t.cat === categoryId && t.slug === slug) || null
  )
}

export function getRelatedTips(categoryId, slug, limit = 3) {
  return getCategoryTips(categoryId)
    .filter((t) => t.slug !== slug)
    .slice(0, limit)
}

export function readTimeFor(tip) {
  const words = [
    tip.intro,
    ...tip.sections.map((s) => `${s.heading} ${s.body}`),
    ...tip.keyPoints,
    ...tip.faq.map((f) => `${f.q} ${f.a}`),
    tip.warning || '',
  ]
    .join(' ')
    .split(/\s+/).length
  return `${Math.max(2, Math.ceil(words / 200))} min read`
}
