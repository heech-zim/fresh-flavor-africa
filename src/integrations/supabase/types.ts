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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      buyer_requests: {
        Row: {
          additional_requirements: string | null
          budget_range: string | null
          company_name: string
          contact_person: string
          created_at: string
          delivery_location: string
          email: string
          id: string
          phone: string | null
          preferred_delivery_date: string | null
          product_type: string
          quantity: number
          specifications: Json
          status: string | null
          unit: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          additional_requirements?: string | null
          budget_range?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          delivery_location: string
          email: string
          id?: string
          phone?: string | null
          preferred_delivery_date?: string | null
          product_type: string
          quantity: number
          specifications: Json
          status?: string | null
          unit: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          additional_requirements?: string | null
          budget_range?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          delivery_location?: string
          email?: string
          id?: string
          phone?: string | null
          preferred_delivery_date?: string | null
          product_type?: string
          quantity?: number
          specifications?: Json
          status?: string | null
          unit?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      content_management: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          section_key: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section_key: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section_key?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          certifications: string[] | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          nutritional_info: Json | null
          physical_specs: Json | null
          spec_sheet_url: string | null
          storage_requirements: string | null
          updated_at: string
        }
        Insert: {
          category: string
          certifications?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          nutritional_info?: Json | null
          physical_specs?: Json | null
          spec_sheet_url?: string | null
          storage_requirements?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          certifications?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          nutritional_info?: Json | null
          physical_specs?: Json | null
          spec_sheet_url?: string | null
          storage_requirements?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          additional_requirements: string | null
          company_name: string
          contact_person: string
          created_at: string | null
          delivery_date: string | null
          delivery_location: string
          email: string
          id: string
          phone: string
          product_type: string
          quantity: string
        }
        Insert: {
          additional_requirements?: string | null
          company_name: string
          contact_person: string
          created_at?: string | null
          delivery_date?: string | null
          delivery_location: string
          email: string
          id?: string
          phone: string
          product_type: string
          quantity: string
        }
        Update: {
          additional_requirements?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string | null
          delivery_date?: string | null
          delivery_location?: string
          email?: string
          id?: string
          phone?: string
          product_type?: string
          quantity?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          blockchain_tx_hash: string | null
          created_at: string
          current_location: string | null
          current_status: string
          destination_location: string
          estimated_delivery_date: string | null
          id: string
          origin_location: string
          product_id: string | null
          product_name: string
          quantity: number
          temperature_range: string | null
          tracking_number: string
          updated_at: string
          vechain_tx_id: string | null
        }
        Insert: {
          blockchain_tx_hash?: string | null
          created_at?: string
          current_location?: string | null
          current_status?: string
          destination_location: string
          estimated_delivery_date?: string | null
          id?: string
          origin_location: string
          product_id?: string | null
          product_name: string
          quantity: number
          temperature_range?: string | null
          tracking_number: string
          updated_at?: string
          vechain_tx_id?: string | null
        }
        Update: {
          blockchain_tx_hash?: string | null
          created_at?: string
          current_location?: string | null
          current_status?: string
          destination_location?: string
          estimated_delivery_date?: string | null
          id?: string
          origin_location?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          temperature_range?: string | null
          tracking_number?: string
          updated_at?: string
          vechain_tx_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_events: {
        Row: {
          blockchain_tx_hash: string | null
          created_at: string
          description: string
          event_timestamp: string
          event_type: string
          id: string
          location: string
          shipment_id: string
          temperature: number | null
          vechain_tx_id: string | null
        }
        Insert: {
          blockchain_tx_hash?: string | null
          created_at?: string
          description: string
          event_timestamp?: string
          event_type: string
          id?: string
          location: string
          shipment_id: string
          temperature?: number | null
          vechain_tx_id?: string | null
        }
        Update: {
          blockchain_tx_hash?: string | null
          created_at?: string
          description?: string
          event_timestamp?: string
          event_type?: string
          id?: string
          location?: string
          shipment_id?: string
          temperature?: number | null
          vechain_tx_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: { user_email: string; user_password: string }
        Returns: string
      }
      generate_unique_username: {
        Args: { base_username: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "farmer"
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
    Enums: {
      app_role: ["admin", "moderator", "user", "farmer"],
    },
  },
} as const
