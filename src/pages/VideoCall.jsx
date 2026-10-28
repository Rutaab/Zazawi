import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChat } from '../context/ChatContext.jsx'

function fmtDur(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function VideoCall() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { threads } = useChat()
  const thread = threads.find((t) => t.id === chatId)

  const [phase, setPhase] = useState('calling')
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [camOn, setCamOn] = useState(true)
  const [camError, setCamError] = useState(false)

  const localVideoRef = useRef(null)
  const streamRef = useRef(null)
  const connectTimer = useRef(0)
  const tickTimer = useRef(0)

  useEffect(() => {
    let cancelled = false
    async function startCam() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCamError(true)
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
          await localVideoRef.current.play().catch(() => {})
        }
      } catch {
        if (!cancelled) setCamError(true)
      }
    }
    startCam()
    connectTimer.current = setTimeout(() => setPhase('connected'), 2800)
    return () => {
      cancelled = true
      clearTimeout(connectTimer.current)
      clearInterval(tickTimer.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  useEffect(() => {
    if (phase !== 'connected') return
    tickTimer.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(tickTimer.current)
  }, [phase])

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !muted
    })
  }, [muted])

  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = camOn
    })
  }, [camOn])

  if (!thread) {
    navigate('/messages', { replace: true })
    return null
  }

  function hangUp() {
    navigate(`/messages/${chatId}`)
  }

  return (
    <div className="call-page video">
      <div className="video-remote">
        {!camError && camOn && phase === 'connected' ? (
          <div className="video-remote-fallback">
            <div className="call-avatar small">{thread.initials}</div>
            <p>{thread.name}</p>
            <small>Camera unavailable on their side</small>
          </div>
        ) : (
          <div className="video-remote-fallback">
            <div className="call-avatar">{thread.initials}</div>
            <p>{thread.name}</p>
          </div>
        )}
      </div>

      <div className="video-local">
        {!camError && camOn ? (
          <video ref={localVideoRef} playsInline muted autoPlay />
        ) : (
          <div className="video-local-off">
            <span className="material-symbols-outlined">videocam_off</span>
          </div>
        )}
      </div>

      <div className="call-top overlay">
        <span className="call-encrypted">
          <span className="material-symbols-outlined">lock</span>
          Encrypted video call
        </span>
        <span className="call-timer">
          {phase === 'calling' ? 'Calling…' : fmtDur(seconds)}
        </span>
      </div>

      <div className="call-controls overlay">
        <button
          className={`call-btn${muted ? ' active' : ''}`}
          onClick={() => setMuted((v) => !v)}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          <span className="material-symbols-outlined">
            {muted ? 'mic_off' : 'mic'}
          </span>
        </button>
        <button
          className={`call-btn${!camOn ? ' active' : ''}`}
          onClick={() => setCamOn((v) => !v)}
          aria-label={camOn ? 'Camera off' : 'Camera on'}
        >
          <span className="material-symbols-outlined">
            {camOn ? 'videocam' : 'videocam_off'}
          </span>
        </button>
        <button className="call-btn end" onClick={hangUp} aria-label="End call">
          <span className="material-symbols-outlined">call_end</span>
        </button>
      </div>
    </div>
  )
}
