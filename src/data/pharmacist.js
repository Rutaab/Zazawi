export const STEPS = [
  { id: 'identity', label: 'Identity', title: 'Professional identity' },
  { id: 'credentials', label: 'Credentials', title: 'License & credentials' },
  { id: 'review', label: 'Review', title: 'Review & submit' },
]

export const ROLES = [
  'Pharmacist (BPharm / PharmD)',
  'Clinical Pharmacist',
  'Pharmacy Superintendent / Owner',
  'Pharmacy Technician',
  'Locum / Relief Pharmacist',
]

export const BOARDS = [
  'State Board of Pharmacy',
  'National Pharmacy Council',
  'Ministry of Health — Pharmacy Directorate',
  'Pharmacy Guild / Professional Association',
  'Other licensing authority',
]

export const EXPERIENCE = [
  'Less than 1 year',
  '1 - 3 years',
  '3 - 5 years',
  '5 - 10 years',
  '10+ years',
]

export const VERIFY_METHODS = [
  {
    id: 'otp',
    icon: 'sms',
    title: 'One-time code (fastest)',
    desc: 'We send a 6-digit code to your registered phone and email.',
  },
  {
    id: 'document',
    icon: 'description',
    title: 'Document review',
    desc: 'A pharmacist reviewer checks your uploaded license within 24-48 hours.',
  },
  {
    id: 'board',
    icon: 'verified_user',
    title: 'Board lookup',
    desc: 'We verify your license number directly with the issuing authority.',
  },
]

export const REQUIREMENTS = [
  'Valid pharmacy license number',
  'Licensing authority & expiry date',
  'Government-issued photo ID',
  'Place of practice (pharmacy) details',
]

export const DOCUMENT_TYPES = [
  { id: 'license', label: 'Pharmacy license', required: true },
  { id: 'id', label: 'Government photo ID', required: true },
  { id: 'degree', label: 'Degree / qualification certificate', required: false },
]

const KEY = 'zazawi.pharmacist.draft'

export const EMPTY_DRAFT = {
  fullName: '',
  role: '',
  email: '',
  phone: '',
  nationalId: '',
  dob: '',
  licenseNo: '',
  board: '',
  issueDate: '',
  expiryDate: '',
  qualification: '',
  experience: '',
  pharmacyName: '',
  pharmacyRegNo: '',
  practiceAddress: '',
  licenseFile: '',
  verifyMethod: 'otp',
  docs: { license: false, id: false, degree: false },
  declaration: false,
  terms: false,
  consent: false,
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY_DRAFT }
    const parsed = JSON.parse(raw)
    return {
      ...EMPTY_DRAFT,
      ...parsed,
      docs: { ...EMPTY_DRAFT.docs, ...(parsed.docs || {}) },
    }
  } catch {
    return { ...EMPTY_DRAFT }
  }
}

export function saveDraft(patch) {
  const next = { ...loadDraft(), ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  return next
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

export function isStepOneValid(d) {
  return Boolean(
    d.fullName.trim() &&
      d.role &&
      /\S+@\S+\.\S+/.test(d.email.trim()) &&
      d.phone.trim().length >= 6 &&
      d.nationalId.trim(),
  )
}

export function isStepTwoValid(d) {
  return Boolean(
    d.licenseNo.trim() &&
      d.board &&
      d.issueDate &&
      d.expiryDate &&
      d.pharmacyName.trim() &&
      d.docs.license &&
      d.docs.id,
  )
}

export function isStepThreeValid(d) {
  return Boolean(d.declaration && d.terms && d.consent)
}

export function makeReference() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `PH-${new Date().getFullYear()}-${n}`
}
