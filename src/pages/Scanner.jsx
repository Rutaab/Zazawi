import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  decodeQRFromCanvas,
  decodeQRFromImage,
  generateQRDataUrl,
  parsePayload,
  pharmacyPayload,
} from '../lib/qr.js'
import { useOrder } from '../context/OrderContext.jsx'
import { PHARMACIES } from '../data/pharmacies.js'

export default function Scanner() {
  const navigate = useNavigate()
  const { resetDraft } = useOrder()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(0)
  const lastRef = useRef(0)

  const [cameraState, setCameraState] = useState('starting')
  const [error, setError] = useState('')
  const [demoQr, setDemoQr] = useState(null)

  function handleDecoded(raw) {
    if (!raw) return
    const payload = parsePayload(raw)
    if (payload.type === 'zazawi:pharmacy') {
      const pharmacy =
        PHARMACIES.find((p) => p.id === payload.id) || {
          id: payload.id,
          name: payload.name,
          address: payload.address || '',
        }
      resetDraft({ pharmacy, source: 'qr' })
      navigate('/order/manual')
      return true
    }
    setError(
      `Not a Zazawi pharmacy code. Raw content: ${String(raw).slice(0, 120)}`,
    )
    return false
  }

  useEffect(() => {
    let cancelled = false

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState('unsupported')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play()
        }
        setCameraState('live')
      } catch (err) {
        if (!cancelled) {
          setCameraState('denied')
          setError(err?.message || 'Camera access was denied.')
        }
      }
    }

    start()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  useEffect(() => {
    if (cameraState !== 'live') return

    function loop(now) {
      rafRef.current = requestAnimationFrame(loop)
      if (now - lastRef.current < 250) return
      lastRef.current = now

      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.videoWidth === 0) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const raw = decodeQRFromCanvas(canvas)
      if (raw) {
        cancelAnimationFrame(rafRef.current)
        streamRef.current?.getTracks().forEach((t) => t.stop())
        handleDecoded(raw)
      }
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraState])

  async function loadDemoQr() {
    const url = await generateQRDataUrl(pharmacyPayload(PHARMACIES[0]), {
      width: 320,
    })
    setDemoQr(url)
  }

  function onFileChosen(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const raw = decodeQRFromImage(img)
        if (!handleDecoded(raw || 'No QR code found in that image.')) {
          /* error already set */
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const live = cameraState === 'live'

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
        <h1>Scan Pharmacy QR</h1>
      </header>

      <div className="flow-body">
        <div className="scanner-stage">
          {live && <video ref={videoRef} playsInline muted autoPlay />}
          {live && (
            <div className="scanner-overlay">
              <div className="scanner-reticle">
                <span className="corner c1" />
                <span className="corner c2" />
                <span className="corner c3" />
                <span className="corner c4" />
                <div className="scanner-laser" />
              </div>
            </div>
          )}
          {!live && (
            <div className="scanner-fallback">
              <span className="material-symbols-outlined">
                {cameraState === 'denied' ? 'no_accounts' : 'photo_camera'}
              </span>
              <h3>
                {cameraState === 'denied'
                  ? 'Camera unavailable'
                  : cameraState === 'unsupported'
                    ? 'No camera support'
                    : 'Starting camera…'}
              </h3>
              <p>
                {cameraState === 'starting'
                  ? 'Please allow camera access to scan.'
                  : 'You can upload a QR image or use a sample code instead.'}
              </p>
              <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                <span className="material-symbols-outlined">upload_file</span>
                Upload QR image
                <input type="file" accept="image/*" hidden onChange={onFileChosen} />
              </label>
            </div>
          )}
          <canvas ref={canvasRef} hidden />
        </div>

        <p className="scanner-hint">
          Point your camera at the QR code displayed at the pharmacy counter.
        </p>

        {error && (
          <div
            className="login-nudge"
            style={{
              background: 'var(--danger-10)',
              borderColor: 'rgba(239,68,68,0.3)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--danger)' }}
            >
              error
            </span>
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}

        <div className="scanner-demo">
          <p>
            No pharmacy code handy? Generate a sample for{' '}
            <strong>{PHARMACIES[0].name}</strong> and scan it (or upload it) to
            try the flow:
          </p>
          {demoQr ? (
            <>
              <img src={demoQr} alt="Sample pharmacy QR code" />
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => handleDecoded(pharmacyPayload(PHARMACIES[0]))}
                >
                  Simulate successful scan
                </button>
                <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
                  Upload QR image
                  <input type="file" accept="image/*" hidden onChange={onFileChosen} />
                </label>
              </div>
            </>
          ) : (
            <button className="btn btn-soft" onClick={loadDemoQr}>
              <span className="material-symbols-outlined">qr_code_2</span>
              Generate sample QR
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
