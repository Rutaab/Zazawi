import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PHARMACIES } from '../data/pharmacies.js'
import { useCommunity } from '../context/CommunityContext.jsx'

export default function ShareReview() {
  const navigate = useNavigate()
  const { addPost } = useCommunity()

  const [pharmId, setPharmId] = useState(PHARMACIES[0].id)
  const [stars, setStars] = useState(0)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)

  const pharmacy = PHARMACIES.find((p) => p.id === pharmId) || PHARMACIES[0]
  const canSubmit = stars > 0 && text.trim().length > 0

  function submit() {
    if (!canSubmit) return
    const rating = '★'.repeat(stars) + '☆'.repeat(5 - stars)
    addPost({
      communityId: 'cm-reviews',
      text: `${rating} · ${pharmacy.name}\n\n${text.trim()}`,
      image: null,
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="confirm-page">
        <div className="confirm-check">
          <span className="material-symbols-outlined">star</span>
        </div>
        <h1>Thank you!</h1>
        <p className="sub">
          Your {stars}-star review for {pharmacy.name} was shared with the
          community.
        </p>
        <div className="confirm-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate('/community/cm-reviews')}
          >
            <span className="material-symbols-outlined">forum</span>
            View community feed
          </button>
          <button
            className="btn btn-ghost btn-block"
            onClick={() => navigate('/dashboard')}
          >
            <span className="material-symbols-outlined">home</span>
            Back to dashboard
          </button>
        </div>
      </div>
    )
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
        <h1>Share Review</h1>
      </header>

      <div className="flow-body">
        <div className="card form-card">
          <h2>How was your experience?</h2>

          <div className="star-row" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`star-btn${(hover || stars) >= n ? ' on' : ''}`}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setStars(n)}
              >
                <span className="material-symbols-outlined">star</span>
              </button>
            ))}
            <span className="star-label">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][hover || stars]}
            </span>
          </div>

          <div className="field">
            <label>Pharmacy</label>
            <select
              value={pharmId}
              onChange={(e) => setPharmId(e.target.value)}
            >
              {PHARMACIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.address}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Your review</label>
            <textarea
              rows="5"
              placeholder="What went well? Wait time, staff helpfulness, medicine availability…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flow-footer">
        <button
          className="btn btn-primary btn-block"
          disabled={!canSubmit}
          onClick={submit}
        >
          <span className="material-symbols-outlined">send</span>
          Post review
        </button>
      </div>
    </div>
  )
}
