/**
 * Centralises all localStorage auth read/write operations.
 * Avoids scattered localStorage calls across Login, Layout, and page components.
 */

const KEYS = {
  TOKEN:     'token',
  USER_NAME: 'userName',
  ROLE_NAME: 'roleName',
  USER_ID:   'userId',
} as const;

const ENCRYPTION_KEY = 'attendance-secret-salt-key-987';

function encryptToken(token: string): string {
  if (!token) return '';
  let hex = '';
  for (let i = 0; i < token.length; i++) {
    const charCode = token.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    hex += charCode.toString(16).padStart(2, '0');
  }
  return hex;
}

function decryptToken(encryptedToken: string | null): string | null {
  if (!encryptedToken) return null;
  if (encryptedToken.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(encryptedToken)) {
    return encryptedToken;
  }
  try {
    let decrypted = '';
    for (let i = 0; i < encryptedToken.length; i += 2) {
      const hexPart = encryptedToken.substring(i, i + 2);
      const charCode = parseInt(hexPart, 16) ^ ENCRYPTION_KEY.charCodeAt((i / 2) % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch (e) {
    return encryptedToken;
  }
}

export interface AuthInfo {
  token: string;
  userName: string;
  roleName: string;
  userId?: number;
}

/** Persist all auth fields returned on login. */
export function setAuth(info: AuthInfo): void {
  localStorage.setItem(KEYS.TOKEN,     encryptToken(info.token));
  localStorage.setItem(KEYS.USER_NAME, info.userName);
  localStorage.setItem(KEYS.ROLE_NAME, info.roleName);
  if (info.userId !== undefined) {
    localStorage.setItem(KEYS.USER_ID, String(info.userId));
  }
}

/** Remove all auth data (logout). */
export function clearAuth(): void {
  localStorage.removeItem(KEYS.TOKEN);
  localStorage.removeItem(KEYS.USER_NAME);
  localStorage.removeItem(KEYS.ROLE_NAME);
  localStorage.removeItem(KEYS.USER_ID);
}

export function getToken(): string | null {
  return decryptToken(localStorage.getItem(KEYS.TOKEN));
}

export function getUserName(): string {
  return localStorage.getItem(KEYS.USER_NAME) ?? 'User';
}

export function getRole(): string {
  return localStorage.getItem(KEYS.ROLE_NAME) ?? '';
}

/** Returns the numeric userId of the logged-in user, or null if not set. */
export function getUserId(): number | null {
  const raw = localStorage.getItem(KEYS.USER_ID);
  if (raw === null) return null;
  const parsed = Number(raw);
  return isNaN(parsed) ? null : parsed;
}

/** Persist userId separately (e.g. after resolving it from the users list). */
export function setUserId(id: number): void {
  localStorage.setItem(KEYS.USER_ID, String(id));
}

export function isAdmin(): boolean {
  return getRole() === 'admin';
}
