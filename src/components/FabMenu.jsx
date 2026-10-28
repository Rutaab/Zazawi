import { useNavigate } from 'react-router-dom'

const OPTIONS = [
  { icon: 'receipt_long', label: 'My Orders', to: '/orders' },
  { icon: 'edit_note', label: 'New Post', to: '/community/new' },
  { icon: 'support_agent', label: 'Ask Pharmacist', to: '/ask-pharmacist' },
  { icon: 'star_rate', label: 'Share Review', to: '/share-review' },
  { icon: 'qr_code_scanner', label: 'Scan QR', to: '/order/scan', scan: true },
]

export default function FabMenu({ variant, onPick }) {
  const navigate = useNavigate()

  function handlePick(opt) {
    onPick?.()
    navigate(opt.to)
  }

  return (
    <div className={`fab-menu fab-menu-${variant}`} role="menu">
      {OPTIONS.map((opt) => (
        <button
          key={opt.label}
          role="menuitem"
          className={`fab-menu-item${opt.scan ? ' scan' : ''}`}
          onClick={() => handlePick(opt)}
        >
          <span className="material-symbols-outlined">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  )
}
