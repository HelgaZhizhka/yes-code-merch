export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
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
      attribute_definitions: {
        Row: {
          id: string;
          is_required: boolean;
          is_variant_attribute: boolean;
          label: string | null;
          name: string;
          product_type_id: string;
          type: string;
        };
        Insert: {
          id?: string;
          is_required?: boolean;
          is_variant_attribute?: boolean;
          label?: string | null;
          name: string;
          product_type_id: string;
          type: string;
        };
        Update: {
          id?: string;
          is_required?: boolean;
          is_variant_attribute?: boolean;
          label?: string | null;
          name?: string;
          product_type_id?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attribute_definitions_product_type_id_fkey';
            columns: ['product_type_id'];
            isOneToOne: false;
            referencedRelation: 'product_types';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          meta_description: string | null;
          meta_keywords: string | null;
          meta_title: string | null;
          name: string;
          order_hint: string;
          parent_id: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_keywords?: string | null;
          meta_title?: string | null;
          name: string;
          order_hint?: string;
          parent_id?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_keywords?: string | null;
          meta_title?: string | null;
          name?: string;
          order_hint?: string;
          parent_id?: string | null;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
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
      coupons: {
        Row: {
          applies_to: string;
          code: string;
          created_at: string;
          description: string | null;
          discount_type: string;
          discount_value: number;
          id: string;
          is_active: boolean;
          max_redemptions: number | null;
          max_redemptions_per_user: number | null;
          min_order_total: number;
          name: string;
          product_id: string | null;
          updated_at: string;
          used_count: number;
          valid_from: string | null;
          valid_to: string | null;
          variant_id: string | null;
        };
        Insert: {
          applies_to?: string;
          code: string;
          created_at?: string;
          description?: string | null;
          discount_type: string;
          discount_value: number;
          id?: string;
          is_active?: boolean;
          max_redemptions?: number | null;
          max_redemptions_per_user?: number | null;
          min_order_total?: number;
          name: string;
          product_id?: string | null;
          updated_at?: string;
          used_count?: number;
          valid_from?: string | null;
          valid_to?: string | null;
          variant_id?: string | null;
        };
        Update: {
          applies_to?: string;
          code?: string;
          created_at?: string;
          description?: string | null;
          discount_type?: string;
          discount_value?: number;
          id?: string;
          is_active?: boolean;
          max_redemptions?: number | null;
          max_redemptions_per_user?: number | null;
          min_order_total?: number;
          name?: string;
          product_id?: string | null;
          updated_at?: string;
          used_count?: number;
          valid_from?: string | null;
          valid_to?: string | null;
          variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'coupons_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'coupons_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'coupons_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'coupons_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['master_variant_id'];
          },
        ];
      };
      customers: {
        Row: {
          company: string | null;
          created_at: string;
          date_of_birth: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          date_of_birth: string;
          email?: string;
          first_name: string;
          last_name: string;
          phone: string;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          date_of_birth?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      product_attributes: {
        Row: {
          attribute_definition_id: string;
          id: string;
          product_id: string;
          value: Json;
        };
        Insert: {
          attribute_definition_id: string;
          id?: string;
          product_id: string;
          value: Json;
        };
        Update: {
          attribute_definition_id?: string;
          id?: string;
          product_id?: string;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'product_attributes_attribute_definition_id_fkey';
            columns: ['attribute_definition_id'];
            isOneToOne: false;
            referencedRelation: 'attribute_definitions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_attributes_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_attributes_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['product_id'];
          },
        ];
      };
      product_categories: {
        Row: {
          category_id: string;
          product_id: string;
        };
        Insert: {
          category_id: string;
          product_id: string;
        };
        Update: {
          category_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_categories_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_categories_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['product_id'];
          },
        ];
      };
      product_discounts: {
        Row: {
          created_at: string;
          description: string | null;
          discount_type: string;
          discount_value: number;
          id: string;
          is_active: boolean;
          name: string;
          priority: number;
          product_id: string | null;
          updated_at: string;
          valid_from: string | null;
          valid_to: string | null;
          variant_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          discount_type: string;
          discount_value: number;
          id?: string;
          is_active?: boolean;
          name: string;
          priority?: number;
          product_id?: string | null;
          updated_at?: string;
          valid_from?: string | null;
          valid_to?: string | null;
          variant_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          discount_type?: string;
          discount_value?: number;
          id?: string;
          is_active?: boolean;
          name?: string;
          priority?: number;
          product_id?: string | null;
          updated_at?: string;
          valid_from?: string | null;
          valid_to?: string | null;
          variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_discounts_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_discounts_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'product_discounts_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_discounts_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['master_variant_id'];
          },
        ];
      };
      product_images: {
        Row: {
          alt: string | null;
          created_at: string;
          height: number | null;
          id: string;
          is_primary: boolean;
          sort_order: number;
          url: string;
          variant_id: string;
          width: number | null;
        };
        Insert: {
          alt?: string | null;
          created_at?: string;
          height?: number | null;
          id?: string;
          is_primary?: boolean;
          sort_order?: number;
          url: string;
          variant_id: string;
          width?: number | null;
        };
        Update: {
          alt?: string | null;
          created_at?: string;
          height?: number | null;
          id?: string;
          is_primary?: boolean;
          sort_order?: number;
          url?: string;
          variant_id?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_images_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['master_variant_id'];
          },
        ];
      };
      product_types: {
        Row: {
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      product_variant_attributes: {
        Row: {
          attribute_definition_id: string;
          id: string;
          value: Json;
          variant_id: string;
        };
        Insert: {
          attribute_definition_id: string;
          id?: string;
          value: Json;
          variant_id: string;
        };
        Update: {
          attribute_definition_id?: string;
          id?: string;
          value?: Json;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_variant_attributes_attribute_definition_id_fkey';
            columns: ['attribute_definition_id'];
            isOneToOne: false;
            referencedRelation: 'attribute_definitions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_variant_attributes_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_variant_attributes_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['master_variant_id'];
          },
        ];
      };
      product_variants: {
        Row: {
          created_at: string;
          currency: string;
          id: string;
          is_master: boolean;
          price: number;
          product_id: string;
          sku: string;
          stock: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          id?: string;
          is_master?: boolean;
          price: number;
          product_id: string;
          sku: string;
          stock?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          id?: string;
          is_master?: boolean;
          price?: number;
          product_id?: string;
          sku?: string;
          stock?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'v_plp_products';
            referencedColumns: ['product_id'];
          },
        ];
      };
      products: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_published: boolean;
          name: string;
          product_type_id: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean;
          name: string;
          product_type_id: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean;
          name?: string;
          product_type_id?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_product_type_id_fkey';
            columns: ['product_type_id'];
            isOneToOne: false;
            referencedRelation: 'product_types';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      v_plp_products: {
        Row: {
          currency: string | null;
          is_published: boolean | null;
          master_price: number | null;
          master_sku: string | null;
          master_variant_id: string | null;
          name: string | null;
          primary_image_url: string | null;
          product_id: string | null;
          slug: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      clear_default_address: {
        Args: { _address_type: string };
        Returns: undefined;
      };
      complete_registration: {
        Args: {
          _bill_city: string;
          _bill_country: string;
          _bill_is_default: boolean;
          _bill_postal: string;
          _bill_street_name: string;
          _bill_street_number: string;
          _company: string;
          _date_of_birth: string;
          _email: string;
          _first_name: string;
          _last_name: string;
          _phone: string;
          _ship_city: string;
          _ship_country: string;
          _ship_is_default: boolean;
          _ship_postal: string;
          _ship_street_name: string;
          _ship_street_number: string;
          _title: string;
          _use_ship_as_bill: boolean;
        };
        Returns: undefined;
      };
      get_catalog: {
        Args: {
          in_category?: string;
          page?: number;
          page_size?: number;
          q?: string;
          sort_by?: string;
          sort_dir?: string;
        };
        Returns: {
          created_at: string;
          currency: string;
          image_url: string;
          name: string;
          price: number;
          product_attrs: Json;
          product_id: string;
          sku: string;
          slug: string;
          stock: number;
        }[];
      };
      get_category_ancestors: {
        Args: { cat_id: string };
        Returns: {
          depth: number;
          id: string;
          name: string;
          parent_id: string;
          slug: string;
        }[];
      };
      get_category_subtree: {
        Args: { root_id: string };
        Returns: {
          depth: number;
          id: string;
          name: string;
          parent_id: string;
          slug: string;
        }[];
      };
      get_effective_variant_price: {
        Args: { p_variant_id: string };
        Returns: {
          applied_discount_id: string;
          final_price: number;
          original_price: number;
          variant_id: string;
        }[];
      };
      list_products_by_category: {
        Args: {
          p_category_id: string;
          p_limit?: number;
          p_offset?: number;
          p_sort_by?: string;
          p_sort_dir?: string;
        };
        Returns: {
          currency: string | null;
          is_published: boolean | null;
          master_price: number | null;
          master_sku: string | null;
          master_variant_id: string | null;
          name: string | null;
          primary_image_url: string | null;
          product_id: string | null;
          slug: string | null;
        }[];
      };
      set_default_address: {
        Args: { _address_id: string; _address_type: string };
        Returns: undefined;
      };
      upsert_variant_image: {
        Args: {
          p_alt?: string;
          p_height?: number;
          p_is_primary?: boolean;
          p_sku: string;
          p_sort?: number;
          p_storage_path: string;
          p_width?: number;
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

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
    Enums: {},
  },
} as const;
