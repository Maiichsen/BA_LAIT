export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_id: string
          company_name: string
          created_at: string
          registration_key: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string
          company_name: string
          created_at?: string
          registration_key?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          company_name?: string
          created_at?: string
          registration_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contents: {
        Row: {
          content_id: string
          content_json: Json
          course_page_id: string
        }
        Insert: {
          content_id?: string
          content_json: Json
          course_page_id: string
        }
        Update: {
          content_id?: string
          content_json?: Json
          course_page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contents_course_page_id_fkey"
            columns: ["course_page_id"]
            isOneToOne: false
            referencedRelation: "course_pages"
            referencedColumns: ["course_page_id"]
          },
        ]
      }
      course_pages: {
        Row: {
          course_id: string
          course_page_id: string
          course_page_title: string
          is_required: boolean | null
          is_visible: boolean | null
          order_index: number
          updated_at: string
        }
        Insert: {
          course_id: string
          course_page_id?: string
          course_page_title?: string
          is_required?: boolean | null
          is_visible?: boolean | null
          order_index: number
          updated_at?: string
        }
        Update: {
          course_id?: string
          course_page_id?: string
          course_page_title?: string
          is_required?: boolean | null
          is_visible?: boolean | null
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_pages_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
        ]
      }
      course_progress: {
        Row: {
          course_page_id: string
          course_progress_id: string
          user_id: string
        }
        Insert: {
          course_page_id: string
          course_progress_id?: string
          user_id: string
        }
        Update: {
          course_page_id?: string
          course_progress_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_page_id_fkey"
            columns: ["course_page_id"]
            isOneToOne: false
            referencedRelation: "course_pages"
            referencedColumns: ["course_page_id"]
          },
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      course_seats: {
        Row: {
          activation_at: string | null
          company_id: string
          completed_at: string | null
          course_id: string
          course_seat_id: string
          created_at: string
          reserved_for_email: string | null
          user_id: string | null
        }
        Insert: {
          activation_at?: string | null
          company_id: string
          completed_at?: string | null
          course_id: string
          course_seat_id?: string
          created_at?: string
          reserved_for_email?: string | null
          user_id?: string | null
        }
        Update: {
          activation_at?: string | null
          company_id?: string
          completed_at?: string | null
          course_id?: string
          course_seat_id?: string
          created_at?: string
          reserved_for_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_seats_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "course_seats_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_seats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      courses: {
        Row: {
          author_name: string | null
          course_id: string
          cover_image_url: string | null
          created_at: string
          estimated_time_minutes: number | null
          is_published: boolean
          long_course_description: string
          short_course_description: string
          soft_deleted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          course_id?: string
          cover_image_url?: string | null
          created_at?: string
          estimated_time_minutes?: number | null
          is_published?: boolean
          long_course_description?: string
          short_course_description: string
          soft_deleted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          course_id?: string
          cover_image_url?: string | null
          created_at?: string
          estimated_time_minutes?: number | null
          is_published?: boolean
          long_course_description?: string
          short_course_description?: string
          soft_deleted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      invited_users: {
        Row: {
          company_id: string
          invited_user_id: string
          is_company_user: boolean
          user_email: string
        }
        Insert: {
          company_id: string
          invited_user_id?: string
          is_company_user?: boolean
          user_email: string
        }
        Update: {
          company_id?: string
          invited_user_id?: string
          is_company_user?: boolean
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "invited_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      question_types: {
        Row: {
          description: string
          question_type_id: string
          title: string | null
        }
        Insert: {
          description: string
          question_type_id?: string
          title?: string | null
        }
        Update: {
          description?: string
          question_type_id?: string
          title?: string | null
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          answer_option: string | null
          quiz_answer_id: string
          quiz_question_id: string
          right_option: boolean
        }
        Insert: {
          answer_option?: string | null
          quiz_answer_id?: string
          quiz_question_id: string
          right_option: boolean
        }
        Update: {
          answer_option?: string | null
          quiz_answer_id?: string
          quiz_question_id?: string
          right_option?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_quiz_question_id_fkey"
            columns: ["quiz_question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["quiz_question_id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          descriptive_text: string | null
          order_index: number
          passing_percentage: number | null
          question: string | null
          question_type_id: string
          quiz_id: string
          quiz_question_id: string
        }
        Insert: {
          descriptive_text?: string | null
          order_index: number
          passing_percentage?: number | null
          question?: string | null
          question_type_id: string
          quiz_id: string
          quiz_question_id?: string
        }
        Update: {
          descriptive_text?: string | null
          order_index?: number
          passing_percentage?: number | null
          question?: string | null
          question_type_id?: string
          quiz_id?: string
          quiz_question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_question_type_id_fkey"
            columns: ["question_type_id"]
            isOneToOne: false
            referencedRelation: "question_types"
            referencedColumns: ["question_type_id"]
          },
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      quizzes: {
        Row: {
          certification_requirement: boolean
          course_page_id: string
          passing_percentage: number | null
          quiz_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          certification_requirement?: boolean
          course_page_id: string
          passing_percentage?: number | null
          quiz_id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          certification_requirement?: boolean
          course_page_id?: string
          passing_percentage?: number | null
          quiz_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_page_id_fkey"
            columns: ["course_page_id"]
            isOneToOne: false
            referencedRelation: "course_pages"
            referencedColumns: ["course_page_id"]
          },
        ]
      }
      users: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          first_name: string | null
          is_admin: boolean
          is_company_user: boolean
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          is_admin?: boolean
          is_company_user?: boolean
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          is_admin?: boolean
          is_company_user?: boolean
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
