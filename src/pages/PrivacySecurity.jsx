import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import {
  loadSecurity,
  saveSecurity,
  activeProtectionCount,
  METHOD_LABELS,
} from '../lib/security.js'

const SESSIONS = [
  {
    id: 's1',
    device: 'This device — Chrome on Windows',
    location: 'Khartoum',
    current: true,
  },
  {
    id: 's2',
    device: 'Zazawi Android app',
    location: 'Khartoum',
    last: 'Last active 2 days ago',
  },
]

function StatusPill({ on }) {
  return (
    <span className={`pill ${on ? 'pill-success' : 'pill-warning'}`}>
      {on ? 'On' : 'Off'}
    </span>
  )
}

export default function PrivacySecurity() {
  const navigate = useNavigate()
  const [sec, setSec] = useState(loadSecurity)
  const [sessions, setSessions] = useState(SESSIONS)
  const [showSessions, setShowSessions] = useState(false)

  const active = activeProtectionCount(sec)

  function update(patch) {
    const next = { ...sec, ...patch }
    setSec(next)
    saveSecurity(next)
  }

  function methodLabel(category) {
    const m = sec[category].method
    return m ? METHOD_LABELS[category][m] || m : null
  }

  return (
    <>
      <TopBar
        back
        subtitle="Settings"
        title="Privacy & Security"
        notifications={false}
      />

      <div className="card security-hero">
        <span className={`shield-tile${active === 0 ? ' warn' : ''}`}>
          <span className="material-symbols-outlined">
            {active > 0 ? 'verified_user' : 'shield'}
          </span>
        </span>
        <div className="hero-body">
          <strong>
            {active}/3 protections active
          </strong>
          <small>
            {active === 3
              ? 'Your account is fully protected.'
              : 'Run a quick check-up to stay safe.'}
          </small>
        </div>
        <button
          className="btn btn-soft hero-cta"
          onClick={() => navigate('/settings/privacy/checkup')}
        >
          Check-up
        </button>
      </div>

      <div className="settings-section">Sign-in &amp; security</div>

      <button
        className="settings-row"
        onClick={() => navigate('/settings/privacy/checkup')}
      >
        <span className="icon-tile">
          <span className="material-symbols-outlined">shield</span>
        </span>
        <span className="info">
          <strong>Two-factor authentication</strong>
          <small>
            {sec.twoFactor.enabled
              ? `Active via ${methodLabel('twoFactor')}`
              : 'Require a second step when signing in'}
          </small>
        </span>
        <StatusPill on={sec.twoFactor.enabled} />
        <span className="material-symbols-outlined row-arrow">chevron_right</span>
      </button>

      <button
        className="settings-row"
        onClick={() => navigate('/settings/privacy/checkup')}
      >
        <span className="icon-tile">
          <span className="material-symbols-outlined">notifications_active</span>
        </span>
        <span className="info">
          <strong>Login alerts</strong>
          <small>
            {sec.loginAlerts.enabled
              ? `Alerts via ${methodLabel('loginAlerts')}`
              : 'Get notified about new device sign-ins'}
          </small>
        </span>
        <StatusPill on={sec.loginAlerts.enabled} />
        <span className="material-symbols-outlined row-arrow">chevron_right</span>
      </button>

      <button
        className="settings-row"
        onClick={() => navigate('/settings/privacy/checkup')}
      >
        <span className="icon-tile">
          <span className="material-symbols-outlined">lock</span>
        </span>
        <span className="info">
          <strong>App lock</strong>
          <small>
            {sec.appLock.enabled
              ? `Locked with ${methodLabel('appLock')}`
              : 'Open Zazawi with biometrics or a PIN'}
          </small>
        </span>
        <StatusPill on={sec.appLock.enabled} />
        <span className="material-symbols-outlined row-arrow">chevron_right</span>
      </button>

      <button
        className="settings-row"
        onClick={() => setShowSessions((v) => !v)}
      >
        <span className="icon-tile">
          <span className="material-symbols-outlined">devices</span>
        </span>
        <span className="info">
          <strong>Active sessions</strong>
          <small>{sessions.length} device{sessions.length !== 1 ? 's' : ''} signed in</small>
        </span>
        <span className="material-symbols-outlined row-arrow">
          {showSessions ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {showSessions && (
        <div className="card sessions-card">
          {sessions.map((s) => (
            <div key={s.id} className="session-row">
              <div className="info">
                <strong>{s.device}</strong>
                <small>
                  {s.location}
                  {s.current ? ' · This device' : ` · ${s.last}`}
                </small>
              </div>
              {!s.current && (
                <button
                  className="btn btn-soft session-out"
                  onClick={() =>
                    setSessions((list) => list.filter((x) => x.id !== s.id))
                  }
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="settings-section">Your data</div>

      <div className="settings-row">
        <span className="icon-tile">
          <span className="material-symbols-outlined">tune</span>
        </span>
        <span className="info">
          <strong>Personalized tips &amp; analytics</strong>
          <small>Help improve Zazawi with anonymous usage data</small>
        </span>
        <button
          className={`switch${sec.dataAnalytics ? ' on' : ''}`}
          role="switch"
          aria-checked={sec.dataAnalytics}
          aria-label="Personalized tips and analytics"
          onClick={() => update({ dataAnalytics: !sec.dataAnalytics })}
        />
      </div>

      <div className="settings-row column">
        <div className="vis-head">
          <span className="icon-tile">
            <span className="material-symbols-outlined">visibility</span>
          </span>
          <span className="info">
            <strong>Profile visibility</strong>
            <small>Who can see your name and profile photo</small>
          </span>
        </div>
        <div className="seg-control">
          {[
            { id: 'everyone', label: 'Everyone' },
            { id: 'patients', label: 'Patients only' },
            { id: 'private', label: 'Nobody' },
          ].map((opt) => (
            <button
              key={opt.id}
              className={sec.profileVisibility === opt.id ? 'on' : ''}
              onClick={() => update({ profileVisibility: opt.id })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-row">
        <span className="icon-tile">
          <span className="material-symbols-outlined">lock</span>
        </span>
        <span className="info">
          <strong>End-to-end encrypted chats</strong>
          <small>Messages and calls are encrypted on your device</small>
        </span>
        <span className="pill pill-primary">Always on</span>
      </div>

      <div className="settings-section">Permissions</div>

      <div className="settings-row">
        <span className="icon-tile">
          <span className="material-symbols-outlined">photo_camera</span>
        </span>
        <span className="info">
          <strong>Camera</strong>
          <small>Used for scanning pharmacy QR codes</small>
        </span>
        <span className="pill pill-success">Allowed</span>
      </div>

      <div className="settings-row">
        <span className="icon-tile">
          <span className="material-symbols-outlined">mic</span>
        </span>
        <span className="info">
          <strong>Microphone</strong>
          <small>Used for voice messages and calls</small>
        </span>
        <span className="pill pill-success">Allowed</span>
      </div>

      <div className="settings-row">
        <span className="icon-tile">
          <span className="material-symbols-outlined">notifications</span>
        </span>
        <span className="info">
          <strong>Notifications</strong>
          <small>Message badges, login alerts and order updates</small>
        </span>
        <span className="pill pill-success">Allowed</span>
      </div>

      <div style={{ height: '1.5rem' }} />
    </>
  )
}
