import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext.jsx'
import { COMMUNITIES } from '../data/communities.js'

const CommunityContext = createContext(null)

const STORE_KEY = 'zazawi.community.v2'

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function daysAgo(d, h = 10) {
  const t = new Date()
  t.setDate(t.getDate() - d)
  t.setHours(h, 15, 0, 0)
  return t.getTime()
}

function makePost(o) {
  return {
    id: uid(),
    likes: 0,
    liked: false,
    comments: 0,
    image: null,
    ...o,
  }
}

const SEED_POSTS = [
  makePost({
    communityId: 'cm-diabetes',
    author: 'Dr. Amal',
    initials: 'DA',
    role: 'Pharmacist',
    ts: daysAgo(0, 9),
    text: 'Tip: finish the full course of antibiotics even if you feel better sooner — stopping early can lead to resistance. 💊',
    likes: 14,
    comments: 4,
  }),
  makePost({
    communityId: 'cm-diabetes',
    author: 'Nour A.',
    initials: 'NA',
    role: 'Member',
    ts: daysAgo(2, 17),
    text: 'Logged my fasting glucose at 96 this morning after switching my evening snack. Small wins add up 🙌',
    likes: 9,
    comments: 2,
  }),
  makePost({
    communityId: 'cm-nutrition',
    author: 'Zazawi Support',
    initials: 'ZS',
    role: 'Official',
    ts: daysAgo(1, 12),
    text: 'New feature: scan a pharmacy QR code to send your prescription directly to the counter. Try it from the + menu!',
    likes: 31,
    comments: 7,
  }),
  makePost({
    communityId: 'cm-nutrition',
    author: 'Hana K.',
    initials: 'HK',
    role: 'Member',
    ts: daysAgo(3, 8),
    text: 'Swapped my afternoon soda for sparkling water with lime. Two weeks in and I snack way less in the evening.',
    likes: 22,
    comments: 5,
  }),
  makePost({
    communityId: 'cm-mothers',
    author: 'Dr. Layla',
    initials: 'DL',
    role: 'Pharmacist',
    ts: daysAgo(1, 15),
    text: 'Reminder: paracetamol is generally the first choice for fever in infants. Always dose by weight, not age. ❤️',
    likes: 40,
    comments: 12,
  }),
  makePost({
    communityId: 'cm-vaccines',
    author: 'Omar S.',
    initials: 'OS',
    role: 'Member',
    ts: daysAgo(4, 11),
    text: 'Getting my flu shot before travel next month. Does it matter how close to the trip I get it?',
    likes: 6,
    comments: 8,
  }),
  makePost({
    communityId: 'cm-mind',
    author: 'Sara M.',
    initials: 'SM',
    role: 'Member',
    ts: daysAgo(2, 20),
    text: 'Started a 10-minute wind-down routine with no screens before bed. Sleep has honestly improved.',
    likes: 18,
    comments: 6,
  }),
  makePost({
    communityId: 'cm-firstaid',
    author: 'Dr. Rami',
    initials: 'DR',
    role: 'Pharmacist',
    ts: daysAgo(5, 9),
    text: 'A basic home kit: sterile gauze, adhesive bandages, antiseptic, gloves, tweezers and a thermometer. Keep it one place.',
    likes: 27,
    comments: 3,
  }),
]

const SEED_MEMBERSHIP = COMMUNITIES.reduce((acc, c) => {
  if (c.joined) acc[c.id] = true
  return acc
}, {})

function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch {
    /* fall through */
  }
  return fallback
}

export function CommunityProvider({ children }) {
  const { user } = useAuth()

  const [posts, setPosts] = useState(() => {
    const saved = load(STORE_KEY, null)
    if (saved && Array.isArray(saved.posts) && saved.posts.length) {
      return saved.posts
    }
    return SEED_POSTS
  })

  const [membership, setMembership] = useState(() => {
    const saved = load(STORE_KEY, null)
    if (saved && saved.membership) return saved.membership
    return SEED_MEMBERSHIP
  })

  useEffect(() => {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({ posts, membership }),
      )
    } catch {
      /* quota — in-memory only */
    }
  }, [posts, membership])

  const addPost = useCallback(
    ({ communityId, text, image }) => {
      const post = {
        id: uid(),
        communityId,
        author: user?.name || 'Guest',
        initials: (user?.name || 'Guest').charAt(0).toUpperCase(),
        role: user ? 'Member' : 'Guest',
        ts: Date.now(),
        text,
        image: image || null,
        likes: 0,
        liked: false,
        comments: 0,
      }
      setPosts((p) => [post, ...p])
      return post
    },
    [user],
  )

  const toggleLike = useCallback((id) => {
    setPosts((p) =>
      p.map((x) =>
        x.id === id
          ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) }
          : x,
      ),
    )
  }, [])

  const toggleJoin = useCallback((id) => {
    setMembership((m) => ({ ...m, [id]: !m[id] }))
  }, [])

  const postsFor = useCallback(
    (communityId) =>
      posts
        .filter((p) => p.communityId === communityId)
        .sort((a, b) => b.ts - a.ts),
    [posts],
  )

  const countFor = useCallback(
    (communityId) =>
      posts.reduce((n, p) => (p.communityId === communityId ? n + 1 : n), 0),
    [posts],
  )

  const value = useMemo(
    () => ({
      posts,
      communities: COMMUNITIES,
      membership,
      addPost,
      toggleLike,
      toggleJoin,
      postsFor,
      countFor,
    }),
    [
      posts,
      membership,
      addPost,
      toggleLike,
      toggleJoin,
      postsFor,
      countFor,
    ],
  )

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  return useContext(CommunityContext)
}
