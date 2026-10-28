import { useNavigate } from 'react-router-dom'
import { useOrder } from '../context/OrderContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ManualEntry() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { draft, updateDraft } = useOrder()

  const patient = {
    name: draft.patient.name || (user?.name ?? ''),
    phone: draft.patient.phone || (user?.phone ?? ''),
  }

  function setPatient(patch) {
    updateDraft({ patient: { ...draft.patient, ...patch } })
  }

  function setItem(index, patch) {
    const items = draft.items.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    )
    updateDraft({ items })
  }

  function addItem() {
    updateDraft({
      items: [...draft.items, { name: '', dosage: '', qty: 1 }],
    })
  }

  function removeItem(index) {
    if (draft.items.length === 1) return
    updateDraft({ items: draft.items.filter((_, i) => i !== index) })
  }

  const hasMedicine = draft.items.some((i) => i.name.trim())

  function goVerify() {
    updateDraft({
      patient: {
        name: patient.name || 'Guest',
        phone: patient.phone,
      },
      source: draft.source || 'manual',
    })
    navigate('/order/verify')
  }

  return (
    <div className="flow-page">
      <header className="flow-header">
        <button
          className="icon-btn"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>Enter Prescription</h1>
      </header>

      <div className="flow-body">
        {draft.pharmacy && (
          <div className="pharmacy-lock">
            <span className="material-symbols-outlined">local_pharmacy</span>
            <div>
              <strong>{draft.pharmacy.name}</strong>
              <small>{draft.pharmacy.address}</small>
            </div>
          </div>
        )}

        <div className="card form-card">
          <h2>Patient details</h2>
          <div className="field">
            <label>Full name</label>
            <input
              type="text"
              placeholder="e.g. Sara Ahmed"
              value={patient.name}
              onChange={(e) => setPatient({ name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Phone number</label>
            <input
              type="tel"
              placeholder="e.g. 0912 345 678"
              value={patient.phone}
              onChange={(e) => setPatient({ phone: e.target.value })}
            />
          </div>
        </div>

        <div className="card form-card">
          <h2>Medicines</h2>
          {draft.items.map((item, index) => (
            <div className="med-row" key={index}>
              <div className="field">
                <label>Medicine name</label>
                <input
                  type="text"
                  placeholder="e.g. Panadol"
                  value={item.name}
                  onChange={(e) => setItem(index, { name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Dosage</label>
                <input
                  type="text"
                  placeholder="500mg"
                  value={item.dosage}
                  onChange={(e) => setItem(index, { dosage: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) =>
                    setItem(index, { qty: Math.max(1, Number(e.target.value) || 1) })
                  }
                />
              </div>
              <button
                className="icon-btn"
                aria-label="Remove medicine"
                onClick={() => removeItem(index)}
                disabled={draft.items.length === 1}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          <button className="add-med" onClick={addItem}>
            <span className="material-symbols-outlined">add_circle</span>
            Add another medicine
          </button>
        </div>

        <div className="card form-card">
          <h2>Notes for the pharmacist</h2>
          <div className="field">
            <textarea
              rows="3"
              placeholder="Allergies, preferred brands, pickup time…"
              value={draft.notes}
              onChange={(e) => updateDraft({ notes: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flow-footer">
        <button
          className="btn btn-primary btn-block"
          disabled={!hasMedicine}
          onClick={goVerify}
        >
          Review prescription
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
