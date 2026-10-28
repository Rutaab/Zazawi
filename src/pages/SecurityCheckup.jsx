import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  loadSecurity,
  saveSecurity,
  METHOD_LABELS,
} from '../lib/security.js'

const CATEGORIES = {
  twoFactor: {
    id: 'twoFactor',
    icon: 'shield',
    title: 'Two-factor authentication',
    short: '2FA',
    step1Desc: 'Require a second verification step when signing in — a stolen password alone won\'t be enough.',
    question: 'Choose your verification method',
    intro:
      'Each time you sign in on a new device, Zazawi will ask for a one-time code using the method you pick below.',
    methods: [
      {
        id: 'sms',
        icon: 'sms',
        title: 'SMS code',
        desc: 'A one-time code sent by text to 0912 ••• 678. Simple and works on any phone.',
      },
      {
        id: 'authenticator',
        icon: 'phonelink_lock',
        title: 'Authenticator app',
        desc: 'Codes from Google Authenticator or similar. Most secure — works even offline.',
      },
      {
        id: 'email',
        icon: 'mail',
        title: 'Email code',
        desc: 'A one-time code sent to your registered email address.',
      },
    ],
    happens:
      'The next time you (or anyone else) sign in from a new device, Zazawi will ask for a one-time code in addition to your password. Your current session stays signed in.',
  },
  loginAlerts: {
    id: 'loginAlerts',
    icon: 'notifications_active',
    title: 'Login alerts',
    short: 'Login alerts',
    step1Desc: 'Get notified immediately when a new device signs in to your account.',
    question: 'Where should we send alerts?',
    intro:
      'We will alert you whenever a sign-in happens from a device you have not used before.',
    methods: [
      {
        id: 'push',
        icon: 'notifications',
        title: 'Push notification',
        desc: 'Instant alert on this device — the fastest option.',
      },
      {
        id: 'email',
        icon: 'mail',
        title: 'Email',
        desc: 'Sent to your registered email address.',
      },
      {
        id: 'sms',
        icon: 'sms',
        title: 'SMS text',
        desc: 'Sent by text message to 0912 ••• 678.',
      },
    ],
    happens:
      'From now on, any sign-in from a new device triggers an alert through your chosen channel. If you do not recognise the sign-in, you can end that session from Active sessions.',
  },
  appLock: {
    id: 'appLock',
    icon: 'lock',
    title: 'App lock',
    short: 'App lock',
    step1Desc: 'Lock Zazawi behind biometrics or a PIN so only you can open it.',
    question: 'Choose your lock method',
    intro:
      'You will be asked for this every time Zazawi opens, protecting your prescriptions and chats if your device is lost or shared.',
    methods: [
      {
        id: 'fingerprint',
        icon: 'fingerprint',
        title: 'Fingerprint',
        desc: 'Unlocks with the fingerprint sensor on your device.',
      },
      {
        id: 'face',
        icon: 'face',
        title: 'Face unlock',
        desc: 'Unlocks with facial recognition where available.',
      },
      {
        id: 'pin',
        icon: 'dialpad',
        title: '5-digit PIN',
        desc: 'A numeric code that works on any device.',
      },
    ],
    happens:
      'Zazawi will ask for your chosen lock method each time the app opens. You can still receive notification badges, but message previews stay hidden until you unlock.',
  },
}

const CATEGORY_ORDER = ['twoFactor', 'loginAlerts', 'appLock']

export default function SecurityCheckup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [categoryId, setCategoryId] = useState(null)
  const [methodId, setMethodId] = useState(null)
  const [done, setDone] = useState(false)

  const category = categoryId ? CATEGORIES[categoryId] : null

  function pickCategory(id) {
    setCategoryId(id)
    setMethodId(null)
    setStep(2)
  }

  function pickMethod(id) {
    setMethodId(id)
    setStep(3)
  }

  function enable() {
    const sec = loadSecurity()
    const field =
      categoryId === 'loginAlerts'
        ? { enabled: true, channel: methodId }
        : { enabled: true, method: methodId }
    saveSecurity({ ...sec, [categoryId]: field })
    setDone(true)
  }

  function restart() {
    setStep(1)
    setCategoryId(null)
    setMethodId(null)
    setDone(false)
  }

  function goBack() {
    if (step > 1) {
      if (step === 3) setMethodId(null)
      setStep(step - 1)
    } else {
      navigate('/settings/privacy')
    }
  }

  const methodLabel = methodId && category
    ? METHOD_LABELS[categoryId][methodId]
    : null

  return (
    <div className="flow-page">
      <header className="flow-header">
        <button className="icon-btn" aria-label="Back" onClick={goBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>Security Check-up</h1>
      </header>

      <div className="wizard-progress" aria-hidden="true">
        <span className={step >= 1 ? 'on' : ''} />
        <span className={step >= 2 ? 'on' : ''} />
        <span className={step >= 3 ? 'on' : ''} />
      </div>

      <div className="flow-body">
        {done ? (
          <div className="wizard-done">
            <div className="confirm-check">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <h2>You're protected</h2>
            <p>
              <strong>{category.title}</strong> is now active via{' '}
              <strong>{methodLabel}</strong>.
            </p>
            <p className="muted" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
              {category.happens}
            </p>
          </div>
        ) : step === 1 ? (
          <>
            <h2 className="wizard-q">How do you want to protect your account?</h2>
            <p className="wizard-sub">
              Pick one to set up now — you can come back and enable the others
              anytime. This takes less than a minute.
            </p>
            {CATEGORY_ORDER.map((id) => {
              const c = CATEGORIES[id]
              return (
                <button
                  key={id}
                  className="wizard-option"
                  onClick={() => pickCategory(id)}
                >
                  <span className="icon-tile">
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </span>
                  <span className="opt-body">
                    <strong>{c.title}</strong>
                    <small>{c.step1Desc}</small>
                  </span>
                  <span className="material-symbols-outlined opt-arrow">
                    chevron_right
                  </span>
                </button>
              )
            })}
          </>
        ) : step === 2 ? (
          <>
            <h2 className="wizard-q">{category.question}</h2>
            <p className="wizard-sub">{category.intro}</p>
            {category.methods.map((m) => (
              <button
                key={m.id}
                className="wizard-option"
                onClick={() => pickMethod(m.id)}
              >
                <span className="icon-tile">
                  <span className="material-symbols-outlined">{m.icon}</span>
                </span>
                <span className="opt-body">
                  <strong>{m.title}</strong>
                  <small>{m.desc}</small>
                </span>
                <span className="material-symbols-outlined opt-arrow">
                  chevron_right
                </span>
              </button>
            ))}
          </>
        ) : (
          <>
            <h2 className="wizard-q">Review &amp; activate</h2>
            <p className="wizard-sub">
              Here is what you are about to turn on:
            </p>
            <div className="card verify-card">
              <div className="verify-row">
                <span className="k">Protection</span>
                <span className="v">{category.title}</span>
              </div>
              <div className="verify-row">
                <span className="k">Method</span>
                <span className="v">{methodLabel}</span>
              </div>
              <div className="verify-row">
                <span className="k">Status</span>
                <span className="v">
                  <span className="pill pill-warning">About to enable</span>
                </span>
              </div>
            </div>
            <div className="info-box">
              <span className="material-symbols-outlined">info</span>
              <p>{category.happens}</p>
            </div>
          </>
        )}
      </div>

      {!done && (
        <div className="flow-footer">
          {step === 3 ? (
            <button className="btn btn-primary btn-block" onClick={enable}>
              <span className="material-symbols-outlined">verified_user</span>
              Enable {category.short}
            </button>
          ) : (
            <p className="wizard-step-label">
              Step {step} of 3 · one question at a time
            </p>
          )}
        </div>
      )}

      {done && (
        <div className="flow-footer">
          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate('/settings/privacy')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Privacy &amp; Security
          </button>
          <button className="btn btn-ghost btn-block" onClick={restart}>
            Set up another protection
          </button>
        </div>
      )}
    </div>
  )
}
