import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useChat } from '../context/ChatContext.jsx'
import { decryptText } from '../lib/crypto.js'
import { useCommunity } from '../context/CommunityContext.jsx'
import { formatCount } from '../data/communities.js'

function formatWhen(ts) {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  const y = new Date(now)
  y.setDate(now.getDate() - 1)
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

function Preview({ msg }) {
  const [text, setText] = useState('')

  useEffect(() => {
    let alive = true
    if (!msg) return
    if (msg.kind === 'text' && msg.enc) {
      decryptText(msg.enc).then((t) => alive && setText(t))
    } else if (msg.kind === 'image') {
      setText('📷 Photo')
    } else if (msg.kind === 'voice') {
      setText('🎤 Voice message')
    } else if (msg.kind === 'file') {
      setText(`📎 ${msg.media?.name || 'File'}`)
    }
    return () => {
      alive = false
    }
  }, [msg])

  if (!msg) return <small>No messages yet</small>
  return (
    <small>
      {msg.dir === 'out' ? 'You: ' : ''}
      {text || '…'}
    </small>
  )
}

function GroupAvatar({ thread }) {
  const members = thread.members || []
  if (!members.length) {
    return (
      <span className="avatar">
        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
          groups
        </span>
      </span>
    )
  }
  return (
    <span className="group-avatar" aria-hidden="true">
      {members.slice(0, 3).map((m, i) => (
        <span key={`${m}-${i}`} className="ga-dot">
          {m}
        </span>
      ))}
    </span>
  )
}

const TABS = [
  { id: 'chats', label: 'Chats', icon: 'chat_bubble' },
  { id: 'groups', label: 'Groups', icon: 'groups' },
  { id: 'communities', label: 'Communities', icon: 'diversity_3' },
]

function ThreadRow({ thread: t, group, onOpen }) {
  const last = t.messages[t.messages.length - 1]
  return (
    <div
      className={`chat-item${group ? ' group-item' : ''}`}
      onClick={() => onOpen(t.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(t.id)
        }
      }}
    >
      {group ? (
        <GroupAvatar thread={t} />
      ) : (
        <span className="avatar">
          {t.initials}
          {t.online && <span className="presence online" />}
        </span>
      )}
      <div className="info">
        <strong>{t.name}</strong>
        <Preview msg={last} />
      </div>
      <div className="side">
        <small>
          {group && t.memberCount
            ? `${formatCount(t.memberCount)} members`
            : last
              ? formatWhen(last.ts)
              : ''}
        </small>
        {t.unread > 0 && (
          <div>
            <span className="badge">{t.unread}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Messages() {
  const { threads } = useChat()
  const { communities, membership, countFor } = useCommunity()
  const navigate = useNavigate()
  const [tab, setTab] = useState('chats')
  const [query, setQuery] = useState('')

  const chats = threads.filter((t) => !t.isGroup)
  const groups = threads.filter((t) => t.isGroup)

  const chatUnread = chats.reduce((n, t) => n + (t.unread || 0), 0)
  const groupUnread = groups.reduce((n, t) => n + (t.unread || 0), 0)

  const q = query.trim().toLowerCase()

  const visibleChats = chats.filter((t) => t.name.toLowerCase().includes(q))
  const visibleGroups = groups.filter((t) => t.name.toLowerCase().includes(q))
  const visibleCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q),
  )

  const counts = { chats: chatUnread, groups: groupUnread, communities: 0 }

  const placeholder =
    tab === 'chats'
      ? 'Search chats…'
      : tab === 'groups'
        ? 'Search groups…'
        : 'Search communities…'

  function openThread(id) {
    navigate(`/messages/${id}`)
  }

  return (
    <>
      <header className="top-bar">
        <span className="avatar">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            chat_bubble
          </span>
        </span>
        <div className="greeting">
          <small>Real-time · E2EE</small>
          <strong>Messages</strong>
        </div>
      </header>

      <div className="msg-tabs" role="tablist" aria-label="Message sections">
        {TABS.map((opt) => (
          <button
            key={opt.id}
            role="tab"
            aria-selected={tab === opt.id}
            aria-controls={`msg-panel-${opt.id}`}
            id={`msg-tab-${opt.id}`}
            className={`msg-tab${tab === opt.id ? ' on' : ''}`}
            onClick={() => {
              setTab(opt.id)
              setQuery('')
            }}
          >
            <span className="material-symbols-outlined">{opt.icon}</span>
            <span className="msg-tab-label">{opt.label}</span>
            {counts[opt.id] > 0 && (
              <span className="msg-tab-count">{counts[opt.id]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="chat-search-wrap">
        <span className="material-symbols-outlined">search</span>
        <input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div
        className="msg-panel"
        key={tab}
        role="tabpanel"
        id={`msg-panel-${tab}`}
        aria-labelledby={`msg-tab-${tab}`}
      >
        {tab === 'chats' && (
          <>
            <div className="msg-section-head">
              <h2>Direct messages</h2>
              <span>
                {chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}
              </span>
            </div>

            {visibleChats.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">forum</span>
                <h3>No chats found</h3>
                <p>Ask a pharmacist from any pharmacy to start a conversation.</p>
              </div>
            ) : (
              visibleChats.map((t) => (
                <ThreadRow key={t.id} thread={t} onOpen={openThread} />
              ))
            )}
          </>
        )}

        {tab === 'groups' && (
          <>
            <div className="msg-section-head">
              <h2>Your groups</h2>
              <span>
                {groups.length} {groups.length === 1 ? 'group' : 'groups'}
              </span>
            </div>

            {visibleGroups.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">groups</span>
                <h3>No groups found</h3>
                <p>
                  Join a health group to chat with people who understand your
                  journey.
                </p>
              </div>
            ) : (
              visibleGroups.map((t) => (
                <ThreadRow key={t.id} thread={t} group onOpen={openThread} />
              ))
            )}
          </>
        )}

        {tab === 'communities' && (
          <>
            <div className="msg-section-head">
              <h2>Discover communities</h2>
              <span>{communities.length} to explore</span>
            </div>

            {visibleCommunities.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">diversity_3</span>
                <h3>No communities found</h3>
                <p>Try a different search, or explore all health communities.</p>
              </div>
            ) : (
              <div className="cm-list">
                {visibleCommunities.map((c) => (
                  <Link
                    key={c.id}
                    to={`/community/${c.id}`}
                    className="cm-card"
                    aria-label={`Open ${c.name}`}
                  >
                    <span className={`cm-icon tone-${c.tone}`}>
                      <span className="material-symbols-outlined">{c.icon}</span>
                    </span>
                    <span className="cm-body">
                      <span className="cm-title">
                        <strong>{c.name}</strong>
                        {membership[c.id] && (
                          <span className="pill pill-success">Joined</span>
                        )}
                      </span>
                      <small className="cm-desc">{c.desc}</small>
                      <span className="cm-meta">
                        <span className="material-symbols-outlined">group</span>
                        {formatCount(c.members)} members
                        <span className="cm-dot" />
                        {countFor(c.id)} posts
                      </span>
                    </span>
                    <span className="material-symbols-outlined cm-go">
                      chevron_right
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
