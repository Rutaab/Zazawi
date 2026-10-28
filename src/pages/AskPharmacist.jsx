import { useNavigate } from 'react-router-dom'
import { useChat } from '../context/ChatContext.jsx'

const PHARMACISTS = [
  {
    id: 'c1',
    name: 'Dr. Amal — CarePoint Pharmacy',
    role: 'Pharmacist · usually replies in minutes',
    initials: 'DA',
    online: true,
  },
  {
    id: 'c3',
    name: 'Dr. Khalid — Al-Nile Medical',
    role: 'Pharmacist · last seen today',
    initials: 'DK',
    online: false,
  },
  {
    id: 'ph-003',
    name: 'Dr. Sara — Zazawi Central Pharmacy',
    role: 'Pharmacist · usually replies in minutes',
    initials: 'DS',
    online: true,
  },
]

const QUICK_QUESTIONS = [
  'Is my medicine in stock?',
  'What is the correct dosage?',
  'Can I take this with other medicine?',
  'How long until my order is ready?',
]

export default function AskPharmacist() {
  const navigate = useNavigate()
  const { startThread, sendText } = useChat()

  function openChat(pharmacist, question) {
    startThread({
      id: pharmacist.id,
      name: pharmacist.name,
      role: 'Pharmacist',
      initials: pharmacist.initials,
      online: pharmacist.online,
    })
    if (question) sendText(pharmacist.id, question)
    navigate(`/messages/${pharmacist.id}`)
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
        <h1>Ask a Pharmacist</h1>
      </header>

      <div className="flow-body">
        <p className="scanner-hint" style={{ marginTop: 0 }}>
          Start an end-to-end encrypted chat — or tap a quick question to send
          it right away.
        </p>

        <div className="card form-card">
          <h2>Quick questions</h2>
          <div className="chip-row">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                className="chip"
                onClick={() => openChat(PHARMACISTS[0], q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: '1rem', margin: '1.25rem 0 0.75rem' }}>
          Available pharmacists
        </h2>
        {PHARMACISTS.map((ph) => (
          <div key={ph.id} className="pharmacy-card">
            <span className="avatar chat-avatar-static">
              {ph.initials}
              {ph.online && <span className="presence online" />}
            </span>
            <div className="info">
              <strong>{ph.name}</strong>
              <small>{ph.role}</small>
            </div>
            <button
              className="btn btn-soft ask-btn"
              onClick={() => openChat(ph)}
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
