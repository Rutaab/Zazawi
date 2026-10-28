import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrder } from '../context/OrderContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Verify() {
  const navigate = useNavigate()
  const { draft, placeOrder } = useOrder()
  const { user } = useAuth()
  const [verified, setVerified] = useState(false)

  const items = draft.items.filter((i) => i.name.trim())

  function handlePlace() {
    if (user) {
      const order = placeOrder()
      navigate('/order/confirmed', { state: { orderId: order.id } })
    } else {
      navigate('/login', { state: { next: '/order/verify', pendingOrder: true } })
    }
  }

  function handleGuest() {
    const order = placeOrder()
    navigate('/order/confirmed', { state: { orderId: order.id } })
  }

  return (
    <div className="flow-page">
      <header className="flow-header">
        <button
          className="icon-btn"
          aria-label="Back"
          onClick={() => navigate('/order/manual')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>Verify Prescription</h1>
      </header>

      <div className="flow-body">
        <p className="scanner-hint" style={{ marginTop: 0 }}>
          Please check that everything below is correct before placing your
          order.
        </p>

        <div className="card verify-card">
          <div className="verify-row">
            <span className="k">Pharmacy</span>
            <span className="v">
              {draft.pharmacy?.name || 'Any available pharmacy'}
            </span>
          </div>
          <div className="verify-row">
            <span className="k">Patient</span>
            <span className="v">{draft.patient.name || 'Guest'}</span>
          </div>
          <div className="verify-row">
            <span className="k">Phone</span>
            <span className="v">{draft.patient.phone || '—'}</span>
          </div>
          <div className="verify-row">
            <span className="k">Source</span>
            <span className="v">
              {draft.source === 'qr' ? 'QR scan' : 'Manual entry'}
            </span>
          </div>
        </div>

        <div className="card verify-card">
          <h2 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            Medicines ({items.length})
          </h2>
          {items.map((item, i) => (
            <div className="med-item" key={i}>
              <span className="icon-tile">
                <span className="material-symbols-outlined">medication</span>
              </span>
              <div className="info">
                <strong>{item.name}</strong>
                <small>{item.dosage || 'As directed by pharmacist'}</small>
              </div>
              <span className="qty">×{item.qty}</span>
            </div>
          ))}
        </div>

        {draft.notes && (
          <div className="card verify-card">
            <h2 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>Notes</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-soft)', lineHeight: 1.55 }}>
              {draft.notes}
            </p>
          </div>
        )}

        <label className={`check-row${verified ? ' checked' : ''}`}>
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => setVerified(e.target.checked)}
          />
          I have verified this prescription is correct
        </label>

        {!user && (
          <div className="login-nudge">
            <span className="material-symbols-outlined">info</span>
            <span style={{ flex: 1 }}>
              You can place this order as a guest, or log in to track it across
              devices.
            </span>
            <button onClick={() => navigate('/login', { state: { next: '/order/verify', pendingOrder: true } })}>
              Log in
            </button>
          </div>
        )}
      </div>

      <div className="flow-footer">
        {!user && verified ? (
          <>
            <button className="btn btn-primary btn-block" onClick={handlePlace}>
              Sign in &amp; place order
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className="btn btn-ghost btn-block" onClick={handleGuest}>
              Continue as guest
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary btn-block"
            disabled={!verified || items.length === 0}
            onClick={handlePlace}
          >
            Place order
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  )
}
