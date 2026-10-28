import QRCode from 'qrcode'
import jsQR from 'jsqr'

export function pharmacyPayload(pharmacy) {
  return JSON.stringify({
    type: 'zazawi:pharmacy',
    id: pharmacy.id,
    name: pharmacy.name,
    address: pharmacy.address,
  })
}

export function pickupPayload(order) {
  return JSON.stringify({
    type: 'zazawi:pickup',
    orderId: order.id,
    pharmacy: order.pharmacy?.name || 'Zazawi Pharmacy',
    patient: order.patient?.name || 'Guest',
    items: order.items.map((i) => `${i.name} (${i.dosage || 'as directed'}) x${i.qty}`),
  })
}

export async function generateQRDataUrl(text, options = {}) {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: options.width || 280,
    errorCorrectionLevel: 'M',
    color: { dark: '#111718', light: '#ffffff' },
    ...options,
  })
}

export function decodeQRFromCanvas(canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  })
  return code ? code.data : null
}

export function decodeQRFromImage(img) {
  const canvas = document.createElement('canvas')
  const scale = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight))
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale))
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return decodeQRFromCanvas(canvas)
}

export function parsePayload(raw) {
  try {
    const data = JSON.parse(raw)
    if (data && typeof data.type === 'string') return data
  } catch {
    /* not JSON */
  }
  return { type: 'zazawi:raw', value: raw }
}
