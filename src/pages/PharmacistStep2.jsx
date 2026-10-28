import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PharmacistFlow from '../components/PharmacistFlow.jsx'
import {
  BOARDS,
  DOCUMENT_TYPES,
  EXPERIENCE,
  isStepTwoValid,
  loadDraft,
  saveDraft,
} from '../data/pharmacist.js'

export default function PharmacistStep2() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const saved = loadDraft()

  const [form, setForm] = useState({
    licenseNo: saved.licenseNo,
    board: saved.board,
    issueDate: saved.issueDate,
    expiryDate: saved.expiryDate,
    qualification: saved.qualification,
    experience: saved.experience,
    pharmacyName: saved.pharmacyName,
    pharmacyRegNo: saved.pharmacyRegNo,
    practiceAddress: saved.practiceAddress,
    licenseFile: saved.licenseFile,
    docs: saved.docs,
  })

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }))
    saveDraft(patch)
  }

  function toggleDoc(id) {
    const docs = { ...form.docs, [id]: !form.docs[id] }
    set({ docs })
  }

  function onFile(e) {
    const file = e.target.files?.[0]
    set({ licenseFile: file ? file.name : '' })
  }

  const valid = isStepTwoValid(form)

  function next() {
    if (!valid) return
    saveDraft(form)
    navigate('/pharmacist/register/review')
  }

  return (
    <PharmacistFlow
      step={2}
      subtitle="Pharmacist verification"
      title="License & credentials"
      onBack={() => navigate('/pharmacist/register')}
      onNext={next}
      nextLabel="Continue to review"
      nextDisabled={!valid}
      footerNote="These details are checked against the issuing pharmacy authority."
    >
      <div className="card form-card">
        <h2>Pharmacy license</h2>

        <div className="field">
          <label>License / registration number</label>
          <input
            type="text"
            placeholder="e.g. RPh-2024-00183"
            value={form.licenseNo}
            onChange={(e) => set({ licenseNo: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Licensing authority</label>
          <select
            value={form.board}
            onChange={(e) => set({ board: e.target.value })}
          >
            <option value="">Select issuing authority</option>
            {BOARDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="ph-two">
          <div className="field">
            <label>Issue date</label>
            <input
              type="date"
              value={form.issueDate}
              onChange={(e) => set({ issueDate: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Expiry date</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => set({ expiryDate: e.target.value })}
            />
          </div>
        </div>

        <div className="ph-two">
          <div className="field">
            <label>Qualification (degree)</label>
            <input
              type="text"
              placeholder="e.g. PharmD, University of Nairobi"
              value={form.qualification}
              onChange={(e) => set({ qualification: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Years of experience</label>
            <select
              value={form.experience}
              onChange={(e) => set({ experience: e.target.value })}
            >
              <option value="">Select experience</option>
              {EXPERIENCE.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card form-card">
        <h2>Place of practice</h2>

        <div className="field">
          <label>Pharmacy name</label>
          <input
            type="text"
            placeholder="e.g. Goodlife Pharmacy — Westlands"
            value={form.pharmacyName}
            onChange={(e) => set({ pharmacyName: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Pharmacy registration number</label>
          <input
            type="text"
            placeholder="e.g. PPR-88421"
            value={form.pharmacyRegNo}
            onChange={(e) => set({ pharmacyRegNo: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Practice address</label>
          <textarea
            rows={3}
            placeholder="Street, city, postal code"
            value={form.practiceAddress}
            onChange={(e) => set({ practiceAddress: e.target.value })}
          />
        </div>
      </div>

      <div className="card form-card">
        <h2>Upload documents</h2>

        <button
          type="button"
          className={`ph-upload${form.licenseFile ? ' has-file' : ''}`}
          onClick={() => fileRef.current?.click()}
        >
          <span className="material-symbols-outlined">
            {form.licenseFile ? 'picture_as_pdf' : 'upload'}
          </span>
          <span className="ph-upload-text">
            <strong>
              {form.licenseFile ? form.licenseFile : 'Upload your pharmacy license'}
            </strong>
            <small>
              {form.licenseFile
                ? 'Tap to replace file'
                : 'PDF, JPG or PNG — up to 10 MB'}
            </small>
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          hidden
          onChange={onFile}
        />

        <div className="ph-docs">
          {DOCUMENT_TYPES.map((d) => {
            const on = form.docs[d.id]
            return (
              <button
                key={d.id}
                type="button"
                className={`ph-doc${on ? ' on' : ''}`}
                onClick={() => toggleDoc(d.id)}
              >
                <span className="material-symbols-outlined">
                  {on ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className="ph-doc-label">
                  {d.label}
                  {d.required && <em>Required</em>}
                </span>
                <span className="material-symbols-outlined ph-doc-arrow">
                  {on ? 'task_alt' : 'chevron_right'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="ph-tip">
        <span className="material-symbols-outlined">lock</span>
        <span>
          Documents are stored encrypted and deleted automatically 30 days after
          your account is verified.
        </span>
      </div>
    </PharmacistFlow>
  )
}
