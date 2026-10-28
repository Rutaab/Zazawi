const KEY_STORAGE = 'zazawi.e2e.key'

function bufToB64(buf) {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function b64ToBuf(b64) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function getE2EKey() {
  let raw = null
  try {
    const stored = localStorage.getItem(KEY_STORAGE)
    if (stored) raw = b64ToBuf(stored)
  } catch {
    /* ignore */
  }
  if (!raw) {
    raw = crypto.getRandomValues(new Uint8Array(32))
    try {
      localStorage.setItem(KEY_STORAGE, bufToB64(raw))
    } catch {
      /* ignore */
    }
  }
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ])
}

export async function encryptText(text) {
  const key = await getE2EKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(text),
  )
  return { iv: bufToB64(iv), ct: bufToB64(ct) }
}

export async function decryptText({ iv, ct }) {
  const key = await getE2EKey()
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToBuf(iv) },
    key,
    b64ToBuf(ct),
  )
  return new TextDecoder().decode(plain)
}

export async function encryptObject(obj) {
  return encryptText(JSON.stringify(obj))
}

export async function decryptObject(enc) {
  return JSON.parse(await decryptText(enc))
}
