import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext.jsx'

const StatusContext = createContext(null)

const STORE_KEY = 'zazawi.status.v1'
const TTL = 24 * 60 * 60 * 1000

export const STATUS_BACKGROUNDS = [
  { id: 'ocean', label: 'Ocean' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'forest', label: 'Forest' },
  { id: 'berry', label: 'Berry' },
  { id: 'slate', label: 'Slate' },
  { id: 'sand', label: 'Sand' },
]

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function minutesAgo(n) {
  return Date.now() - n * 60 * 1000
}

const SEED = [
  {
    userId: 'st-nour',
    name: 'Nour A.',
    initials: 'NA',
    tone: 'teal',
    viewed: false,
    items: [
      {
        id: 'st-nour-1',
        kind: 'text',
        text: 'Hydration check! 💧 Aim for 8 glasses today.',
        bg: 'sunset',
        ts: minutesAgo(35),
      },
      {
        id: 'st-nour-2',
        kind: 'text',
        text: 'Fresh mint tea is underrated.',
        bg: 'forest',
        ts: minutesAgo(22),
      },
    ],
  },
  {
    userId: 'st-amal',
    name: 'Dr. Amal',
    initials: 'DA',
    tone: 'indigo',
    viewed: true,
    items: [
      {
        id: 'st-amal-1',
        kind: 'text',
        text: 'Free blood pressure checks at CarePoint until 6 PM today.',
        bg: 'ocean',
        ts: minutesAgo(90),
      },
    ],
  },
  {
    userId: 'st-zaid',
    name: 'Zaid K.',
    initials: 'ZK',
    tone: 'amber',
    viewed: false,
    items: [
      {
        id: 'st-zaid-1',
        kind: 'text',
        text: 'Morning walk done — 4 km before the heat.',
        bg: 'sand',
        ts: minutesAgo(180),
      },
    ],
  },
  {
    userId: 'st-hana',
    name: 'Hana S.',
    initials: 'HS',
    tone: 'rose',
    viewed: true,
    items: [
      {
        id: 'st-hana-1',
        kind: 'text',
        text: 'Newborn care thread is live in Mothers & Baby Health 👶',
        bg: 'berry',
        ts: minutesAgo(300),
      },
    ],
  },
]

function prune(list) {
  const cutoff = Date.now() - TTL
  return list
    .map((g) => ({
      ...g,
      items: Array.isArray(g.items)
        ? g.items.filter((it) => it && it.ts > cutoff)
        : [],
    }))
    .filter((g) => g.items.length > 0)
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return prune(parsed)
    }
  } catch {
    /* seed below */
  }
  return prune(SEED.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it })) })))
}

export function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return '1d ago'
}

export function StatusProvider({ children }) {
  const { user } = useAuth()
  const [groups, setGroups] = useState(loadInitial)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(groups))
    } catch {
      /* quota — in-memory only */
    }
  }, [groups])

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000)
    return () => clearInterval(t)
  }, [])

  const addStatus = useCallback((item) => {
    setGroups((prev) => {
      const others = prev.filter((g) => !g.mine)
      const mine = prev.find((g) => g.mine) || {
        userId: 'me',
        mine: true,
        tone: 'primary',
        viewed: true,
        items: [],
      }
      return [
        ...others,
        {
          ...mine,
          mine: true,
          viewed: true,
          items: [...mine.items, { id: uid(), ts: Date.now(), ...item }],
        },
      ]
    })
  }, [])

  const deleteStatus = useCallback((itemId) => {
    setGroups((prev) =>
      prev
        .map((g) =>
          g.mine
            ? { ...g, items: g.items.filter((it) => it.id !== itemId) }
            : g,
        )
        .filter((g) => g.items.length > 0),
    )
  }, [])

  const markViewed = useCallback((userId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.userId === userId && !g.viewed ? { ...g, viewed: true } : g,
      ),
    )
  }, [])

  const visible = useMemo(() => {
    /* tick keeps 24h expiry fresh without a reload */
    void tick
    const cutoff = Date.now() - TTL
    const live = groups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => it.ts > cutoff),
      }))
      .filter((g) => g.items.length > 0)

    const mine = live.find((g) => g.mine)
    const others = live.filter((g) => !g.mine)
    const displayName = user?.name || 'My status'
    const me = mine
      ? {
          ...mine,
          name: displayName,
          initials: displayName.charAt(0).toUpperCase(),
        }
      : null
    return me ? [me, ...others] : others
  }, [groups, tick, user])

  const myGroup = visible.find((g) => g.mine) || null

  return (
    <StatusContext.Provider
      value={{ groups: visible, myGroup, addStatus, deleteStatus, markViewed }}
    >
      {children}
    </StatusContext.Provider>
  )
}

export function useStatus() {
  return useContext(StatusContext)
}
