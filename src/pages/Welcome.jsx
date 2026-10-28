import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Welcome() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="welcome-page">
      <header className="welcome-top">
        <span className="welcome-top-brand">
          <span className="material-symbols-outlined filled">medication</span>
          Zazawi
        </span>
        {user ? (
          <Link to="/dashboard" className="welcome-account">
            <span className="avatar-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
            Dashboard
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary welcome-login-btn">
            <span className="material-symbols-outlined">person</span>
            Log in
          </Link>
        )}
      </header>

      <div className="welcome-mark">
        <span className="material-symbols-outlined filled">medication</span>
      </div>
      <div className="welcome-brand">Zazawi</div>

      <div className="welcome-frame">
        <span className="corner c1" />
        <span className="corner c2" />
        <span className="corner c3" />
        <span className="corner c4" />
        <span className="material-symbols-outlined">qr_code_scanner</span>
      </div>

      <h1>Welcome to Zazawi</h1>
      <p className="sub">
        Scan a pharmacy QR code or enter your prescription manually — we'll
        handle the rest and notify you when it's ready for pickup.
      </p>

      {user && (
        <div className="welcome-user-chip">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            check_circle
          </span>
          Signed in as {user.name}
        </div>
      )}

      <div className="welcome-actions">
        <button
          className="btn btn-primary btn-block"
          onClick={() => navigate('/order/scan')}
        >
          <span className="material-symbols-outlined">qr_code_scanner</span>
          Scan Pharmacy QR
        </button>
        <button
          className="btn btn-soft btn-block"
          onClick={() => navigate('/order/manual')}
        >
          <span className="material-symbols-outlined">edit_note</span>
          Enter Prescription Manually
        </button>
        {user ? (
          <button
            className="btn btn-ghost btn-block"
            onClick={() => navigate('/dashboard')}
          >
            <span className="material-symbols-outlined">home</span>
            Go to Dashboard
          </button>
        ) : (
          <p className="welcome-login">
            Already have an account?{' '}
            <Link to="/login">
              <strong>Log in</strong>
            </Link>
          </p>
        )}
      </div>

      <p className="welcome-footer">Powered by Zazawi Health Systems</p>
    </div>
  )
}
