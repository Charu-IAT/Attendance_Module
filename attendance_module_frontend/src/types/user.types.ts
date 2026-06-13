// ─── User & Auth Types ────────────────────────────────────────────────────────

/** A user record returned by the backend. */
export interface UserDTO {
  userId: number;
  userName: string;
  email: string;
  roleName: string;
  courseName: string | null;
}

/** Payload for POST /api/auth/login */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Successful authentication response from the backend. */
export interface AuthResponse {
  token: string;
  userName: string;
  roleName: string;
  /** The numeric ID of the authenticated user — used for trainer-scoped API calls. */
  userId?: number;
}

/** Payload for PUT /user/updateUser/{userId} */
export interface UpdateUserPayload {
  userName: string;
  email: string;
  roleId: number;
  /** Optional: ID of the course to assign to this user */
  courseId?: number | null;
}

/** Payload for POST /api/auth/register — creates a new user account */
export interface UserRequestPayload {
  userName: string;
  email: string;
  userPassword: string;
  roleId: number;
  courseId?: number | null;
}
