import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../context/ChatContext.jsx'

function formatWhen(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(ts).toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
  })
}

export default function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead } =
    useChat()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const navigate = useNavigate()

  const unread = notifications.filter((n) => !n.read).length
  const badge = unread > 9 ? '9+' : unread > 0 ? String(unread) : null

  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function openNotification(n) {
    markNotificationRead(n.id)
    setOpen(false)
    navigate(`/messages/${n.threadId}`)
  }

  return (
    <div className="notif-wrap" ref={wrapRef}>
      <button
        className="icon-btn"
        aria-label={
          unread > 0 ? `Notifications (${unread} unread)` : 'Notifications'
        }
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`material-symbols-outlined${unread ? ' filled' : ''}`}>
          {unread ? 'notifications' : 'notifications'}
        </span>
        {badge && <span className="notif-badge">{badge}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-head">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button onClick={markAllNotificationsRead}>Mark all read</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="notif-empty">
              <span className="material-symbols-outlined">notifications_off</span>
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="notif-list">
              {notifications.slice(0, 15).map((n) => (
                <button
                  key={n.id}
                  className={`notif-item${n.read ? '' : ' unread'}`}
                  onClick={() => openNotification(n)}
                >
                  <span className="notif-avatar">{n.initials}</span>
                  <span className="notif-body">
                    <span className="notif-name">{n.name}</span>
                    <span className="notif-preview">{n.preview}</span>
                  </span>
                  <span className="notif-side">
                    <small>{formatWhen(n.ts)}</small>
                    {!n.read && <span className="notif-dot" />}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
