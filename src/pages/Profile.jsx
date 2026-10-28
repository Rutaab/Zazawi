import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function addressCount() {
  try {
    const raw = localStorage.getItem('zazawi.addresses')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.length
    }
  } catch {
    /* ignore */
  }
  return 2
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [addrCount, setAddrCount] = useState(2)

  useEffect(() => setAddrCount(addressCount()), [])

  const name = user?.name || 'Alex Johnson'
  const initial = name.charAt(0).toUpperCase()

  function handleLogout() {
    if (user) {
      logout()
      navigate('/welcome')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="pf-page">
      <header className="pf-bar">
        <h2 className="pf-title">My Profile</h2>
      </header>

      <div className="pf-body">
        <div className="pf-col pf-col-side">
          {/* Profile header card */}
          <div className="pf-card">
            <div className="pf-avatar-wrap">
              <div className="pf-avatar">{initial}</div>
              <button className="pf-avatar-edit" aria-label="Edit profile">
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
            <div className="pf-identity">
              <p className="pf-name">{name}</p>
              <p className="pf-id">Pharmacy ID: #QR-99210</p>
              <p className="pf-since">Member since Oct 2023</p>
            </div>
          </div>

          {/* Registered pharmacist verification */}
          <div className="pf-promo">
            <div className="pf-promo-content">
              <div className="pf-promo-head">
                <span className="material-symbols-outlined">verified_user</span>
                <span>Registered Pharmacist</span>
              </div>
              <p>
                Verify your pharmacy license to earn a pharmacist badge and
                unlock consultations, prescribing guidance and dispense tools.
              </p>
              <div className="pf-promo-actions">
                <button
                  className="pf-promo-btn"
                  onClick={() => navigate('/pharmacist/register')}
                >
                  Register Now
                </button>
                <span className="pf-promo-status">
                  <span className="material-symbols-outlined">pending</span>
                  Not verified
                </span>
              </div>
            </div>
            <span className="pf-blob pf-blob-1" />
            <span className="pf-blob pf-blob-2" />
          </div>
        </div>

        <div className="pf-col pf-col-main">
          {/* Account Settings */}
          <div className="pf-section">
          <h3 className="pf-section-title">Account Settings</h3>
          <div className="pf-group">
            <button
              className="pf-row"
              onClick={() => navigate('/settings/personal-info')}
            >
              <span className="pf-row-left">
                <span className="pf-row-icon">
                  <span className="material-symbols-outlined">person</span>
                </span>
                <span className="pf-row-text">
                  <span className="pf-row-title">Personal Information</span>
                  <span className="pf-row-sub">Name, Email, Date of Birth</span>
                </span>
              </span>
              <span className="pf-row-chev">
                <span className="material-symbols-outlined">chevron_right</span>
              </span>
            </button>

            <button
              className="pf-row"
              onClick={() => navigate('/settings/addresses')}
            >
              <span className="pf-row-left">
                <span className="pf-row-icon">
                  <span className="material-symbols-outlined">location_on</span>
                </span>
                <span className="pf-row-text">
                  <span className="pf-row-title">Saved Addresses</span>
                  <span className="pf-row-sub">
                    {addrCount} address{addrCount !== 1 ? 'es' : ''} saved
                  </span>
                </span>
              </span>
              <span className="pf-row-chev">
                <span className="material-symbols-outlined">chevron_right</span>
              </span>
            </button>

            <button
              className="pf-row"
              onClick={() => navigate('/settings/notifications')}
            >
              <span className="pf-row-left">
                <span className="pf-row-icon">
                  <span className="material-symbols-outlined">notifications</span>
                </span>
                <span className="pf-row-text">
                  <span className="pf-row-title">Notification Settings</span>
                  <span className="pf-row-sub">Push, SMS, Reminders</span>
                </span>
              </span>
              <span className="pf-row-chev">
                <span className="material-symbols-outlined">chevron_right</span>
              </span>
            </button>

            <button
              className="pf-row"
              onClick={() => navigate('/settings/privacy')}
            >
              <span className="pf-row-left">
                <span className="pf-row-icon">
                  <span className="material-symbols-outlined">shield</span>
                </span>
                <span className="pf-row-text">
                  <span className="pf-row-title">Privacy &amp; Security</span>
                  <span className="pf-row-sub">Password, 2FA, app lock, data</span>
                </span>
              </span>
              <span className="pf-row-chev">
                <span className="material-symbols-outlined">chevron_right</span>
              </span>
            </button>
          </div>
        </div>

        {/* Support & Help */}
        <div className="pf-section">
          <h3 className="pf-section-title">Support &amp; Help</h3>
          <div className="pf-group">
            <button
              className="pf-row pf-row-compact"
              onClick={() => navigate('/order/scan')}
            >
              <span className="pf-row-left">
                <span className="pf-row-icon">
                  <span className="material-symbols-outlined">help</span>
                </span>
                <span className="pf-row-title">How to scan QR Codes</span>
              </span>
              <span className="pf-row-chev">
                <span className="material-symbols-outlined">chevron_right</span>
              </span>
            </button>

            <button
              className="pf-row pf-row-compact"
              onClick={() => navigate('/ask-pharmacist')}
            >
              <span className="pf-row-left">
                <span className="pf-row-icon">
                  <span className="material-symbols-outlined">contact_support</span>
                </span>
                <span className="pf-row-title">Contact Pharmacist</span>
              </span>
              <span className="pf-row-chev">
                <span className="material-symbols-outlined">chevron_right</span>
              </span>
            </button>

            <button
              className="pf-row pf-row-compact"
              onClick={() => navigate('/orders')}
            >
              <span className="pf-row-left">
                <span className="pf-row-icon">
                  <span className="material-symbols-outlined">history</span>
                </span>
                <span className="pf-row-title">Scan History</span>
              </span>
              <span className="pf-row-chev">
                <span className="material-symbols-outlined">chevron_right</span>
              </span>
            </button>
          </div>
        </div>

        {/* Log out */}
        <button className="pf-logout" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          {user ? 'Log Out' : 'Log In'}
        </button>
        </div>
      </div>
    </div>
  )
}
