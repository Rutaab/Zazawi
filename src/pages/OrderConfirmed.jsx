import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useOrder } from '../context/OrderContext.jsx'
import { generateQRDataUrl, pickupPayload } from '../lib/qr.js'

export default function OrderConfirmed() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lastOrder } = useOrder()
  const [qr, setQr] = useState(null)

  const order = lastOrder || {
    id: location.state?.orderId || '#ZAZ-000000',
    pharmacy: { name: 'Zazawi Pharmacy', address: '' },
    patient: { name: 'Guest' },
    items: [],
    status: 'Processing',
  }

  useEffect(() => {
    let alive = true
    generateQRDataUrl(pickupPayload(order), { width: 320 }).then((url) => {
      if (alive) setQr(url)
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id])

  return (
    <div className="confirm-page">
      <div className="confirm-check">
        <span className="material-symbols-outlined">check_circle</span>
      </div>
      <h1>Order placed!</h1>
      <p className="sub">
        Your prescription was sent to the pharmacy. Show this QR code at the
        counter for pickup.
      </p>

      <div className="card pickup-card">
        <div className="order-id">{order.id}</div>
        <div className="qr-box">
          {qr ? (
            <img src={qr} alt={`Pickup QR code for order ${order.id}`} />
          ) : (
            <div className="qr-loading">Generating pickup code…</div>
          )}
        </div>
        <div className="pharmacy-name">{order.pharmacy?.name}</div>
        {order.pharmacy?.address && (
          <div className="pharmacy-addr">{order.pharmacy.address}</div>
        )}
      </div>

      <div className="confirm-actions">
        <Link to="/orders" className="btn btn-primary btn-block">
          <span className="material-symbols-outlined">receipt_long</span>
          Track my order
        </Link>
        <Link to="/dashboard" className="btn btn-ghost btn-block">
          <span className="material-symbols-outlined">home</span>
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
