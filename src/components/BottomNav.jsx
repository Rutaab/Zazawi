import { NavLink } from 'react-router-dom'
import FabMenu from './FabMenu.jsx'

const ITEMS = [
  { to: '/dashboard', icon: 'home', label: 'Home' },
  { to: '/messages', icon: 'chat_bubble', label: 'Messages' },
  { to: '/community', icon: 'diversity_3', label: 'Communities' },
  { to: '/profile', icon: 'person', label: 'Profile' },
]

export default function BottomNav({ fabOpen, setFabOpen }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {ITEMS.slice(0, 2).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          onClick={() => setFabOpen(false)}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      <div className="nav-fab-slot" data-fab-zone>
        {fabOpen && (
          <FabMenu variant="mobile" onPick={() => setFabOpen(false)} />
        )}
        <button
          className={`fab fab-mobile${fabOpen ? ' open' : ''}`}
          aria-label={fabOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={fabOpen}
          onClick={() => setFabOpen((v) => !v)}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {ITEMS.slice(2).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          onClick={() => setFabOpen(false)}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
