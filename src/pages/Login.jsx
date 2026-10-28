import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.98 8.98 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.47h-2.8v8.38A12 12 0 0 0 24 12z"
      />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()
  const next = location.state?.next || '/dashboard'

  const [mode, setMode] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function finish(profile) {
    login(profile)
    navigate(next, { replace: true })
  }

  function socialLogin(provider) {
    if (provider === 'google') {
      finish({ name: 'Google User', email: 'user@gmail.com' })
    } else {
      finish({ name: 'Facebook User', email: 'user@facebook.com' })
    }
  }

  function submitPhone(e) {
    e.preventDefault()
    if (!phone.trim()) return setError('Enter your phone number.')
    if (!code.trim()) return setError('Enter the verification code.')
    finish({ name: name || 'Zazawi User', phone: phone.trim() })
  }

  function submitEmail(e) {
    e.preventDefault()
    if (!email.trim() || !password.trim())
      return setError('Enter your email and password.')
    finish({
      name: name || email.split('@')[0],
      email: email.trim(),
    })
  }

  return (
    <div className="login-page">
      <div className="card login-card">
        <div className="brand">
          <span className="brand-mark">
            <span className="material-symbols-outlined filled">medication</span>
          </span>
          <strong>Zazawi</strong>
        </div>
        <p>Log in to track orders and save your prescriptions.</p>

        <div className="social-row">
          <button className="social-btn" onClick={() => socialLogin('google')}>
            <GoogleIcon />
            Google
          </button>
          <button
            className="social-btn"
            onClick={() => socialLogin('facebook')}
          >
            <FacebookIcon />
            Facebook
          </button>
        </div>

        <div className="or-sep">
          <span>or</span>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab${mode === 'phone' ? ' active' : ''}`}
            onClick={() => {
              setMode('phone')
              setError('')
            }}
          >
            Phone (OTP)
          </button>
          <button
            className={`login-tab${mode === 'email' ? ' active' : ''}`}
            onClick={() => {
              setMode('email')
              setError('')
            }}
          >
            Email &amp; password
          </button>
        </div>

        {mode === 'phone' ? (
          <form className="login-form" onSubmit={submitPhone}>
            <div className="field">
              <label>Your name</label>
              <input
                type="text"
                placeholder="Optional"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Phone number</label>
              <input
                type="tel"
                placeholder="0912 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Verification code</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Any 4–6 digits (demo)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            {error && (
              <p style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{error}</p>
            )}
            <button className="btn btn-primary btn-block" type="submit">
              Verify &amp; continue
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={submitEmail}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{error}</p>
            )}
            <button className="btn btn-primary btn-block" type="submit">
              Log in
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        )}

        <p className="login-alt">
          <button onClick={() => navigate(next, { replace: true })}>
            Continue as guest
          </button>
        </p>
      </div>
    </div>
  )
}
