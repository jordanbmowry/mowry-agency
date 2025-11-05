export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      _owner_required_migrations: {
        Row: {
          created_at: string;
          note: string | null;
          tag: string;
        };
        Insert: {
          created_at?: string;
          note?: string | null;
          tag: string;
        };
        Update: {
          created_at?: string;
          note?: string | null;
          tag?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          agent_notes: string | null;
          city: string;
          compliance_review_status: string | null;
          coverage_type: string;
          created_at: string;
          current_medications: string;
          date_of_birth: string;
          email: string;
          email_marketing_consent: boolean;
          exported_to_csv: boolean | null;
          first_name: string;
          form_version: string | null;
          health_conditions: string;
          height: number;
          id: string;
          ip_address: string | null;
          last_name: string;
          lead_source: string;
          lead_type: string | null;
          loan_amount: number | null;
          message: string | null;
          name: string | null;
          phone: string;
          sex: string;
          state: string;
          status: string;
          tcpa_consent: boolean;
          tcpa_consent_timestamp: string | null;
          tcpa_text: string | null;
          unsubscribed_at: string | null;
          updated_at: string;
          user_agent: string | null;
          weight: number;
        };
        Insert: {
          agent_notes?: string | null;
          city: string;
          compliance_review_status?: string | null;
          coverage_type: string;
          created_at?: string;
          current_medications: string;
          date_of_birth: string;
          email: string;
          email_marketing_consent?: boolean;
          exported_to_csv?: boolean | null;
          first_name: string;
          form_version?: string | null;
          health_conditions: string;
          height: number;
          id?: string;
          ip_address?: string | null;
          last_name: string;
          lead_source: string;
          lead_type?: string | null;
          loan_amount?: number | null;
          message?: string | null;
          name?: string | null;
          phone: string;
          sex: string;
          state: string;
          status?: string;
          tcpa_consent?: boolean;
          tcpa_consent_timestamp?: string | null;
          tcpa_text?: string | null;
          unsubscribed_at?: string | null;
          updated_at?: string;
          user_agent?: string | null;
          weight: number;
        };
        Update: {
          agent_notes?: string | null;
          city?: string;
          compliance_review_status?: string | null;
          coverage_type?: string;
          created_at?: string;
          current_medications?: string;
          date_of_birth?: string;
          email?: string;
          email_marketing_consent?: boolean;
          exported_to_csv?: boolean | null;
          first_name?: string;
          form_version?: string | null;
          health_conditions?: string;
          height?: number;
          id?: string;
          ip_address?: string | null;
          last_name?: string;
          lead_source?: string;
          lead_type?: string | null;
          loan_amount?: number | null;
          message?: string | null;
          name?: string | null;
          phone?: string;
          sex?: string;
          state?: string;
          status?: string;
          tcpa_consent?: boolean;
          tcpa_consent_timestamp?: string | null;
          tcpa_text?: string | null;
          unsubscribed_at?: string | null;
          updated_at?: string;
          user_agent?: string | null;
          weight?: number;
        };
        Relationships: [];
      };
      leads_compliance_report: {
        Row: {
          compliance_review_status: string | null;
          compliance_score: number | null;
          consent_age_category: string | null;
          created_at: string | null;
          days_since_consent: number | null;
          days_since_unsubscribed: number | null;
          email: string | null;
          email_marketing_consent: boolean | null;
          first_name: string | null;
          form_version: string | null;
          generated_at: string;
          id: string;
          ip_address: string | null;
          last_name: string | null;
          lead_id: string | null;
          lead_source: string | null;
          phone: string | null;
          state: string | null;
          status: string | null;
          tcpa_consent: boolean | null;
          tcpa_consent_timestamp: string | null;
          tcpa_text: string | null;
          unsubscribed_at: string | null;
        };
        Insert: {
          compliance_review_status?: string | null;
          compliance_score?: number | null;
          consent_age_category?: string | null;
          created_at?: string | null;
          days_since_consent?: number | null;
          days_since_unsubscribed?: number | null;
          email?: string | null;
          email_marketing_consent?: boolean | null;
          first_name?: string | null;
          form_version?: string | null;
          generated_at?: string;
          id?: string;
          ip_address?: string | null;
          last_name?: string | null;
          lead_id?: string | null;
          lead_source?: string | null;
          phone?: string | null;
          state?: string | null;
          status?: string | null;
          tcpa_consent?: boolean | null;
          tcpa_consent_timestamp?: string | null;
          tcpa_text?: string | null;
          unsubscribed_at?: string | null;
        };
        Update: {
          compliance_review_status?: string | null;
          compliance_score?: number | null;
          consent_age_category?: string | null;
          created_at?: string | null;
          days_since_consent?: number | null;
          days_since_unsubscribed?: number | null;
          email?: string | null;
          email_marketing_consent?: boolean | null;
          first_name?: string | null;
          form_version?: string | null;
          generated_at?: string;
          id?: string;
          ip_address?: string | null;
          last_name?: string | null;
          lead_id?: string | null;
          lead_source?: string | null;
          phone?: string | null;
          state?: string | null;
          status?: string | null;
          tcpa_consent?: boolean | null;
          tcpa_consent_timestamp?: string | null;
          tcpa_text?: string | null;
          unsubscribed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'leads_compliance_report_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'compliance_dashboard';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leads_compliance_report_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leads_compliance_report_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads_audit_report';
            referencedColumns: ['id'];
          },
        ];
      };
      leads_compliance_report_runs: {
        Row: {
          created_at: string;
          id: number;
          result: Json;
          rows_inserted: number | null;
          rows_updated: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          result: Json;
          rows_inserted?: number | null;
          rows_updated?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          result?: Json;
          rows_inserted?: number | null;
          rows_updated?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          role: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id: string;
          role?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          role?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      unsubscribes: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          ip_address: string | null;
          reason: string | null;
          user_agent: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          ip_address?: string | null;
          reason?: string | null;
          user_agent?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          ip_address?: string | null;
          reason?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      compliance_dashboard: {
        Row: {
          compliance_review_status: string | null;
          compliance_score: number | null;
          compliance_status: string | null;
          created_at: string | null;
          days_since_consent: number | null;
          email: string | null;
          email_marketing_consent: boolean | null;
          first_name: string | null;
          form_version: string | null;
          id: string | null;
          last_name: string | null;
          lead_source: string | null;
          phone: string | null;
          state: string | null;
          status: string | null;
          tcpa_consent: boolean | null;
          tcpa_consent_timestamp: string | null;
          unsubscribed_at: string | null;
        };
        Insert: {
          compliance_review_status?: string | null;
          compliance_score?: never;
          compliance_status?: never;
          created_at?: string | null;
          days_since_consent?: never;
          email?: string | null;
          email_marketing_consent?: boolean | null;
          first_name?: string | null;
          form_version?: string | null;
          id?: string | null;
          last_name?: string | null;
          lead_source?: string | null;
          phone?: string | null;
          state?: string | null;
          status?: string | null;
          tcpa_consent?: boolean | null;
          tcpa_consent_timestamp?: string | null;
          unsubscribed_at?: string | null;
        };
        Update: {
          compliance_review_status?: string | null;
          compliance_score?: never;
          compliance_status?: never;
          created_at?: string | null;
          days_since_consent?: never;
          email?: string | null;
          email_marketing_consent?: boolean | null;
          first_name?: string | null;
          form_version?: string | null;
          id?: string | null;
          last_name?: string | null;
          lead_source?: string | null;
          phone?: string | null;
          state?: string | null;
          status?: string | null;
          tcpa_consent?: boolean | null;
          tcpa_consent_timestamp?: string | null;
          unsubscribed_at?: string | null;
        };
        Relationships: [];
      };
      leads_audit_report: {
        Row: {
          compliance_status: string | null;
          created_at: string | null;
          days_since_consent: number | null;
          days_since_unsubscribed: number | null;
          email: string | null;
          email_marketing_consent: boolean | null;
          first_name: string | null;
          id: string | null;
          last_name: string | null;
          lead_source: string | null;
          phone: string | null;
          state: string | null;
          status: string | null;
          tcpa_consent: boolean | null;
          tcpa_consent_timestamp: string | null;
          unsubscribed_at: string | null;
        };
        Insert: {
          compliance_status?: never;
          created_at?: string | null;
          days_since_consent?: never;
          days_since_unsubscribed?: never;
          email?: string | null;
          email_marketing_consent?: boolean | null;
          first_name?: string | null;
          id?: string | null;
          last_name?: string | null;
          lead_source?: string | null;
          phone?: string | null;
          state?: string | null;
          status?: string | null;
          tcpa_consent?: boolean | null;
          tcpa_consent_timestamp?: string | null;
          unsubscribed_at?: string | null;
        };
        Update: {
          compliance_status?: never;
          created_at?: string | null;
          days_since_consent?: never;
          days_since_unsubscribed?: never;
          email?: string | null;
          email_marketing_consent?: boolean | null;
          first_name?: string | null;
          id?: string | null;
          last_name?: string | null;
          lead_source?: string | null;
          phone?: string | null;
          state?: string | null;
          status?: string | null;
          tcpa_consent?: boolean | null;
          tcpa_consent_timestamp?: string | null;
          unsubscribed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      calculate_age: {
        Args: {
          birth_date: string;
        };
        Returns: number;
      };
      calculate_compliance_score: {
        Args: {
          p_tcpa_consent: boolean;
          p_tcpa_text: string;
          p_ip_address: string;
          p_days_since_consent: number;
          p_unsubscribed_at: string;
        };
        Returns: number;
      };
      create_admin_user: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      generate_compliance_report: {
        Args: Record<PropertyKey, never>;
        Returns: {
          report_summary: Json;
        }[];
      };
      generate_weekly_leads_compliance_report: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      update_form_version: {
        Args: {
          new_version: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
