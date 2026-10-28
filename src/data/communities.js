export const COMMUNITIES = [
  {
    id: 'cm-diabetes',
    name: 'Diabetes Care Circle',
    desc: 'Share glucose logs, meal ideas and insulin tips with people managing diabetes.',
    members: 5400,
    posts: 312,
    icon: 'favorite',
    tone: 'teal',
    tag: 'Chronic care',
    joined: true,
  },
  {
    id: 'cm-mothers',
    name: 'Mothers & Baby Health',
    desc: 'Pregnancy, breastfeeding and newborn questions answered by pharmacists.',
    members: 3200,
    posts: 208,
    icon: 'child_care',
    tone: 'amber',
    tag: 'Family',
    joined: false,
  },
  {
    id: 'cm-vaccines',
    name: 'Vaccination & Immunity',
    desc: 'Seasonal shots, travel vaccines and immunity questions, all in one place.',
    members: 2100,
    posts: 156,
    icon: 'vaccines',
    tone: 'indigo',
    tag: 'Prevention',
    joined: false,
  },
  {
    id: 'cm-nutrition',
    name: 'Nutrition & Wellness',
    desc: 'Everyday nutrition, supplements and healthy habits that actually stick.',
    members: 7800,
    posts: 421,
    icon: 'nutrition',
    tone: 'green',
    tag: 'Wellness',
    joined: true,
  },
  {
    id: 'cm-mind',
    name: 'Mental Wellbeing',
    desc: 'A kind, moderated space to talk about stress, sleep and mental health.',
    members: 1600,
    posts: 98,
    icon: 'self_improvement',
    tone: 'purple',
    tag: 'Wellbeing',
    joined: false,
  },
  {
    id: 'cm-firstaid',
    name: 'First Aid & Safety',
    desc: 'Practical first-aid guidance and safety tips for home and travel.',
    members: 940,
    posts: 64,
    icon: 'health_and_safety',
    tone: 'red',
    tag: 'Safety',
    joined: false,
  },
  {
    id: 'cm-reviews',
    name: 'Pharmacy Reviews',
    desc: 'Real experiences with pharmacies near you — service, wait times and stock.',
    members: 4100,
    posts: 187,
    icon: 'star_rate',
    tone: 'teal',
    tag: 'Reviews',
    joined: true,
  },
]

export function formatCount(n) {
  if (n >= 1000) {
    const v = n / 1000
    return `${v % 1 === 0 ? v : v.toFixed(1)}k`
  }
  return String(n)
}

export function getCommunity(id) {
  return COMMUNITIES.find((c) => c.id === id) || null
}
