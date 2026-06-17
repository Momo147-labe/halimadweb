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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ambassador_links: {
        Row: {
          code: string
          created_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          attributes: Json
          available: boolean
          category_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          merchant_id: string
          name: string
          price_gnf: number
          updated_at: string
        }
        Insert: {
          attributes?: Json
          available?: boolean
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          merchant_id: string
          name: string
          price_gnf: number
          updated_at?: string
        }
        Update: {
          attributes?: Json
          available?: boolean
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          merchant_id?: string
          name?: string
          price_gnf?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          address: string | null
          category_id: string
          city: string
          commission_pct: number | null
          cover_url: string | null
          created_at: string
          description: string | null
          hours: string | null
          id: string
          name: string
          owner_id: string | null
          phone: string
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          category_id: string
          city?: string
          commission_pct?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          hours?: string | null
          id?: string
          name: string
          owner_id?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          category_id?: string
          city?: string
          commission_pct?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          hours?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchants_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_history: {
        Row: {
          at: string
          by_user_id: string | null
          id: string
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          at?: string
          by_user_id?: string | null
          id?: string
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          at?: string
          by_user_id?: string | null
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          image_url: string | null
          item_id: string | null
          name: string
          order_id: string
          qty: number
          unit_price_gnf: number
        }
        Insert: {
          id?: string
          image_url?: string | null
          item_id?: string | null
          name: string
          order_id: string
          qty: number
          unit_price_gnf: number
        }
        Update: {
          id?: string
          image_url?: string | null
          item_id?: string | null
          name?: string
          order_id?: string
          qty?: number
          unit_price_gnf?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          ambassador_id: string | null
          buyer_id: string | null
          buyer_name: string
          buyer_phone: string
          city: string
          code: string
          commission_ambassadeur_pct: number
          commission_halimad_pct: number
          created_at: string
          driver_id: string | null
          fee_livreur_gnf: number
          id: string
          merchant_id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: Database["public"]["Enums"]["order_status"]
          total_gnf: number
          updated_at: string
        }
        Insert: {
          address: string
          ambassador_id?: string | null
          buyer_id?: string | null
          buyer_name: string
          buyer_phone: string
          city?: string
          code: string
          commission_ambassadeur_pct?: number
          commission_halimad_pct?: number
          created_at?: string
          driver_id?: string | null
          fee_livreur_gnf?: number
          id?: string
          merchant_id: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["order_status"]
          total_gnf?: number
          updated_at?: string
        }
        Update: {
          address?: string
          ambassador_id?: string | null
          buyer_id?: string | null
          buyer_name?: string
          buyer_phone?: string
          city?: string
          code?: string
          commission_ambassadeur_pct?: number
          commission_halimad_pct?: number
          created_at?: string
          driver_id?: string | null
          fee_livreur_gnf?: number
          id?: string
          merchant_id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["order_status"]
          total_gnf?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id: string
          name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          commission_ambassadeur_pct: number
          commission_halimad_pct: number
          delivery_fee_gnf: number
          frais_livraison_gnf: number
          free_delivery_threshold_gnf: number | null
          id: boolean
          message_auto: string
          om_number: string
          support_whatsapp: string
          updated_at: string
          whatsapp_agents: Json
          whatsapp_mode: number
          whatsapp_principal: string
          whatsapp_secours: string | null
          zones_livraison: Json
        }
        Insert: {
          commission_ambassadeur_pct?: number
          commission_halimad_pct?: number
          delivery_fee_gnf?: number
          frais_livraison_gnf?: number
          free_delivery_threshold_gnf?: number | null
          id?: boolean
          message_auto?: string
          om_number?: string
          support_whatsapp?: string
          updated_at?: string
          whatsapp_agents?: Json
          whatsapp_mode?: number
          whatsapp_principal?: string
          whatsapp_secours?: string | null
          zones_livraison?: Json
        }
        Update: {
          commission_ambassadeur_pct?: number
          commission_halimad_pct?: number
          delivery_fee_gnf?: number
          frais_livraison_gnf?: number
          free_delivery_threshold_gnf?: number | null
          id?: boolean
          message_auto?: string
          om_number?: string
          support_whatsapp?: string
          updated_at?: string
          whatsapp_agents?: Json
          whatsapp_mode?: number
          whatsapp_principal?: string
          whatsapp_secours?: string | null
          zones_livraison?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["approval_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["approval_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["approval_status"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "restaurant" | "ambassadeur" | "livreur" | "client"
      approval_status: "en_attente" | "approuve" | "suspendu"
      order_status:
        | "en_attente"
        | "preparation"
        | "en_livraison"
        | "livree"
        | "annulee"
      payment_method: "cash" | "orange_money"
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
      app_role: ["admin", "restaurant", "ambassadeur", "livreur", "client"],
      approval_status: ["en_attente", "approuve", "suspendu"],
      order_status: [
        "en_attente",
        "preparation",
        "en_livraison",
        "livree",
        "annulee",
      ],
      payment_method: ["cash", "orange_money"],
    },
  },
} as const
