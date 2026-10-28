import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar.jsx'

const DEFAULT_ADDRESSES = [
  {
    id: 'a1',
    label: 'Home',
    line: '12 Nile Street, Block 12, Khartoum',
    phone: '0912 345 678',
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'Work',
    line: 'University Road, Omdurman',
    phone: '0918 220 114',
    isDefault: false,
  },
]

const LABEL_ICON = { Home: 'home', Work: 'work', Other: 'location_on' }

function loadAddresses() {
  try {
    const raw = localStorage.getItem('zazawi.addresses')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_ADDRESSES
}

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState(loadAddresses)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ label: 'Home', line: '', phone: '' })

  useEffect(() => {
    try {
      localStorage.setItem('zazawi.addresses', JSON.stringify(addresses))
    } catch {
      /* ignore */
    }
  }, [addresses])

  function makeDefault(id) {
    setAddresses((list) =>
      list.map((a) => ({ ...a, isDefault: a.id === id })),
    )
  }

  function remove(id) {
    setAddresses((list) => {
      const next = list.filter((a) => a.id !== id)
      if (next.length && !next.some((a) => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true }
      }
      return next
    })
  }

  function addAddress(e) {
    e.preventDefault()
    if (!form.line.trim()) return
    setAddresses((list) => [
      ...list,
      {
        id: `a${Date.now()}`,
        label: form.label,
        line: form.line.trim(),
        phone: form.phone.trim(),
        isDefault: list.length === 0,
      },
    ])
    setForm({ label: 'Home', line: '', phone: '' })
    setAdding(false)
  }

  return (
    <>
      <TopBar
        back
        subtitle="Account Settings"
        title="Saved Addresses"
        notifications={false}
      />

      <p className="addr-count">
        {addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved
      </p>

      {addresses.map((a) => (
        <div key={a.id} className="card addr-card">
          <div className="addr-head">
            <span className="pf-row-icon">
              <span className="material-symbols-outlined">
                {LABEL_ICON[a.label] || 'location_on'}
              </span>
            </span>
            <div className="addr-who">
              <strong>{a.label}</strong>
              {a.isDefault && <span className="pill pill-primary">Default</span>}
            </div>
          </div>
          <p className="addr-line">{a.line}</p>
          {a.phone && <p className="addr-phone">📞 {a.phone}</p>}
          <div className="addr-actions">
            {!a.isDefault && (
              <button className="btn btn-soft addr-btn" onClick={() => makeDefault(a.id)}>
                <span className="material-symbols-outlined">star</span>
                Set default
              </button>
            )}
            <button className="btn btn-ghost addr-btn" onClick={() => remove(a.id)}>
              <span className="material-symbols-outlined">delete</span>
              Remove
            </button>
          </div>
        </div>
      ))}

      {adding ? (
        <form className="card addr-form" onSubmit={addAddress}>
          <h2 style={{ fontSize: '1rem' }}>New address</h2>
          <div className="field">
            <label>Label</label>
            <select
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            >
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>
          </div>
          <div className="field">
            <label>Address</label>
            <textarea
              rows="2"
              placeholder="Street, block, city"
              value={form.line}
              onChange={(e) => setForm((f) => ({ ...f, line: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Phone (optional)</label>
            <input
              type="tel"
              placeholder="0912 345 678"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary btn-block">
              Save address
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={{ padding: '0.25rem 1.25rem 1.5rem' }}>
          <button className="btn btn-outline btn-block" onClick={() => setAdding(true)}>
            <span className="material-symbols-outlined">add</span>
            Add new address
          </button>
        </div>
      )}
    </>
  )
}
