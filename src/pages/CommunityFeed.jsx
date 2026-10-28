import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCommunity } from '../context/CommunityContext.jsx'
import { getCommunity } from '../data/communities.js'

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

function formatShort(n) {
  if (n >= 1000) {
    const v = n / 1000
    return `${v % 1 === 0 ? v : v.toFixed(1)}k`
  }
  return String(n)
}

export default function CommunityFeed() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { postsFor, toggleLike, membership, toggleJoin, countFor } =
    useCommunity()

  const community = getCommunity(id)
  if (!community) return <Navigate to="/community" replace />

  const joined = !!membership[community.id]
  const posts = postsFor(community.id)

  return (
    <>
      <TopBar
        subtitle="Community"
        title={community.name}
        back
        user={user}
        notifications={false}
      />

      <section className={`cm-hero tone-${community.tone}`}>
        <span className="cm-hero-icon material-symbols-outlined">
          {community.icon}
        </span>
        <div className="cm-hero-body">
          <span className="cm-hero-tag">{community.tag}</span>
          <h1>{community.name}</h1>
          <p>{community.desc}</p>
          <div className="cm-hero-meta">
            <span className="material-symbols-outlined">group</span>
            {formatShort(community.members)} members
            <span className="cm-dot" />
            {countFor(community.id)} posts
          </div>
        </div>
        <button
          className={`cm-join cm-join-lg${joined ? ' joined' : ''}`}
          aria-pressed={joined}
          onClick={() => toggleJoin(community.id)}
        >
          {joined ? 'Joined' : 'Join community'}
        </button>
      </section>

      {joined ? (
        <Link
          to={`/community/new?community=${community.id}`}
          className="card compose-teaser"
        >
          <span className="avatar">
            {user ? user.name.charAt(0).toUpperCase() : 'G'}
          </span>
          <span className="compose-teaser-text">
            Share something with {community.name}…
          </span>
          <span className="material-symbols-outlined">edit_note</span>
        </Link>
      ) : (
        <button
          className="card compose-teaser locked"
          onClick={() => toggleJoin(community.id)}
        >
          <span className="avatar">
            <span className="material-symbols-outlined">lock</span>
          </span>
          <span className="compose-teaser-text">
            Join {community.name} to post and reply
          </span>
          <span className="pill pill-primary">Join</span>
        </button>
      )}

      <div className="feed-head">
        <h2>Recent posts</h2>
        <span>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined">forum</span>
          <h3>No posts yet</h3>
          <p>Be the first to start the conversation in {community.name}.</p>
          <button
            className="btn btn-primary"
            onClick={() =>
              joined
                ? navigate(`/community/new?community=${community.id}`)
                : toggleJoin(community.id)
            }
          >
            {joined ? 'Write a post' : 'Join community'}
          </button>
        </div>
      ) : (
        posts.map((p) => (
          <article key={p.id} className="card post-card">
            <div className="post-head">
              <span className="avatar">{p.initials}</span>
              <div className="post-who">
                <strong>{p.author}</strong>
                <small>
                  {p.role} · {formatWhen(p.ts)}
                </small>
              </div>
            </div>
            <p className="post-text">{p.text}</p>
            {p.image && (
              <img
                className="post-img"
                src={p.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="post-actions">
              <button
                className={p.liked ? 'liked' : ''}
                onClick={() => toggleLike(p.id)}
              >
                <span className="material-symbols-outlined">
                  {p.liked ? 'thumb_up' : 'thumb_up_off_alt'}
                </span>
                {p.likes}
              </button>
              <span>
                <span className="material-symbols-outlined">
                  chat_bubble_outline
                </span>
                {p.comments}
              </span>
              <span>
                <span className="material-symbols-outlined">share</span>
              </span>
            </div>
          </article>
        ))
      )}
    </>
  )
}
