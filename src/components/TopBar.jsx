import { useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell.jsx'

export default function TopBar({ title, subtitle, back, user, notifications = true }) {
  const navigate = useNavigate()

  return (
    <header className="top-bar">
      {back ? (
        <button className="icon-btn" aria-label="Back" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      ) : (
        <span className="avatar">
          {user ? user.name.charAt(0).toUpperCase() : 'G'}
        </span>
      )}
      <div className="greeting">
        {subtitle && <small>{subtitle}</small>}
        <strong>{title}</strong>
      </div>
      {notifications && <NotificationBell />}
    </header>
  )
}
