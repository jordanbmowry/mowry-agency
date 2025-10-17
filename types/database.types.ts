export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  coverage_type: string | null;
  health_conditions: string | null;
  current_medications: string | null;
  message: string | null;
  tobacco_use: boolean | null;
  income: number | null;
  occupation: string | null;
  height: string | null;
  weight: string | null;
  loan_amount: number | null;
  status: 'new' | 'in_progress' | 'contacted' | 'closed' | null;
  exported_to_csv: boolean;
  city: string | null;
  state: string | null;
  sex: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Profile>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at'>;
        Update: Partial<Lead>;
      };
      unsubscribes: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: Omit<
          { id: string; email: string; created_at: string },
          'id' | 'created_at'
        >;
        Update: Partial<{ id: string; email: string; created_at: string }>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
