import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PharmacistFlow from '../components/PharmacistFlow.jsx'
import {
  clearDraft,
  isStepThreeValid,
  loadDraft,
  makeReference,
  saveDraft,
  VERIFY_METHODS,
} from '../data/pharmacist.js'

function ReviewRow({ icon, label, value }) {
  return (
    <div className="ph-review-row">
      <span className="ph-review-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </span>
      <span className="ph-review-body">
        <small>{label}</small>
        <strong>{value || '—'}</strong>
      </span>
    </div>
  )
}

export default function PharmacistStep3() {
  const navigate = useNavigate()
  const saved = loadDraft()

  const [form, setForm] = useState({
    verifyMethod: saved.verifyMethod,
    declaration: saved.declaration,
    terms: saved.terms,
    consent: saved.consent,
  })
  const [ref, setRef] = useState('')

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }))
    saveDraft(patch)
  }

  const valid = isStepThreeValid(form)

  function submit() {
    if (!valid) return
    setRef(makeReference())
    clearDraft()
  }

  if (ref) {
    return (
      <div className="flow-page ph-page">
        <div className="flow-body ph-body ph-done">
          <div className="ph-done-badge">
            <span className="material-symbols-outlined">workspace_premium</span>
          </div>
          <h1>Application submitted</h1>
          <p className="ph-done-sub">
            Thanks {saved.fullName || 'there'} — your pharmacist verification is
            now pending review.
          </p>

          <div className="ph-ref card">
            <div>
              <small>Reference number</small>
              <strong>{ref}</strong>
            </div>
            <span className="pill pill-warning">
              <span className="material-symbols-outlined">pending</span>
              Pending review
            </span>
          </div>

          <div className="card form-card">
            <h2>What happens next</h2>
            <ul className="ph-timeline">
              <li>
                <span className="material-symbols-outlined">mark_email_read</span>
                <div>
                  <strong>Confirmation email</strong>
                  <small>Sent now to {saved.email || 'your inbox'}</small>
                </div>
              </li>
              <li>
                <span className="material-symbols-outlined">verified_user</span>
                <div>
                  <strong>License check</strong>
                  <small>Matched against your licensing authority (24-48h)</small>
                </div>
              </li>
              <li>
                <span className="material-symbols-outlined">task_alt</span>
                <div>
                  <strong>Verified badge</strong>
                  <small>Unlocks pharmacist tools on your account</small>
                </div>
              </li>
            </ul>
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate('/profile')}
          >
            Back to my profile
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    )
  }

  const docNames = Object.entries(saved.docs)
    .filter(([, on]) => on)
    .map(([k]) => k)

  return (
    <PharmacistFlow
      step={3}
      subtitle="Pharmacist verification"
      title="Review & submit"
      onBack={() => navigate('/pharmacist/register/credentials')}
      onNext={submit}
      nextLabel="Submit application"
      nextIcon="how_to_reg"
      nextDisabled={!valid}
      footerNote="By submitting you confirm the information is accurate and may be verified."
    >
      <div className="card ph-review-card">
        <div className="ph-review-head">
          <h2>Professional identity</h2>
          <button
            type="button"
            className="ph-edit"
            onClick={() => navigate('/pharmacist/register')}
          >
            <span className="material-symbols-outlined">edit</span>
            Edit
          </button>
        </div>
        <ReviewRow icon="person" label="Full name" value={saved.fullName} />
        <ReviewRow icon="badge" label="Role" value={saved.role} />
        <ReviewRow icon="mail" label="Email" value={saved.email} />
        <ReviewRow icon="call" label="Phone" value={saved.phone} />
        <ReviewRow icon="credit_card" label="Government ID" value={saved.nationalId} />
      </div>

      <div className="card ph-review-card">
        <div className="ph-review-head">
          <h2>License & credentials</h2>
          <button
            type="button"
            className="ph-edit"
            onClick={() => navigate('/pharmacist/register/credentials')}
          >
            <span className="material-symbols-outlined">edit</span>
            Edit
          </button>
        </div>
        <ReviewRow icon="fingerprint" label="License number" value={saved.licenseNo} />
        <ReviewRow icon="domain" label="Licensing authority" value={saved.board} />
        <ReviewRow icon="calendar_month" label="Issued" value={saved.issueDate} />
        <ReviewRow icon="event" label="Expires" value={saved.expiryDate} />
        <ReviewRow icon="storefront" label="Pharmacy" value={saved.pharmacyName} />
        <ReviewRow
          icon="upload"
          label="Documents uploaded"
          value={
            docNames.length
              ? `${docNames.length} attached${saved.licenseFile ? ' • ' + saved.licenseFile : ''}`
              : 'None'
          }
        />
      </div>

      <div className="card form-card">
        <h2>How should we verify you?</h2>
        <div className="ph-choices">
          {VERIFY_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`ph-choice${form.verifyMethod === m.id ? ' on' : ''}`}
              onClick={() => set({ verifyMethod: m.id })}
            >
              <span className="ph-choice-icon">
                <span className="material-symbols-outlined">{m.icon}</span>
              </span>
              <span className="ph-choice-body">
                <strong>{m.title}</strong>
                <small>{m.desc}</small>
              </span>
              <span className="material-symbols-outlined ph-choice-check">
                {form.verifyMethod === m.id
                  ? 'radio_button_checked'
                  : 'radio_button_unchecked'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="card form-card ph-declare">
        <h2>Declaration</h2>
        <label className={`check-row${form.declaration ? ' checked' : ''}`}>
          <input
            type="checkbox"
            checked={form.declaration}
            onChange={(e) => set({ declaration: e.target.checked })}
          />
          I confirm I am a licensed pharmacist and the details above are true.
        </label>
        <label className={`check-row${form.terms ? ' checked' : ''}`}>
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => set({ terms: e.target.checked })}
          />
          I agree to the Pharmacist Code of Conduct and Terms of Service.
        </label>
        <label className={`check-row${form.consent ? ' checked' : ''}`}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set({ consent: e.target.checked })}
          />
          I consent to my license being verified with the issuing authority.
        </label>
      </div>
    </PharmacistFlow>
  )
}
