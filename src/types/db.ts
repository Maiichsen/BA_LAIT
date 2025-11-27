import type {Database} from '../../database.types.ts';

//Easier to use types for each table
//Read = Row
//Create = Insert
//Update = Update

// COMPANY
export type Company = Database['public']['Tables']['companies']['Row'];
export type NewCompany = Database['public']['Tables']['companies']['Insert'];
export type UpdateCompany = Database['public']['Tables']['companies']['Update'];

// CONTENT
export type Content = Database['public']['Tables']['contents']['Row'];
export type NewContent = Database['public']['Tables']['contents']['Insert'];
export type UpdateContent = Database['public']['Tables']['contents']['Update'];

// COURSE KEY
export type CourseKey = Database['public']['Tables']['course_keys']['Row'];
export type NewCourseKey = Database['public']['Tables']['course_keys']['Insert'];
export type UpdateCourseKey = Database['public']['Tables']['course_keys']['Update'];

// COURSE PAGES
export type CoursePage = Database['public']['Tables']['course_pages']['Row'];
export type NewCoursePage = Database['public']['Tables']['course_pages']['Insert'];
export type UpdateCoursePage = Database['public']['Tables']['course_pages']['Update'];

// COURSE PROGRESS
export type CourseProgress = Database['public']['Tables']['course_progress']['Row'];
export type NewCourseProgress = Database['public']['Tables']['course_progress']['Insert'];
export type UpdateCourseProgress = Database['public']['Tables']['course_progress']['Update'];

// COURSES
export type Course = Database['public']['Tables']['courses']['Row'];
export type NewCourse = Database['public']['Tables']['courses']['Insert'];
export type UpdateCourse = Database['public']['Tables']['courses']['Update'];

// ENROLLMENTS
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type NewEnrollment = Database['public']['Tables']['enrollments']['Insert'];
export type UpdateEnrollment = Database['public']['Tables']['enrollments']['Update'];

// QUESTION TYPES
export type QuestionType = Database['public']['Tables']['question_types']['Row'];
export type NewEQuestionType = Database['public']['Tables']['question_types']['Insert'];
export type UpdateQuestionType = Database['public']['Tables']['question_types']['Update'];

// QUIZ ANSWERS
export type QuizAnswer = Database['public']['Tables']['quiz_answers']['Row'];
export type NewQuizAnswer = Database['public']['Tables']['quiz_answers']['Insert'];
export type UpdateQuizAnswer = Database['public']['Tables']['quiz_answers']['Update'];

// QUIZ QUESTIONS
export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];
export type NewQuizQuestion = Database['public']['Tables']['quiz_questions']['Insert'];
export type UpdateQuizQuestion = Database['public']['Tables']['quiz_questions']['Update'];

// QUIZZES
export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type NewQuiz = Database['public']['Tables']['quizzes']['Insert'];
export type UpdateQuiz = Database['public']['Tables']['quizzes']['Update'];

// USERS
export type User = Database['public']['Tables']['users']['Row'];
export type NewUser = Database['public']['Tables']['users']['Insert'];
export type UpdateUser = Database['public']['Tables']['users']['Update'];
