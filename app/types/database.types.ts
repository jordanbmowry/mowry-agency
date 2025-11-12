export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
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
      campaign_analyses: {
        Row: {
          ai_cost: number | null;
          ai_model: string;
          analysis_result: Json;
          campaign_name: string;
          clicks: number;
          conversions: number;
          cost_per_lead: number;
          cpc: number;
          created_at: string;
          ctr: number;
          id: string;
          impressions: number;
          tokens_used: number | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          ai_cost?: number | null;
          ai_model: string;
          analysis_result: Json;
          campaign_name: string;
          clicks: number;
          conversions: number;
          cost_per_lead: number;
          cpc: number;
          created_at?: string;
          ctr: number;
          id?: string;
          impressions: number;
          tokens_used?: number | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          ai_cost?: number | null;
          ai_model?: string;
          analysis_result?: Json;
          campaign_name?: string;
          clicks?: number;
          conversions?: number;
          cost_per_lead?: number;
          cpc?: number;
          created_at?: string;
          ctr?: number;
          id?: string;
          impressions?: number;
          tokens_used?: number | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      google_ads_accounts: {
        Row: {
          account_id: string;
          account_name: string;
          created_at: string | null;
          currency_code: string;
          id: string;
          time_zone: string;
          updated_at: string | null;
        };
        Insert: {
          account_id: string;
          account_name: string;
          created_at?: string | null;
          currency_code: string;
          id?: string;
          time_zone: string;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string;
          account_name?: string;
          created_at?: string | null;
          currency_code?: string;
          id?: string;
          time_zone?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      google_ads_campaigns: {
        Row: {
          account_id: string;
          budget_amount_micros: number | null;
          campaign_id: string;
          campaign_name: string;
          campaign_status: string;
          campaign_type: string;
          created_at: string | null;
          end_date: string | null;
          id: string;
          start_date: string | null;
          target_cpa_micros: number | null;
          updated_at: string | null;
        };
        Insert: {
          account_id: string;
          budget_amount_micros?: number | null;
          campaign_id: string;
          campaign_name: string;
          campaign_status: string;
          campaign_type: string;
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          start_date?: string | null;
          target_cpa_micros?: number | null;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string;
          budget_amount_micros?: number | null;
          campaign_id?: string;
          campaign_name?: string;
          campaign_status?: string;
          campaign_type?: string;
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          start_date?: string | null;
          target_cpa_micros?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'google_ads_campaigns_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'google_ads_accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      google_ads_keywords: {
        Row: {
          campaign_id: string;
          created_at: string | null;
          first_page_cpc_micros: number | null;
          id: string;
          keyword_id: string;
          keyword_text: string;
          match_type: string;
          quality_score: number | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          campaign_id: string;
          created_at?: string | null;
          first_page_cpc_micros?: number | null;
          id?: string;
          keyword_id: string;
          keyword_text: string;
          match_type: string;
          quality_score?: number | null;
          status: string;
          updated_at?: string | null;
        };
        Update: {
          campaign_id?: string;
          created_at?: string | null;
          first_page_cpc_micros?: number | null;
          id?: string;
          keyword_id?: string;
          keyword_text?: string;
          match_type?: string;
          quality_score?: number | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'google_ads_keywords_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'google_ads_campaigns';
            referencedColumns: ['id'];
          },
        ];
      };
      google_ads_performance_daily: {
        Row: {
          average_cpc_micros: number | null;
          campaign_id: string;
          clicks: number | null;
          conversion_value_micros: number | null;
          conversions: number | null;
          cost_micros: number | null;
          cost_per_conversion_micros: number | null;
          created_at: string | null;
          ctr: number | null;
          date: string;
          id: string;
          impressions: number | null;
        };
        Insert: {
          average_cpc_micros?: number | null;
          campaign_id: string;
          clicks?: number | null;
          conversion_value_micros?: number | null;
          conversions?: number | null;
          cost_micros?: number | null;
          cost_per_conversion_micros?: number | null;
          created_at?: string | null;
          ctr?: number | null;
          date: string;
          id?: string;
          impressions?: number | null;
        };
        Update: {
          average_cpc_micros?: number | null;
          campaign_id?: string;
          clicks?: number | null;
          conversion_value_micros?: number | null;
          conversions?: number | null;
          cost_micros?: number | null;
          cost_per_conversion_micros?: number | null;
          created_at?: string | null;
          ctr?: number | null;
          date?: string;
          id?: string;
          impressions?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'google_ads_performance_daily_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'google_ads_campaigns';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_embeddings: {
        Row: {
          category: Database['public']['Enums']['knowledge_category'];
          content: string;
          created_at: string | null;
          embedding: string;
          id: string;
          metadata: Json | null;
          source_id: string | null;
          source_table: string | null;
          updated_at: string | null;
        };
        Insert: {
          category: Database['public']['Enums']['knowledge_category'];
          content: string;
          created_at?: string | null;
          embedding: string;
          id?: string;
          metadata?: Json | null;
          source_id?: string | null;
          source_table?: string | null;
          updated_at?: string | null;
        };
        Update: {
          category?: Database['public']['Enums']['knowledge_category'];
          content?: string;
          created_at?: string | null;
          embedding?: string;
          id?: string;
          metadata?: Json | null;
          source_id?: string | null;
          source_table?: string | null;
          updated_at?: string | null;
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
            isOneToOne: true;
            referencedRelation: 'compliance_dashboard';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leads_compliance_report_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: true;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leads_compliance_report_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: true;
            referencedRelation: 'leads_audit_report';
            referencedColumns: ['id'];
          },
        ];
      };
      leads_compliance_report_runs: {
        Row: {
          id: string;
          invoked_by: string | null;
          result: Json | null;
          rows_inserted: number | null;
          rows_updated: number | null;
          run_at: string;
        };
        Insert: {
          id?: string;
          invoked_by?: string | null;
          result?: Json | null;
          rows_inserted?: number | null;
          rows_updated?: number | null;
          run_at?: string;
        };
        Update: {
          id?: string;
          invoked_by?: string | null;
          result?: Json | null;
          rows_inserted?: number | null;
          rows_updated?: number | null;
          run_at?: string;
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
      campaign_trends: {
        Row: {
          analyses_count: number | null;
          analysis_date: string | null;
          avg_cost_per_lead: number | null;
          avg_cpc: number | null;
          avg_ctr: number | null;
          avg_health_score: number | null;
          campaign_name: string | null;
          total_ai_cost: number | null;
          total_conversions: number | null;
        };
        Relationships: [];
      };
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
      calculate_age: { Args: { birth_date: string }; Returns: number };
      calculate_compliance_score: {
        Args: {
          p_days_since_consent: number;
          p_ip_address: string;
          p_tcpa_consent: boolean;
          p_tcpa_text: string;
          p_unsubscribed_at: string;
        };
        Returns: number;
      };
      create_admin_user: { Args: never; Returns: undefined };
      generate_compliance_report: {
        Args: never;
        Returns: {
          report_summary: Json;
        }[];
      };
      generate_weekly_leads_compliance_report: { Args: never; Returns: Json };
      match_embeddings: {
        Args: {
          category_filter?: Database['public']['Enums']['knowledge_category'];
          match_count?: number;
          match_threshold?: number;
          query_embedding: string;
        };
        Returns: {
          category: Database['public']['Enums']['knowledge_category'];
          content: string;
          created_at: string;
          id: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      update_form_version: { Args: { new_version: string }; Returns: string };
    };
    Enums: {
      knowledge_category:
        | 'campaign_performance'
        | 'lead_patterns'
        | 'compliance_rules'
        | 'market_insights'
        | 'optimization_results';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      knowledge_category: [
        'campaign_performance',
        'lead_patterns',
        'compliance_rules',
        'market_insights',
        'optimization_results',
      ],
    },
  },
} as const;
