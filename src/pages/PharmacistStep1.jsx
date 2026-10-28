import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PharmacistFlow from '../components/PharmacistFlow.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  isStepOneValid,
  loadDraft,
  ROLES,
  saveDraft,
} from '../data/pharmacist.js'

export default function PharmacistStep1() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const saved = loadDraft()

  const [form, setForm] = useState({
    fullName:
      saved.fullName ||
      (user?.name && user.name !== 'Guest' ? user.name : ''),
    role: saved.role,
    email: saved.email || user?.email || '',
    phone: saved.phone || user?.phone || '',
    nationalId: saved.nationalId,
    dob: saved.dob,
  })

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }))
    saveDraft(patch)
  }

  const valid = isStepOneValid(form)

  function next() {
    if (!valid) return
    saveDraft(form)
    navigate('/pharmacist/register/credentials')
  }

  return (
    <PharmacistFlow
      step={1}
      subtitle="Pharmacist verification"
      title="Professional identity"
      onBack={() => navigate('/profile')}
      onNext={next}
      nextLabel="Continue to credentials"
      nextDisabled={!valid}
      footerNote="Your details are encrypted and only reviewed by our verification team."
    >
      <div className="ph-intro card">
        <span className="icon-tile">
          <span className="material-symbols-outlined">badge</span>
        </span>
        <div>
          <strong>Why we verify you</strong>
          <p>
            A verified pharmacist badge lets you answer patient questions,
            review prescriptions and issue guidance safely. It takes about 5
            minutes.
          </p>
        </div>
      </div>

      <div className="card form-card">
        <h2>Your details</h2>

        <div className="field">
          <label>Full legal name (as on license)</label>
          <input
            type="text"
            placeholder="e.g. Dr. Sarah Ahmed"
            value={form.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Professional role</label>
          <select
            value={form.role}
            onChange={(e) => set({ role: e.target.value })}
          >
            <option value="">Select your role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="ph-two">
          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@pharmacy.com"
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

        <div className="ph-two">
          <div className="field">
            <label>Government ID / National ID</label>
            <input
              type="text"
              placeholder="e.g. 1990-1234-5678"
              value={form.nationalId}
              onChange={(e) => set({ nationalId: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Date of birth</label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => set({ dob: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="ph-tip">
        <span className="material-symbols-outlined">info</span>
        <span>
          Use your name exactly as it appears on your pharmacy license — a
          mismatch is the most common reason verification is delayed.
        </span>
      </div>
    </PharmacistFlow>
  )
}
