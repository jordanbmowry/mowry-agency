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
      _owner_required_migrations: {
        Row: {
          created_at: string
          note: string | null
          tag: string
        }
        Insert: {
          created_at?: string
          note?: string | null
          tag: string
        }
        Update: {
          created_at?: string
          note?: string | null
          tag?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          agent_notes: string | null
          city: string | null
          compliance_review_status: string | null
          coverage_type: string | null
          created_at: string
          current_medications: string | null
          date_of_birth: string | null
          email: string
          email_marketing_consent: boolean
          exported_to_csv: boolean | null
          first_name: string | null
          form_version: string | null
          health_conditions: string | null
          height: number | null
          id: string
          ip_address: string | null
          last_name: string | null
          lead_source: string
          lead_type: string | null
          loan_amount: number | null
          message: string | null
          name: string | null
          phone: string
          sex: string | null
          state: string | null
          status: string
          tcpa_consent: boolean
          tcpa_consent_timestamp: string | null
          tcpa_text: string | null
          unsubscribed_at: string | null
          updated_at: string
          user_agent: string | null
          weight: number | null
        }
        Insert: {
          agent_notes?: string | null
          city?: string | null
          compliance_review_status?: string | null
          coverage_type?: string | null
          created_at?: string
          current_medications?: string | null
          date_of_birth?: string | null
          email: string
          email_marketing_consent?: boolean
          exported_to_csv?: boolean | null
          first_name?: string | null
          form_version?: string | null
          health_conditions?: string | null
          height?: number | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          lead_source: string
          lead_type?: string | null
          loan_amount?: number | null
          message?: string | null
          name?: string | null
          phone: string
          sex?: string | null
          state?: string | null
          status?: string
          tcpa_consent?: boolean
          tcpa_consent_timestamp?: string | null
          tcpa_text?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
          weight?: number | null
        }
        Update: {
          agent_notes?: string | null
          city?: string | null
          compliance_review_status?: string | null
          coverage_type?: string | null
          created_at?: string
          current_medications?: string | null
          date_of_birth?: string | null
          email?: string
          email_marketing_consent?: boolean
          exported_to_csv?: boolean | null
          first_name?: string | null
          form_version?: string | null
          health_conditions?: string | null
          height?: number | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          lead_source?: string
          lead_type?: string | null
          loan_amount?: number | null
          message?: string | null
          name?: string | null
          phone?: string
          sex?: string | null
          state?: string | null
          status?: string
          tcpa_consent?: boolean
          tcpa_consent_timestamp?: string | null
          tcpa_text?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      leads_compliance_report: {
        Row: {
          compliance_review_status: string | null
          compliance_score: number | null
          consent_age_category: string | null
          created_at: string | null
          days_since_consent: number | null
          days_since_unsubscribed: number | null
          email: string | null
          email_marketing_consent: boolean | null
          first_name: string | null
          form_version: string | null
          generated_at: string
          id: string
          ip_address: string | null
          last_name: string | null
          lead_id: string | null
          lead_source: string | null
          phone: string | null
          state: string | null
          status: string | null
          tcpa_consent: boolean | null
          tcpa_consent_timestamp: string | null
          tcpa_text: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          compliance_review_status?: string | null
          compliance_score?: number | null
          consent_age_category?: string | null
          created_at?: string | null
          days_since_consent?: number | null
          days_since_unsubscribed?: number | null
          email?: string | null
          email_marketing_consent?: boolean | null
          first_name?: string | null
          form_version?: string | null
          generated_at?: string
          id?: string
          ip_address?: string | null
          last_name?: string | null
          lead_id?: string | null
          lead_source?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          tcpa_consent?: boolean | null
          tcpa_consent_timestamp?: string | null
          tcpa_text?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          compliance_review_status?: string | null
          compliance_score?: number | null
          consent_age_category?: string | null
          created_at?: string | null
          days_since_consent?: number | null
          days_since_unsubscribed?: number | null
          email?: string | null
          email_marketing_consent?: boolean | null
          first_name?: string | null
          form_version?: string | null
          generated_at?: string
          id?: string
          ip_address?: string | null
          last_name?: string | null
          lead_id?: string | null
          lead_source?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          tcpa_consent?: boolean | null
          tcpa_consent_timestamp?: string | null
          tcpa_text?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_compliance_report_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "compliance_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_compliance_report_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_compliance_report_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads_audit_report"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_compliance_report_runs: {
        Row: {
          id: string
          invoked_by: string | null
          result: Json | null
          rows_inserted: number | null
          rows_updated: number | null
          run_at: string
        }
        Insert: {
          id?: string
          invoked_by?: string | null
          result?: Json | null
          rows_inserted?: number | null
          rows_updated?: number | null
          run_at?: string
        }
        Update: {
          id?: string
          invoked_by?: string | null
          result?: Json | null
          rows_inserted?: number | null
          rows_updated?: number | null
          run_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      unsubscribes: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          reason: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          reason?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          reason?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      compliance_dashboard: {
        Row: {
          compliance_review_status: string | null
          compliance_score: number | null
          compliance_status: string | null
          created_at: string | null
          days_since_consent: number | null
          email: string | null
          email_marketing_consent: boolean | null
          first_name: string | null
          form_version: string | null
          id: string | null
          last_name: string | null
          lead_source: string | null
          phone: string | null
          state: string | null
          status: string | null
          tcpa_consent: boolean | null
          tcpa_consent_timestamp: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          compliance_review_status?: string | null
          compliance_score?: never
          compliance_status?: never
          created_at?: string | null
          days_since_consent?: never
          email?: string | null
          email_marketing_consent?: boolean | null
          first_name?: string | null
          form_version?: string | null
          id?: string | null
          last_name?: string | null
          lead_source?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          tcpa_consent?: boolean | null
          tcpa_consent_timestamp?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          compliance_review_status?: string | null
          compliance_score?: never
          compliance_status?: never
          created_at?: string | null
          days_since_consent?: never
          email?: string | null
          email_marketing_consent?: boolean | null
          first_name?: string | null
          form_version?: string | null
          id?: string | null
          last_name?: string | null
          lead_source?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          tcpa_consent?: boolean | null
          tcpa_consent_timestamp?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      leads_audit_report: {
        Row: {
          compliance_status: string | null
          created_at: string | null
          days_since_consent: number | null
          days_since_unsubscribed: number | null
          email: string | null
          email_marketing_consent: boolean | null
          first_name: string | null
          id: string | null
          last_name: string | null
          lead_source: string | null
          phone: string | null
          state: string | null
          status: string | null
          tcpa_consent: boolean | null
          tcpa_consent_timestamp: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          compliance_status?: never
          created_at?: string | null
          days_since_consent?: never
          days_since_unsubscribed?: never
          email?: string | null
          email_marketing_consent?: boolean | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          lead_source?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          tcpa_consent?: boolean | null
          tcpa_consent_timestamp?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          compliance_status?: never
          created_at?: string | null
          days_since_consent?: never
          days_since_unsubscribed?: never
          email?: string | null
          email_marketing_consent?: boolean | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          lead_source?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          tcpa_consent?: boolean | null
          tcpa_consent_timestamp?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_age: { Args: { birth_date: string }; Returns: number }
      calculate_compliance_score: {
        Args: {
          p_days_since_consent: number
          p_ip_address: string
          p_tcpa_consent: boolean
          p_tcpa_text: string
          p_unsubscribed_at: string
        }
        Returns: number
      }
      create_admin_user: { Args: never; Returns: undefined }
      generate_compliance_report: {
        Args: never
        Returns: {
          report_summary: Json
        }[]
      }
      generate_weekly_leads_compliance_report: { Args: never; Returns: Json }
      update_form_version: { Args: { new_version: string }; Returns: string }
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
