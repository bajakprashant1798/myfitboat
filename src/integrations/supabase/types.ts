export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      benefits: {
        Row: {
          description: string;
          icon: string | null;
          id: string;
          product_id: string | null;
          sort_order: number;
          title: string;
        };
        Insert: {
          description: string;
          icon?: string | null;
          id?: string;
          product_id?: string | null;
          sort_order?: number;
          title: string;
        };
        Update: {
          description?: string;
          icon?: string | null;
          id?: string;
          product_id?: string | null;
          sort_order?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "benefits_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          subject?: string | null;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          category: string | null;
          id: string;
          product_id: string | null;
          question: string;
          sort_order: number;
        };
        Insert: {
          answer: string;
          category?: string | null;
          id?: string;
          product_id?: string | null;
          question: string;
          sort_order?: number;
        };
        Update: {
          answer?: string;
          category?: string | null;
          id?: string;
          product_id?: string | null;
          question?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "faqs_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      ingredients: {
        Row: {
          amount: string | null;
          description: string | null;
          id: string;
          name: string;
          product_id: string | null;
          sort_order: number;
        };
        Insert: {
          amount?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          product_id?: string | null;
          sort_order?: number;
        };
        Update: {
          amount?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          product_id?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ingredients_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          line_total_inr: number;
          name: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          unit_price_inr: number;
          variant_id: string | null;
        };
        Insert: {
          id?: string;
          line_total_inr: number;
          name: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          unit_price_inr: number;
          variant_id?: string | null;
        };
        Update: {
          id?: string;
          line_total_inr?: number;
          name?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          unit_price_inr?: number;
          variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          carrier: string | null;
          created_at: string;
          currency: string;
          customer_name: string | null;
          email: string;
          estimated_delivery: string | null;
          id: string;
          order_number: string;
          phone: string | null;
          shipping_address: Json | null;
          shipping_inr: number;
          status: string;
          stripe_payment_intent: string | null;
          stripe_session_id: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          subtotal_inr: number;
          tax_inr: number;
          total_inr: number;
          tracking_number: string | null;
          updated_at: string;
        };
        Insert: {
          carrier?: string | null;
          created_at?: string;
          currency?: string;
          customer_name?: string | null;
          email: string;
          estimated_delivery?: string | null;
          id?: string;
          order_number?: string;
          phone?: string | null;
          shipping_address?: Json | null;
          shipping_inr?: number;
          status?: string;
          stripe_payment_intent?: string | null;
          stripe_session_id?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          subtotal_inr: number;
          tax_inr?: number;
          total_inr: number;
          tracking_number?: string | null;
          updated_at?: string;
        };
        Update: {
          carrier?: string | null;
          created_at?: string;
          currency?: string;
          customer_name?: string | null;
          email?: string;
          estimated_delivery?: string | null;
          id?: string;
          order_number?: string;
          phone?: string | null;
          shipping_address?: Json | null;
          shipping_inr?: number;
          status?: string;
          stripe_payment_intent?: string | null;
          stripe_session_id?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          subtotal_inr?: number;
          tax_inr?: number;
          total_inr?: number;
          tracking_number?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          badge: string | null;
          compare_at_price_inr: number | null;
          id: string;
          is_default: boolean;
          name: string;
          price_inr: number;
          product_id: string;
          servings: number;
          sku: string | null;
          sort_order: number;
        };
        Insert: {
          badge?: string | null;
          compare_at_price_inr?: number | null;
          id?: string;
          is_default?: boolean;
          name: string;
          price_inr: number;
          product_id: string;
          servings?: number;
          sku?: string | null;
          sort_order?: number;
        };
        Update: {
          badge?: string | null;
          compare_at_price_inr?: number | null;
          id?: string;
          is_default?: boolean;
          name?: string;
          price_inr?: number;
          product_id?: string;
          servings?: number;
          sku?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          badges: Json;
          compare_at_price_inr: number | null;
          created_at: string;
          description: string | null;
          gallery: Json;
          id: string;
          image_url: string | null;
          is_active: boolean;
          is_featured: boolean;
          long_description: string | null;
          name: string;
          price_inr: number;
          serving_size: string | null;
          servings_per_pack: number | null;
          slug: string;
          sort_order: number;
          tagline: string | null;
          updated_at: string;
        };
        Insert: {
          badges?: Json;
          compare_at_price_inr?: number | null;
          created_at?: string;
          description?: string | null;
          gallery?: Json;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          long_description?: string | null;
          name: string;
          price_inr: number;
          serving_size?: string | null;
          servings_per_pack?: number | null;
          slug: string;
          sort_order?: number;
          tagline?: string | null;
          updated_at?: string;
        };
        Update: {
          badges?: Json;
          compare_at_price_inr?: number | null;
          created_at?: string;
          description?: string | null;
          gallery?: Json;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          long_description?: string | null;
          name?: string;
          price_inr?: number;
          serving_size?: string | null;
          servings_per_pack?: number | null;
          slug?: string;
          sort_order?: number;
          tagline?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          author_name: string;
          author_title: string | null;
          body: string;
          created_at: string;
          id: string;
          is_featured: boolean;
          product_id: string | null;
          rating: number;
          sort_order: number;
          title: string | null;
          verified: boolean;
        };
        Insert: {
          author_name: string;
          author_title?: string | null;
          body: string;
          created_at?: string;
          id?: string;
          is_featured?: boolean;
          product_id?: string | null;
          rating?: number;
          sort_order?: number;
          title?: string | null;
          verified?: boolean;
        };
        Update: {
          author_name?: string;
          author_title?: string | null;
          body?: string;
          created_at?: string;
          id?: string;
          is_featured?: boolean;
          product_id?: string | null;
          rating?: number;
          sort_order?: number;
          title?: string | null;
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
