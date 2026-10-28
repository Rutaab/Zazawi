import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar.jsx'
import StatusComposer from '../components/StatusComposer.jsx'
import StatusViewer from '../components/StatusViewer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCommunity } from '../context/CommunityContext.jsx'

function formatShort(n) {
  if (n >= 1000) {
    const v = n / 1000
    return `${v % 1 === 0 ? v : v.toFixed(1)}k`
  }
  return String(n)
}

function CommunityCard({
  community: c,
  joined,
  postCount,
  onToggleJoin,
  onOpen,
}) {
  return (
    <div
      className={`cm-card${joined ? ' joined' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Open ${c.name}`}
      onClick={() => onOpen(c.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(c.id)
        }
      }}
    >
      <span className={`cm-icon tone-${c.tone}`}>
        <span className="material-symbols-outlined">{c.icon}</span>
      </span>
      <span className="cm-body">
        <span className="cm-title">
          <strong>{c.name}</strong>
          {joined && <span className="pill pill-success">Joined</span>}
        </span>
        <small className="cm-desc">{c.desc}</small>
        <span className="cm-meta">
          <span className="material-symbols-outlined">group</span>
          {formatShort(c.members)} members
          <span className="cm-dot" />
          {postCount} posts
        </span>
      </span>
      <button
        className={`cm-join${joined ? ' joined' : ''}`}
        aria-pressed={joined}
        onClick={(e) => {
          e.stopPropagation()
          onToggleJoin(c.id)
        }}
      >
        {joined ? 'Joined' : 'Join'}
      </button>
    </div>
  )
}

export default function CommunityList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { communities, membership, toggleJoin, countFor } = useCommunity()
  const [query, setQuery] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [viewerId, setViewerId] = useState(null)

  const q = query.trim().toLowerCase()
  const visible = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q),
  )

  const mine = visible.filter((c) => membership[c.id])
  const explore = visible.filter((c) => !membership[c.id])

  const open = (id) => navigate(`/community/${id}`)

  return (
    <>
      <header className="top-bar">
        <span className="avatar">
          {user ? user.name.charAt(0).toUpperCase() : 'G'}
        </span>
        <div className="greeting">
          <small>Pharmacy social</small>
          <strong>Communities</strong>
        </div>
      </header>

      <StatusBar
        onAdd={() => setComposerOpen(true)}
        onOpen={(id) => setViewerId(id)}
      />

      <div className="chat-search-wrap">
        <span className="material-symbols-outlined">search</span>
        <input
          type="search"
          placeholder="Search communities…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {visible.length === 0 && (
        <div className="empty-state">
          <span className="material-symbols-outlined">diversity_3</span>
          <h3>No communities found</h3>
          <p>Try a different search, or explore all health communities.</p>
        </div>
      )}

      {mine.length > 0 && (
        <section className="cm-section">
          <div className="cm-section-head">
            <h2>Your communities</h2>
            <span>
              {mine.length} joined
            </span>
          </div>
          <div className="cm-list">
            {mine.map((c) => (
              <CommunityCard
                key={c.id}
                community={c}
                joined
                postCount={countFor(c.id)}
                onToggleJoin={toggleJoin}
                onOpen={open}
              />
            ))}
          </div>
        </section>
      )}

      {explore.length > 0 && (
        <section className="cm-section">
          <div className="cm-section-head">
            <h2>Discover communities</h2>
            <span>{explore.length} to explore</span>
          </div>
          <div className="cm-list">
            {explore.map((c) => (
              <CommunityCard
                key={c.id}
                community={c}
                joined={false}
                postCount={countFor(c.id)}
                onToggleJoin={toggleJoin}
                onOpen={open}
              />
            ))}
          </div>
        </section>
      )}

      {composerOpen && (
        <StatusComposer
          onClose={() => setComposerOpen(false)}
          onShared={() => {
            setComposerOpen(false)
            setViewerId('me')
          }}
        />
      )}

      {viewerId && (
        <StatusViewer
          initialUserId={viewerId}
          onClose={() => setViewerId(null)}
        />
      )}
    </>
  )
}
