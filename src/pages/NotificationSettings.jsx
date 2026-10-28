import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar.jsx'

const DEFAULT_PREFS = {
  pushOrderUpdates: true,
  pushMessages: true,
  pushCommunity: false,
  smsPickup: true,
  smsConfirmations: true,
  emailPromos: false,
  emailWeekly: true,
  sound: true,
  previews: true,
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem('zazawi.notifprefs')
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return DEFAULT_PREFS
}

const SECTIONS = [
  {
    title: 'Push notifications',
    rows: [
      {
        key: 'pushOrderUpdates',
        icon: 'receipt_long',
        title: 'Order status updates',
        sub: 'Processing, ready for pickup, completed',
      },
      {
        key: 'pushMessages',
        icon: 'chat_bubble',
        title: 'New messages',
        sub: 'Pharmacist replies and support chats',
      },
      {
        key: 'pushCommunity',
        icon: 'forum',
        title: 'Community activity',
        sub: 'Likes and comments on your posts',
      },
    ],
  },
  {
    title: 'SMS',
    rows: [
      {
        key: 'smsPickup',
        icon: 'alarm',
        title: 'Pickup reminders',
        sub: 'A text when your order is waiting',
      },
      {
        key: 'smsConfirmations',
        icon: 'mark_chat_read',
        title: 'Order confirmations',
        sub: 'Confirmation when an order is placed',
      },
    ],
  },
  {
    title: 'Email',
    rows: [
      {
        key: 'emailPromos',
        icon: 'campaign',
        title: 'Promotions & tips',
        sub: 'Offers from partner pharmacies',
      },
      {
        key: 'emailWeekly',
        icon: 'mail',
        title: 'Weekly summary',
        sub: 'Your orders and health tips, once a week',
      },
    ],
  },
  {
    title: 'In-app',
    rows: [
      {
        key: 'sound',
        icon: 'volume_up',
        title: 'Sounds',
        sub: 'Play a tone for new messages',
      },
      {
        key: 'previews',
        icon: 'visibility',
        title: 'Message previews',
        sub: 'Show message text in notification banners',
      },
    ],
  },
]

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState(loadPrefs)

  useEffect(() => {
    try {
      localStorage.setItem('zazawi.notifprefs', JSON.stringify(prefs))
    } catch {
      /* ignore */
    }
  }, [prefs])

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  return (
    <>
      <TopBar
        back
        subtitle="Account Settings"
        title="Notification Settings"
        notifications={false}
      />

      <p className="addr-count">
        Choose how Zazawi keeps you updated. Changes save automatically.
      </p>

      {SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="settings-section">{section.title}</div>
          {section.rows.map((row) => (
            <div key={row.key} className="settings-row">
              <span className="icon-tile">
                <span className="material-symbols-outlined">{row.icon}</span>
              </span>
              <span className="info">
                <strong>{row.title}</strong>
                <small>{row.sub}</small>
              </span>
              <button
                className={`switch${prefs[row.key] ? ' on' : ''}`}
                role="switch"
                aria-checked={prefs[row.key]}
                aria-label={row.title}
                onClick={() => toggle(row.key)}
              />
            </div>
          ))}
        </div>
      ))}

      <div style={{ height: '1.5rem' }} />
    </>
  )
}
