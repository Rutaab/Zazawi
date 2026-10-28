import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useChat } from '../context/ChatContext.jsx'
import { decryptText } from '../lib/crypto.js'

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtDay(ts) {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  const y = new Date(now)
  y.setDate(now.getDate() - 1)
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function fmtDur(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function fmtSize(bytes) {
  if (!bytes) return ''
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function TextBody({ enc }) {
  const [text, setText] = useState('···')
  useEffect(() => {
    let alive = true
    decryptText(enc)
      .then((t) => alive && setText(t))
      .catch(() => alive && setText('⚠ Unable to decrypt'))
    return () => {
      alive = false
    }
  }, [enc])
  return <span>{text}</span>
}

function Ticks({ status }) {
  if (!status) return null
  return (
    <span className={`ticks${status === 'read' ? ' read' : ''}`}>
      <span className="material-symbols-outlined">
        {status === 'sent' ? 'done' : 'done_all'}
      </span>
    </span>
  )
}

function VoiceBubble({ msg }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const bars = Array.from({ length: 24 }, (_, i) => {
    const c = (msg.id.charCodeAt(i % msg.id.length) || 70) % 8
    return 4 + (c || 3)
  })

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <div className="voice-bubble">
      <button className="voice-play" onClick={toggle} aria-label="Play voice message">
        <span className="material-symbols-outlined">
          {playing ? 'pause' : 'play_arrow'}
        </span>
      </button>
      <div className="waveform">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h * 2.2}px` }} />
        ))}
      </div>
      <span className="voice-dur">{fmtDur(msg.media?.duration || 0)}</span>
      <audio
        ref={audioRef}
        src={msg.media?.url}
        onEnded={() => setPlaying(false)}
      />
    </div>
  )
}

function Bubble({ msg }) {
  const out = msg.dir === 'out'
  return (
    <div className={`msg-row${out ? ' out' : ' in'}`}>
      <div className="bubble">
        {msg.kind === 'text' && (
          <div className="bubble-text">
            <TextBody enc={msg.enc} />
          </div>
        )}
        {msg.kind === 'image' && msg.media && (
          <img className="chat-img" src={msg.media.url} alt={msg.media.name || 'Shared image'} />
        )}
        {msg.kind === 'file' && msg.media && (
          <a
            className="file-bubble"
            href={msg.media.url}
            download={msg.media.name}
          >
            <span className="material-symbols-outlined">insert_drive_file</span>
            <span className="file-meta">
              <strong>{msg.media.name}</strong>
              <small>{fmtSize(msg.media.size)}</small>
            </span>
            <span className="material-symbols-outlined">download</span>
          </a>
        )}
        {msg.kind === 'voice' && <VoiceBubble msg={msg} />}
        <div className="bubble-meta">
          <span className="bubble-time">{fmtTime(msg.ts)}</span>
          {out && <Ticks status={msg.status} />}
        </div>
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="msg-row in">
      <div className="bubble typing">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}

export default function Chat() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { threads, typingIn, sendText, sendMedia, sendVoice, markRead } = useChat()

  const thread = threads.find((t) => t.id === chatId)

  const [text, setText] = useState('')
  const [attachOpen, setAttachOpen] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recSeconds, setRecSeconds] = useState(0)
  const [micError, setMicError] = useState('')

  const scrollRef = useRef(null)
  const photoInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const recTimerRef = useRef(0)
  const recSecondsRef = useRef(0)
  const discardRef = useRef(false)

  useEffect(() => {
    if (thread) markRead(thread.id)
  }, [thread, thread?.messages.length, markRead])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [thread?.messages.length, typingIn])

  useEffect(() => {
    return () => {
      clearInterval(recTimerRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  if (!thread) {
    navigate('/messages', { replace: true })
    return null
  }

  const partnerTyping = typingIn === thread.id

  async function handleSend() {
    const value = text
    setText('')
    await sendText(thread.id, value)
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (text.trim()) handleSend()
    }
  }

  function onFileChosen(e, kind) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = URL.createObjectURL(file)
    sendMedia(thread.id, kind, {
      url,
      name: file.name,
      size: file.size,
      mime: file.type,
    })
    setAttachOpen(false)
  }

  async function startRecording() {
    setMicError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Microphone not supported on this device.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const rec = new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        if (!discardRef.current && chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, {
            type: rec.mimeType || 'audio/webm',
          })
          sendVoice(thread.id, {
            url: URL.createObjectURL(blob),
            duration: recSecondsRef.current,
          })
        }
        discardRef.current = false
      }
      rec.start()
      recorderRef.current = rec
      recSecondsRef.current = 0
      setRecSeconds(0)
      setRecording(true)
      recTimerRef.current = setInterval(() => {
        recSecondsRef.current += 1
        setRecSeconds(recSecondsRef.current)
        if (recSecondsRef.current >= 120) stopRecording(true)
      }, 1000)
    } catch {
      setMicError('Microphone access denied. Check browser permissions.')
    }
  }

  function stopRecording(send) {
    clearInterval(recTimerRef.current)
    discardRef.current = !send
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
    }
    setRecording(false)
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <button className="icon-btn" aria-label="Back" onClick={() => navigate('/messages')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <Link to="/messages" className="chat-avatar">
          {thread.isGroup ? (
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              groups
            </span>
          ) : (
            <>
              {thread.initials}
              {thread.online && <span className="presence online" />}
            </>
          )}
        </Link>
        <div className="chat-peer">
          <strong>{thread.name}</strong>
          <small className={partnerTyping ? 'typing-label' : ''}>
            {partnerTyping
              ? 'typing…'
              : thread.isGroup
                ? `${thread.memberCount || 0} members`
                : thread.online
                  ? 'online'
                  : `last seen ${fmtDay(thread.messages[thread.messages.length - 1]?.ts || Date.now()).toLowerCase()} at ${fmtTime(thread.messages[thread.messages.length - 1]?.ts || Date.now())}`}
          </small>
        </div>
        <Link
          to={`/messages/${thread.id}/call`}
          className="icon-btn"
          aria-label="Voice call"
        >
          <span className="material-symbols-outlined">call</span>
        </Link>
        <Link
          to={`/messages/${thread.id}/video-call`}
          className="icon-btn"
          aria-label="Video call"
        >
          <span className="material-symbols-outlined">videocam</span>
        </Link>
      </header>

      <div className="e2e-banner">
        <span className="material-symbols-outlined">lock</span>
        Messages are end-to-end encrypted.{' '}
        {thread.isGroup
          ? 'Only members of this group'
          : `Only you and ${thread.name.split(' — ')[0]}`}{' '}
        can read them.
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {(() => {
          const rows = []
          let lastDay = null
          for (const msg of thread.messages) {
            const day = fmtDay(msg.ts)
            if (day !== lastDay) {
              lastDay = day
              rows.push(
                <div className="date-sep" key={`d-${msg.id}`}>
                  <span>{day}</span>
                </div>,
              )
            }
            rows.push(<Bubble key={msg.id} msg={msg} />)
          }
          if (partnerTyping) rows.push(<TypingBubble key="typing" />)
          return rows
        })()}
      </div>

      {micError && (
        <div className="chat-toast">
          <span className="material-symbols-outlined">mic_off</span>
          {micError}
        </div>
      )}

      {recording ? (
        <div className="composer recording">
          <span className="rec-dot" />
          <span className="rec-timer">{fmtDur(recSeconds)}</span>
          <span className="rec-hint">Recording…</span>
          <button
            className="composer-btn danger"
            onClick={() => stopRecording(false)}
            aria-label="Cancel recording"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
          <button
            className="composer-btn primary"
            onClick={() => stopRecording(true)}
            aria-label="Send voice message"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      ) : (
        <div className="composer">
          {attachOpen && (
            <div className="attach-menu">
              <button onClick={() => photoInputRef.current?.click()}>
                <span className="material-symbols-outlined">image</span>
                Photo
              </button>
              <button onClick={() => fileInputRef.current?.click()}>
                <span className="material-symbols-outlined">attach_file</span>
                Document
              </button>
            </div>
          )}
          <button
            className="composer-btn"
            aria-label="Attach file"
            onClick={() => setAttachOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">
              {attachOpen ? 'close' : 'add_circle'}
            </span>
          </button>
          <textarea
            className="composer-input"
            rows={1}
            placeholder="Type a message…"
            enterKeyHint="send"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
          />
          {text.trim() ? (
            <button
              className="composer-btn primary"
              aria-label="Send"
              onClick={handleSend}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          ) : (
            <button
              className="composer-btn"
              aria-label="Record voice message"
              onClick={startRecording}
            >
              <span className="material-symbols-outlined">mic</span>
            </button>
          )}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onFileChosen(e, 'image')}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
            hidden
            onChange={(e) => onFileChosen(e, 'file')}
          />
        </div>
      )}
    </div>
  )
}
