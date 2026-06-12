// ─── Course Types ─────────────────────────────────────────────────────────────

/** A course record returned by the backend. */
export interface CourseDTO {
  courseId: number;
  courseName: string;
  courseDuration: number;
}

/** Payload for POST /course/addcourse and PUT /course/getcourse/{courseId} */
export interface CoursePayload {
  courseName: string;
  courseDuration: number;
}
