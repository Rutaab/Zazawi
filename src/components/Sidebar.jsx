import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import FabMenu from './FabMenu.jsx'

const ITEMS = [
  { to: '/dashboard', icon: 'home', label: 'Home' },
  { to: '/messages', icon: 'chat_bubble', label: 'Messages' },
  { to: '/community', icon: 'diversity_3', label: 'Communities' },
  { to: '/profile', icon: 'person', label: 'Profile' },
]

export default function Sidebar({ fabOpen, setFabOpen }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">
          <span className="material-symbols-outlined filled">medication</span>
        </span>
        Zazawi
      </div>

      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          onClick={() => setFabOpen(false)}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      <div className="sidebar-fab-wrap" data-fab-zone>
        {fabOpen && (
          <FabMenu variant="side" onPick={() => setFabOpen(false)} />
        )}
        <button
          className={`sidebar-link sidebar-create${fabOpen ? ' active' : ''}`}
          aria-label={fabOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={fabOpen}
          onClick={() => setFabOpen((v) => !v)}
        >
          <span className="material-symbols-outlined">add</span>
          Create
        </button>
      </div>

      <button
        className="sidebar-user"
        onClick={() => navigate(user ? '/profile' : '/login')}
      >
        <span className="avatar">
          {user ? user.name.charAt(0).toUpperCase() : 'G'}
        </span>
        <span className="who">
          <strong>{user ? user.name : 'Guest'}</strong>
          <small>{user ? 'View profile' : 'Log in'}</small>
        </span>
      </button>
    </aside>
  )
}
