import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChat } from '../context/ChatContext.jsx'

function fmtDur(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function VoiceCall() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { threads } = useChat()
  const thread = threads.find((t) => t.id === chatId)

  const [phase, setPhase] = useState('calling') // calling | connected
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(true)

  const connectTimer = useRef(0)
  const tickTimer = useRef(0)
  const audioRef = useRef(null)

  useEffect(() => {
    connectTimer.current = setTimeout(() => setPhase('connected'), 2600)
    return () => {
      clearTimeout(connectTimer.current)
      clearInterval(tickTimer.current)
      audioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (phase !== 'connected') return
    tickTimer.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(tickTimer.current)
  }, [phase])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  if (!thread) {
    navigate('/messages', { replace: true })
    return null
  }

  function hangUp() {
    navigate(`/messages/${chatId}`)
  }

  return (
    <div className="call-page voice">
      <div className="call-top">
        <span className="call-encrypted">
          <span className="material-symbols-outlined">lock</span>
          Encrypted call
        </span>
      </div>

      <div className="call-body">
        <div className={`call-avatar${phase === 'calling' ? ' ringing' : ''}`}>
          {thread.initials}
        </div>
        <h1>{thread.name}</h1>
        <p className="call-status">
          {phase === 'calling'
            ? 'Calling…'
            : `${thread.role} · ${fmtDur(seconds)}`}
        </p>
      </div>

      <div className="call-controls">
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
          className={`call-btn${!speaker ? ' active' : ''}`}
          onClick={() => setSpeaker((v) => !v)}
          aria-label={speaker ? 'Speaker off' : 'Speaker on'}
        >
          <span className="material-symbols-outlined">
            {speaker ? 'volume_up' : 'volume_off'}
          </span>
        </button>
        <button className="call-btn end" onClick={hangUp} aria-label="End call">
          <span className="material-symbols-outlined">call_end</span>
        </button>
      </div>
    </div>
  )
}
