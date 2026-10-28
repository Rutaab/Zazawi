import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { useOrder } from '../context/OrderContext.jsx'
import { MOCK_ORDERS } from '../data/pharmacies.js'

function statusPill(status) {
  const map = {
    Processing: 'pill-warning',
    'Ready for Pickup': 'pill-success',
    Completed: 'pill-primary',
    Cancelled: 'pill-danger',
  }
  return <span className={`pill ${map[status] || 'pill-primary'}`}>{status}</span>
}

export default function Orders() {
  const { orders } = useOrder()
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)
  const all = [...orders, ...MOCK_ORDERS]

  useEffect(() => {
    if (!sheetOpen) return
    function onKeyDown(e) {
      if (e.key === 'Escape') setSheetOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [sheetOpen])

  function choose(path) {
    setSheetOpen(false)
    navigate(path)
  }

  return (
    <>
      <TopBar subtitle="History" title="My Orders" />
      {all.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined">receipt_long</span>
          <h3>No orders yet</h3>
          <p>Scan a pharmacy QR or enter a prescription to get started.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '1.25rem' }}
            onClick={() => setSheetOpen(true)}
          >
            <span className="material-symbols-outlined">add</span>
            New order
          </button>
        </div>
      ) : (
        <>
          {all.map((order) => (
            <div key={order.id} className="card order-list-item">
              <div className="head">
                <span className="id">{order.id}</span>
                {statusPill(order.status)}
              </div>
              <div className="ph">{order.pharmacy?.name}</div>
              <div className="items">
                {order.items
                  .map((i) => `${i.name}${i.dosage ? ` ${i.dosage}` : ''} ×${i.qty}`)
                  .join(' · ')}
              </div>
            </div>
          ))}
          <div style={{ padding: '0.5rem 1.25rem 1rem' }}>
            <button
              className="btn btn-primary btn-block"
              onClick={() => setSheetOpen(true)}
            >
              <span className="material-symbols-outlined">add</span>
              New order
            </button>
          </div>
        </>
      )}

      {sheetOpen && (
        <>
          <button
            className="sheet-scrim"
            aria-label="Close"
            onClick={() => setSheetOpen(false)}
          />
          <div className="order-sheet" role="dialog" aria-modal="true">
            <div className="sheet-handle" />
            <h3>Start a new order</h3>
            <p>How would you like to send your prescription?</p>

            <button
              className="order-sheet-opt"
              onClick={() => choose('/order/scan')}
            >
              <span className="icon-tile">
                <span className="material-symbols-outlined">qr_code_scanner</span>
              </span>
              <span className="opt-body">
                <strong>Scan pharmacy QR</strong>
                <small>Point at the code on the pharmacy counter</small>
              </span>
              <span className="material-symbols-outlined opt-arrow">
                chevron_right
              </span>
            </button>

            <button
              className="order-sheet-opt"
              onClick={() => choose('/order/manual')}
            >
              <span className="icon-tile">
                <span className="material-symbols-outlined">edit_note</span>
              </span>
              <span className="opt-body">
                <strong>Enter prescription manually</strong>
                <small>Type medicines, dosage and patient details</small>
              </span>
              <span className="material-symbols-outlined opt-arrow">
                chevron_right
              </span>
            </button>

            <button
              className="btn btn-ghost btn-block"
              onClick={() => setSheetOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  )
}
