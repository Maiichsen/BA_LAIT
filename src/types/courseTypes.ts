export interface newCourseParams {
  long_course_description: string
  short_course_description: string
  cover_image_url: string | null
  estimated_time_minutes: number | null
  title: string
}

export interface newCourseSeatParams {
  company_id: string
  course_id: string
  reserved_for_email: string | null
  user_id: string | null
}
