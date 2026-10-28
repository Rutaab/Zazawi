import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function loadExt() {
  try {
    const raw = localStorage.getItem('zazawi.profile.ext')
    return raw ? JSON.parse(raw) : { dob: '', gender: '' }
  } catch {
    return { dob: '', gender: '' }
  }
}

export default function PersonalInformation() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const ext = loadExt()

  const [form, setForm] = useState({
    name: user?.name && user.name !== 'Guest' ? user.name : '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: ext.dob || '',
    gender: ext.gender || '',
  })
  const [saved, setSaved] = useState(false)

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }))
    setSaved(false)
  }

  function save() {
    updateProfile({
      name: form.name.trim() || 'Zazawi User',
      email: form.email.trim(),
      phone: form.phone.trim(),
    })
    try {
      localStorage.setItem(
        'zazawi.profile.ext',
        JSON.stringify({ dob: form.dob, gender: form.gender }),
      )
    } catch {
      /* ignore */
    }
    setSaved(true)
  }

  return (
    <>
      <TopBar back subtitle="Account Settings" title="Personal Information" notifications={false} />

      <div className="pf-mini-header">
        <span className="pf-avatar pf-avatar-sm">
          {(form.name || 'G').charAt(0).toUpperCase()}
        </span>
        <div>
          <strong>{form.name || 'Your profile'}</strong>
          <small>Keep your details up to date for faster orders</small>
        </div>
      </div>

      <div className="card form-card">
        <h2>Basic details</h2>
        <div className="field">
          <label>Full name</label>
          <input
            type="text"
            placeholder="e.g. Alex Johnson"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set({ email: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Phone number</label>
          <input
            type="tel"
            placeholder="0912 345 678"
            value={form.phone}
            onChange={(e) => set({ phone: e.target.value })}
          />
        </div>
      </div>

      <div className="card form-card">
        <h2>About you</h2>
        <div className="field">
          <label>Date of birth</label>
          <input
            type="date"
            value={form.dob}
            onChange={(e) => set({ dob: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Gender</label>
          <select
            value={form.gender}
            onChange={(e) => set({ gender: e.target.value })}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '0 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <button className="btn btn-primary btn-block" onClick={save}>
          <span className="material-symbols-outlined">save</span>
          Save changes
        </button>
        {saved && (
          <span className="saved-flash">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              check_circle
            </span>
            Profile updated
          </span>
        )}
      </div>
    </>
  )
}
