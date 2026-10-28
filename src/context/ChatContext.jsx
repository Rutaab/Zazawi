import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { encryptText } from '../lib/crypto.js'

const ChatContext = createContext(null)

const STORE_KEY = 'zazawi.chat.v1'

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

const SEED = [
  {
    id: 'c1',
    name: 'Dr. Amal — CarePoint Pharmacy',
    role: 'Pharmacist',
    initials: 'DA',
    online: true,
    unread: 0,
    seedMessages: [
      {
        dir: 'in',
        text: 'Hello! This is Dr. Amal from CarePoint Pharmacy. How can I help you today?',
        ts: daysAgo(1, 9),
        status: 'read',
      },
      {
        dir: 'out',
        text: 'Hi! I placed an order earlier — is it ready?',
        ts: daysAgo(1, 9),
        status: 'read',
      },
      {
        dir: 'in',
        text: 'Yes! Your prescription is ready for pickup at the counter. Just show your pickup QR when you arrive.',
        ts: daysAgo(0, 10),
        status: 'read',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Zazawi Support',
    role: 'Customer care',
    initials: 'ZS',
    online: true,
    unread: 1,
    seedMessages: [
      {
        dir: 'in',
        text: 'Welcome to Zazawi! 🎉 Message us any time — we usually reply within a few minutes.',
        ts: daysAgo(2, 14),
        status: 'read',
      },
      {
        dir: 'out',
        text: 'Thanks! Can I change the pharmacy on my active order?',
        ts: daysAgo(2, 14),
        status: 'read',
      },
      {
        dir: 'in',
        text: 'Absolutely — open the order from the Orders tab and tap “Reassign pharmacy”, or we can do it for you here.',
        ts: daysAgo(1, 16),
        status: 'read',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Dr. Khalid — Al-Nile Medical',
    role: 'Pharmacist',
    initials: 'DK',
    online: false,
    unread: 0,
    seedMessages: [
      {
        dir: 'in',
        text: 'About the Amoxicillin you ordered: take one capsule three times daily after meals.',
        ts: daysAgo(5, 11),
        status: 'read',
      },
      {
        dir: 'out',
        text: 'Got it, thank you doctor.',
        ts: daysAgo(5, 11),
        status: 'read',
      },
    ],
  },
]

const GROUPS = [
  {
    id: 'g1',
    name: 'Diabetes Support Circle',
    role: 'Group',
    initials: 'DS',
    online: false,
    isGroup: true,
    memberCount: 248,
    members: ['NA', 'DA', 'ZK'],
    unread: 3,
    seedMessages: [
      {
        dir: 'in',
        text: 'Dr. Amal: Morning everyone — remember to log your fasting readings before breakfast.',
        ts: daysAgo(0, 7),
        status: 'read',
      },
      {
        dir: 'out',
        text: 'Nour: Done ✅ 5.4 this morning.',
        ts: daysAgo(0, 7),
        status: 'read',
      },
      {
        dir: 'in',
        text: 'Dr. Amal: Great numbers! Keep hydrated in this heat and bring your log to the next check-up.',
        ts: daysAgo(0, 8),
        status: 'read',
      },
    ],
  },
  {
    id: 'g2',
    name: 'New Moms — Pharmacy Q&A',
    role: 'Group',
    initials: 'NM',
    online: false,
    isGroup: true,
    memberCount: 124,
    members: ['HA', 'SA', 'LM'],
    unread: 0,
    seedMessages: [
      {
        dir: 'in',
        text: 'Hana: Is paracetamol safe while breastfeeding?',
        ts: daysAgo(2, 10),
        status: 'read',
      },
      {
        dir: 'in',
        text: 'Dr. Amal: Yes, at the standard dose it is considered safe. Avoid combination cold products that contain pseudoephedrine.',
        ts: daysAgo(2, 10),
        status: 'read',
      },
      {
        dir: 'out',
        text: 'Hana: Thank you! 🙏',
        ts: daysAgo(2, 11),
        status: 'read',
      },
    ],
  },
  {
    id: 'g3',
    name: 'Asthma Care Network',
    role: 'Group',
    initials: 'AC',
    online: false,
    isGroup: true,
    memberCount: 87,
    members: ['ZK', 'OM', 'FA'],
    unread: 1,
    seedMessages: [
      {
        dir: 'in',
        text: 'Zaid: Pollen is high today — keep your reliever inhaler close.',
        ts: daysAgo(4, 9),
        status: 'read',
      },
      {
        dir: 'out',
        text: 'Omar: Good shout, mine is in my bag.',
        ts: daysAgo(4, 9),
        status: 'read',
      },
      {
        dir: 'in',
        text: 'Dr. Khalid: If you are using your reliever more than twice a week, book a review.',
        ts: daysAgo(3, 15),
        status: 'read',
      },
    ],
  },
]

const REPLIES = [
  'Thanks for your message! A pharmacist is reviewing this now.',
  'Understood. Would you like us to reserve it for pickup today?',
  'We currently have that in stock at the counter.',
  'Sure — you can collect it any time before 10 PM today.',
  'Please take it after meals, twice daily, for five days.',
  'A pharmacist will follow up with you shortly.',
]

export function ChatProvider({ children }) {
  const [threads, setThreads] = useState([])
  const [notifications, setNotifications] = useState([])
  const [typingIn, setTypingIn] = useState(null)
  const timers = useRef([])
  const threadsRef = useRef([])

  useEffect(() => {
    threadsRef.current = threads
  }, [threads])

  useEffect(() => {
    let alive = true

    async function build(seed) {
      const messages = []
      for (const m of seed.seedMessages) {
        messages.push({
          id: uid(),
          dir: m.dir,
          kind: 'text',
          enc: await encryptText(m.text),
          ts: m.ts,
          status: m.status || 'read',
          media: null,
        })
      }
      const thread = {
        id: seed.id,
        name: seed.name,
        role: seed.role,
        initials: seed.initials,
        online: seed.online,
        unread: seed.unread,
        isGroup: Boolean(seed.isGroup),
        memberCount: seed.memberCount || 0,
        members: seed.members || [],
        messages,
      }
      const lastIn = [...seed.seedMessages].reverse().find((m) => m.dir === 'in')
      const notif = lastIn
        ? {
            id: uid(),
            threadId: seed.id,
            name: seed.name,
            initials: seed.initials,
            preview: lastIn.text,
            ts: lastIn.ts,
            read: seed.unread === 0,
          }
        : null
      return { thread, notif }
    }

    async function init() {
      let baseThreads = []
      let baseNotifs = []
      let loaded = false

      try {
        const saved = localStorage.getItem(STORE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length) {
            baseThreads = parsed
            loaded = true
          } else if (
            parsed &&
            Array.isArray(parsed.threads) &&
            parsed.threads.length
          ) {
            baseThreads = parsed.threads
            baseNotifs = Array.isArray(parsed.notifications)
              ? parsed.notifications
              : []
            loaded = true
          }
        }
      } catch {
        /* seed below */
      }

      const seeds = loaded ? GROUPS : [...SEED, ...GROUPS]
      for (const seed of seeds) {
        if (baseThreads.some((t) => t.id === seed.id)) continue
        const { thread, notif } = await build(seed)
        if (!alive) return
        baseThreads.push(thread)
        if (notif) {
          if (loaded) baseNotifs.unshift(notif)
          else baseNotifs.push(notif)
        }
      }

      if (alive) {
        setThreads(baseThreads)
        setNotifications(baseNotifs)
      }
    }

    init()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (threads.length) {
      try {
        localStorage.setItem(
          STORE_KEY,
          JSON.stringify({ threads, notifications }),
        )
      } catch {
        /* quota — in-memory only */
      }
    }
  }, [threads, notifications])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const patchThread = useCallback((id, fn) => {
    setThreads((ts) => ts.map((t) => (t.id === id ? fn(t) : t)))
  }, [])

  const setStatus = useCallback(
    (threadId, msgId, status) => {
      patchThread(threadId, (t) => ({
        ...t,
        messages: t.messages.map((m) => (m.id === msgId ? { ...m, status } : m)),
      }))
    },
    [patchThread],
  )

  const scheduleReply = useCallback(
    (threadId) => {
      const t1 = setTimeout(() => setTypingIn(threadId), 1100)
      const t2 = setTimeout(async () => {
        setTypingIn(null)
        const text = REPLIES[Math.floor(Math.random() * REPLIES.length)]
        const enc = await encryptText(text)
        const thread = threadsRef.current.find((t) => t.id === threadId)
        patchThread(threadId, (t) => ({
          ...t,
          unread: t.unread + 1,
          messages: [
            ...t.messages.map((m) =>
              m.dir === 'out' ? { ...m, status: 'read' } : m,
            ),
            {
              id: uid(),
              dir: 'in',
              kind: 'text',
              enc,
              ts: Date.now(),
              status: 'read',
              media: null,
            },
          ],
        }))
        setNotifications((ns) => [
          {
            id: uid(),
            threadId,
            name: thread?.name || 'Zazawi chat',
            initials: thread?.initials || 'Z',
            preview: text,
            ts: Date.now(),
            read: false,
          },
          ...ns,
        ])
      }, 3400)
      timers.current.push(t1, t2)
    },
    [patchThread],
  )

  const pushMessage = useCallback(
    (threadId, partial) => {
      const msg = { id: uid(), ts: Date.now(), status: 'sent', media: null, ...partial }
      patchThread(threadId, (t) => ({ ...t, messages: [...t.messages, msg] }))
      const t1 = setTimeout(() => setStatus(threadId, msg.id, 'delivered'), 750)
      timers.current.push(t1)
      scheduleReply(threadId)
      return msg
    },
    [patchThread, scheduleReply, setStatus],
  )

  const sendText = useCallback(
    async (threadId, text) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const enc = await encryptText(trimmed)
      pushMessage(threadId, { dir: 'out', kind: 'text', enc })
    },
    [pushMessage],
  )

  const sendMedia = useCallback(
    (threadId, kind, media) => {
      pushMessage(threadId, { dir: 'out', kind, enc: null, media })
    },
    [pushMessage],
  )

  const sendVoice = useCallback(
    (threadId, media) => {
      pushMessage(threadId, { dir: 'out', kind: 'voice', enc: null, media })
    },
    [pushMessage],
  )

  const markRead = useCallback(
    (threadId) => {
      patchThread(threadId, (t) => (t.unread ? { ...t, unread: 0 } : t))
      setNotifications((ns) =>
        ns.some((n) => n.threadId === threadId && !n.read)
          ? ns.map((n) => (n.threadId === threadId ? { ...n, read: true } : n))
          : ns,
      )
    },
    [patchThread],
  )

  const markNotificationRead = useCallback((id) => {
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((ns) =>
      ns.every((n) => n.read) ? ns : ns.map((n) => ({ ...n, read: true })),
    )
  }, [])

  const startThread = useCallback((profile) => {
    const id = profile.id
    setThreads((ts) =>
      ts.some((t) => t.id === id)
        ? ts
        : [
            ...ts,
            {
              id,
              name: profile.name,
              role: profile.role || 'Pharmacist',
              initials:
                profile.initials ||
                profile.name
                  .replace(/[^A-Za-z ]/g, '')
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w) => w[0].toUpperCase())
                  .join(''),
              online: profile.online ?? true,
              unread: 0,
              messages: [],
            },
          ],
    )
    return id
  }, [])

  return (
    <ChatContext.Provider
      value={{
        threads,
        notifications,
        typingIn,
        sendText,
        sendMedia,
        sendVoice,
        markRead,
        markNotificationRead,
        markAllNotificationsRead,
        startThread,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext)
}
