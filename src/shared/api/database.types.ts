export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string;
          country: string;
          created_at: string;
          email: string | null;
          first_name: string | null;
          id: string;
          is_billing_address: boolean;
          is_default_billing: boolean;
          is_default_shipping: boolean;
          is_shipping_address: boolean;
          last_name: string | null;
          phone: string | null;
          postal_code: string;
          street_name: string | null;
          street_number: string | null;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          city: string;
          country: string;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_billing_address?: boolean;
          is_default_billing?: boolean;
          is_default_shipping?: boolean;
          is_shipping_address?: boolean;
          last_name?: string | null;
          phone?: string | null;
          postal_code: string;
          street_name?: string | null;
          street_number?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          city?: string;
          country?: string;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_billing_address?: boolean;
          is_default_billing?: boolean;
          is_default_shipping?: boolean;
          is_shipping_address?: boolean;
          last_name?: string | null;
          phone?: string | null;
          postal_code?: string;
          street_name?: string | null;
          street_number?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'addresses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'fk_country';
            columns: ['country'];
            isOneToOne: false;
            referencedRelation: 'countries';
            referencedColumns: ['iso_code'];
          },
        ];
      };
      countries: {
        Row: {
          iso_code: string;
          name: string;
          region: string | null;
        };
        Insert: {
          iso_code: string;
          name: string;
          region?: string | null;
        };
        Update: {
          iso_code?: string;
          name?: string;
          region?: string | null;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          company: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string | null;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      complete_registration: {
        Args:
          | {
              _title: string;
              _first_name: string;
              _last_name: string;
              _phone: string;
              _email: string;
              _ship_country: string;
              _ship_city: string;
              _ship_street_name: string;
              _ship_street_number: string;
              _ship_postal: string;
              _date_of_birth?: string;
              _company?: string;
              _ship_is_default?: boolean;
              _use_ship_as_bill?: boolean;
              _bill_country?: string;
              _bill_city?: string;
              _bill_street_name?: string;
              _bill_street_number?: string;
              _bill_postal?: string;
              _bill_is_default?: boolean;
            }
          | {
              _title: string;
              _first_name: string;
              _last_name: string;
              _phone: string;
              _ship_country: string;
              _ship_city: string;
              _ship_street_name: string;
              _ship_street_number: string;
              _ship_postal: string;
              _date_of_birth?: string;
              _company?: string;
              _ship_is_default?: boolean;
              _use_ship_as_bill?: boolean;
              _bill_country?: string;
              _bill_city?: string;
              _bill_street_name?: string;
              _bill_street_number?: string;
              _bill_postal?: string;
              _bill_is_default?: boolean;
            };
        Returns: undefined;
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

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
