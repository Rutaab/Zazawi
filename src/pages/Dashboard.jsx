import { useState } from 'react'
import { Link } from 'react-router-dom'
import NotificationBell from '../components/NotificationBell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useOrder } from '../context/OrderContext.jsx'
import { PHARMACIES, MOCK_ORDERS } from '../data/pharmacies.js'

function timeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning,'
  if (h < 17) return 'Good afternoon,'
  return 'Good evening,'
}

function isOpenNow(hours) {
  if (/24\s*hours/i.test(hours)) return true
  const m = hours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/)
  if (!m) return null
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  const start = Number(m[1]) * 60 + Number(m[2])
  const end = Number(m[3]) * 60 + Number(m[4])
  return cur >= start && cur <= end
}

function statusClass(status) {
  if (status === 'Processing') return 'pill-warning'
  if (status === 'Cancelled') return 'pill-danger'
  if (status === 'Completed' || status === 'Delivered') return 'pill-primary'
  return 'pill-success'
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function Dashboard() {
  const { user } = useAuth()
  const { orders, lastOrder } = useOrder()
  const [query, setQuery] = useState('')

  const recent = lastOrder || orders[0] || MOCK_ORDERS[0]
  const names = recent.items.map((i) => i.name)
  const orderTitle =
    names.length > 2
      ? `${names.slice(0, 2).join(' & ')} +${names.length - 2}`
      : names.join(' & ')

  const q = query.trim().toLowerCase()
  const pharmacies = PHARMACIES.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q),
  )

  const firstName = user?.name?.split(' ')[0] || 'John'

  return (
    <div className="dh">
      <header className="dh-head">
        <div className="dh-greet">
          <span>{timeGreeting()}</span>
          <h1>
            Hello, {firstName}! <span aria-hidden="true">👋</span>
          </h1>
        </div>
        <div className="dh-bell">
          <NotificationBell />
        </div>
      </header>

      <div className="dh-search">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          placeholder="Search medicine or pharmacies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <section className="dh-sec dh-tips">
        <div className="dh-sec-head">
          <h3>Health Tips &amp; Promotions</h3>
          <Link to="/tips" className="dh-link">
            See All
          </Link>
        </div>
        <div className="dh-tips-row">
          <article className="dh-tip dh-tip-primary">
            <div className="dh-tip-body">
              <p>Stay Protected</p>
              <h4>Get 20% Off on Multivitamins</h4>
            </div>
            <button className="dh-tip-btn" type="button">
              Shop Now
            </button>
            <span className="dh-blob dh-blob-br" />
          </article>
          <article className="dh-tip dh-tip-slate">
            <div className="dh-tip-body">
              <p>Health Guide</p>
              <h4>Importance of Daily Hydration</h4>
            </div>
            <button className="dh-tip-btn dh-tip-btn-ghost" type="button">
              Read More
            </button>
            <span className="dh-blob dh-blob-tr" />
          </article>
        </div>
      </section>

      <section className="dh-sec dh-orders">
        <div className="dh-sec-head">
          <h3>Recent Orders</h3>
          <Link to="/orders" className="dh-link">
            View History
          </Link>
        </div>
        <div className="dh-order-card">
          <div className="dh-order-left">
            <span className="dh-order-icon">
              <span className="material-symbols-outlined">pill</span>
            </span>
            <div className="dh-order-info">
              <p className="dh-order-title">{orderTitle}</p>
              <p className="dh-order-sub">
                Order {recent.id} • {recent.items.length} item
                {recent.items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="dh-order-right">
            <span className={`pill ${statusClass(recent.status)}`}>
              {recent.status}
            </span>
            <span className="dh-order-date">
              {formatDate(recent.placedAt)}
            </span>
          </div>
        </div>
      </section>

      <section className="dh-sec dh-nearby">
        <div className="dh-sec-head">
          <h3>Nearby Pharmacies</h3>
          <button className="dh-link" type="button">
            See on Map
          </button>
        </div>
        <div className="dh-pharm-list">
          {pharmacies.length === 0 && (
            <p className="dh-empty">No pharmacies match “{query}”.</p>
          )}
          {pharmacies.map((ph, idx) => {
            const open = isOpenNow(ph.hours)
            return (
              <div key={ph.id} className="dh-pharm">
                <div className={`dh-ph-img img-${idx % 2}`}>
                  <span className="material-symbols-outlined">
                    local_pharmacy
                  </span>
                </div>
                <div className="dh-ph-body">
                  <div className="dh-ph-top">
                    <h4>{ph.name}</h4>
                    <span className="dh-ph-rating">
                      <span className="material-symbols-outlined">star</span>
                      {ph.rating}
                    </span>
                  </div>
                  <p className="dh-ph-addr">{ph.address}</p>
                  <div className="dh-ph-meta">
                    <span
                      className={`dh-ph-status${open === false ? ' closed' : ''}`}
                    >
                      {open === false ? 'Closed' : 'Open now'}
                    </span>
                    <span className="dh-ph-dist">• {ph.distance}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
