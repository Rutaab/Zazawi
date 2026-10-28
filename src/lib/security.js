const KEY = 'zazawi.security.v1'

export const DEFAULT_SECURITY = {
  twoFactor: { enabled: false, method: null },
  loginAlerts: { enabled: false, channel: null },
  appLock: { enabled: false, method: null },
  dataAnalytics: true,
  profileVisibility: 'everyone',
}

export function loadSecurity() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT_SECURITY, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SECURITY }
}

export function saveSecurity(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    /* ignore */
  }
  return settings
}

export function activeProtectionCount(s) {
  return [s.twoFactor.enabled, s.loginAlerts.enabled, s.appLock.enabled].filter(
    Boolean,
  ).length
}

export const METHOD_LABELS = {
  twoFactor: {
    sms: 'SMS code',
    authenticator: 'Authenticator app',
    email: 'Email code',
  },
  loginAlerts: {
    push: 'Push notification',
    email: 'Email',
    sms: 'SMS text',
  },
  appLock: {
    fingerprint: 'Fingerprint',
    face: 'Face unlock',
    pin: '5-digit PIN',
  },
}
