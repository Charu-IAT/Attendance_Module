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

export interface AuthInfo {
  token: string;
  userName: string;
  roleName: string;
  userId?: number;
}

/** Persist all auth fields returned on login. */
export function setAuth(info: AuthInfo): void {
  localStorage.setItem(KEYS.TOKEN,     info.token);
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
  return localStorage.getItem(KEYS.TOKEN);
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
