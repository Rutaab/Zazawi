import { useEffect, useRef, useState } from 'react'
import {
  STATUS_BACKGROUNDS,
  useStatus,
} from '../context/StatusContext.jsx'

function fileToDataUrl(file, max = 1280) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('decode failed'))
      img.onload = () => {
        try {
          const scale = Math.min(1, max / Math.max(img.width, img.height))
          const w = Math.max(1, Math.round(img.width * scale))
          const h = Math.max(1, Math.round(img.height * scale))
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, w, h)
          ctx.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', 0.82))
        } catch (err) {
          reject(err)
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function StatusComposer({ onClose, onShared }) {
  const { addStatus } = useStatus()
  const fileRef = useRef(null)

  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [bg, setBg] = useState('ocean')
  const [image, setImage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    try {
      setBusy(true)
      setError('')
      const dataUrl = await fileToDataUrl(file)
      setImage(dataUrl)
      setMode('image')
    } catch {
      setError('Could not load that image. Try another one.')
    } finally {
      setBusy(false)
    }
  }

  const canShare = mode === 'text' ? text.trim().length > 0 : Boolean(image)

  function share() {
    if (!canShare) return
    if (mode === 'text') {
      addStatus({ kind: 'text', text: text.trim(), bg })
    } else {
      addStatus({ kind: 'image', text: text.trim(), image })
    }
    onShared?.()
  }

  return (
    <div
      className="st-composer"
      role="dialog"
      aria-modal="true"
      aria-label="Create status"
    >
      <header className="st-composer-head">
        <button className="st-icon" onClick={onClose} aria-label="Close composer">
          <span className="material-symbols-outlined">close</span>
        </button>
        <strong>New status</strong>
        <button
          className="st-share"
          onClick={share}
          disabled={!canShare || busy}
        >
          Share
        </button>
      </header>

      <div className="st-compose-stage">
        {mode === 'image' && image ? (
          <div className="st-compose-image">
            <img src={image} alt="" />
            <input
              className="st-caption-input"
              type="text"
              placeholder="Add a caption…"
              maxLength={120}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        ) : (
          <div className={`st-text st-bg-${bg} st-compose-text`}>
            <textarea
              className="st-text-input"
              placeholder="Type a status…"
              maxLength={240}
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            <div className="st-text-tools">
              {STATUS_BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  className={`st-swatch st-bg-${b.id}${bg === b.id ? ' on' : ''}`}
                  onClick={() => setBg(b.id)}
                  aria-label={`${b.label} background`}
                  aria-pressed={bg === b.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <div className="st-error">{error}</div>}

      <footer className="st-composer-foot">
        <button
          className={`st-foot-btn${mode === 'text' ? ' on' : ''}`}
          onClick={() => setMode('text')}
        >
          <span className="material-symbols-outlined">text_fields</span>
          Text
        </button>
        <button
          className={`st-foot-btn${mode === 'image' ? ' on' : ''}`}
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          <span className="material-symbols-outlined">add_photo_alternate</span>
          Photo
        </button>
        {mode === 'image' && image && (
          <button
            className="st-foot-btn"
            onClick={() => {
              setImage(null)
              setMode('text')
            }}
          >
            <span className="material-symbols-outlined">delete</span>
            Remove
          </button>
        )}
        <span className="st-count">
          {text.length}/{mode === 'image' ? 120 : 240}
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onFile}
        />
      </footer>
    </div>
  )
}
