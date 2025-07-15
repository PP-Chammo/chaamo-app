export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          country: string;
          created_at: string;
          full_address: string;
          id: string;
          is_primary: boolean | null;
          user_id: string;
        };
        Insert: {
          country: string;
          created_at?: string;
          full_address: string;
          id?: string;
          is_primary?: boolean | null;
          user_id: string;
        };
        Update: {
          country?: string;
          created_at?: string;
          full_address?: string;
          id?: string;
          is_primary?: boolean | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'addresses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      auctions: {
        Row: {
          bid_increment: number;
          current_bid: number | null;
          listing_id: string;
          start_price: number;
          winning_bid_id: string | null;
        };
        Insert: {
          bid_increment?: number;
          current_bid?: number | null;
          listing_id: string;
          start_price: number;
          winning_bid_id?: string | null;
        };
        Update: {
          bid_increment?: number;
          current_bid?: number | null;
          listing_id?: string;
          start_price?: number;
          winning_bid_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'auctions_listing_id_fkey';
            columns: ['listing_id'];
            isOneToOne: true;
            referencedRelation: 'listings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_winning_bid';
            columns: ['winning_bid_id'];
            isOneToOne: false;
            referencedRelation: 'bids';
            referencedColumns: ['id'];
          },
        ];
      };
      bids: {
        Row: {
          amount: number;
          auction_listing_id: string;
          bidder_id: string;
          created_at: string;
          id: string;
        };
        Insert: {
          amount: number;
          auction_listing_id: string;
          bidder_id: string;
          created_at?: string;
          id?: string;
        };
        Update: {
          amount?: number;
          auction_listing_id?: string;
          bidder_id?: string;
          created_at?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bids_auction_listing_id_fkey';
            columns: ['auction_listing_id'];
            isOneToOne: false;
            referencedRelation: 'auctions';
            referencedColumns: ['listing_id'];
          },
          {
            foreignKeyName: 'bids_bidder_id_fkey';
            columns: ['bidder_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      card_sets: {
        Row: {
          category_id: number;
          id: number;
          name: string;
          year: number | null;
        };
        Insert: {
          category_id: number;
          id?: number;
          name: string;
          year?: number | null;
        };
        Update: {
          category_id?: number;
          id?: number;
          name?: string;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'card_sets_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      cards: {
        Row: {
          card_number: string | null;
          category_id: number;
          grade: string | null;
          grading_company: string | null;
          id: string;
          is_graded: boolean;
          name: string;
          player_name: string | null;
          rarity: string | null;
          set_id: number | null;
          source: Database['public']['Enums']['card_source'];
          team_name: string | null;
        };
        Insert: {
          card_number?: string | null;
          category_id: number;
          grade?: string | null;
          grading_company?: string | null;
          id?: string;
          is_graded?: boolean;
          name: string;
          player_name?: string | null;
          rarity?: string | null;
          set_id?: number | null;
          source: Database['public']['Enums']['card_source'];
          team_name?: string | null;
        };
        Update: {
          card_number?: string | null;
          category_id?: number;
          grade?: string | null;
          grading_company?: string | null;
          id?: string;
          is_graded?: boolean;
          name?: string;
          player_name?: string | null;
          rarity?: string | null;
          set_id?: number | null;
          source?: Database['public']['Enums']['card_source'];
          team_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cards_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cards_set_id_fkey';
            columns: ['set_id'];
            isOneToOne: false;
            referencedRelation: 'card_sets';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      listing_images: {
        Row: {
          id: string;
          image_url: string;
          listing_id: string;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          image_url: string;
          listing_id: string;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          image_url?: string;
          listing_id?: string;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'listing_images_listing_id_fkey';
            columns: ['listing_id'];
            isOneToOne: false;
            referencedRelation: 'listings';
            referencedColumns: ['id'];
          },
        ];
      };
      listings: {
        Row: {
          card_id: string;
          created_at: string;
          description: string | null;
          ends_at: string | null;
          id: string;
          is_boosted: boolean | null;
          listing_type: Database['public']['Enums']['listing_type'];
          price: number | null;
          seller_id: string;
          status: Database['public']['Enums']['listing_status'];
          updated_at: string;
        };
        Insert: {
          card_id: string;
          created_at?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          is_boosted?: boolean | null;
          listing_type: Database['public']['Enums']['listing_type'];
          price?: number | null;
          seller_id: string;
          status?: Database['public']['Enums']['listing_status'];
          updated_at?: string;
        };
        Update: {
          card_id?: string;
          created_at?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          is_boosted?: boolean | null;
          listing_type?: Database['public']['Enums']['listing_type'];
          price?: number | null;
          seller_id?: string;
          status?: Database['public']['Enums']['listing_status'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'listings_card_id_fkey';
            columns: ['card_id'];
            isOneToOne: false;
            referencedRelation: 'cards';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'listings_seller_id_fkey';
            columns: ['seller_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      old_table_scraping_cards: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          sold_cards: Json | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          sold_cards?: Json | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          sold_cards?: Json | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          buyer_id: string;
          completed_at: string | null;
          created_at: string;
          delivered_at: string | null;
          final_price: number;
          id: string;
          listing_id: string;
          paid_at: string | null;
          payment_provider_txn_id: string | null;
          platform_fee: number;
          seller_id: string;
          shipped_at: string | null;
          shipping_address: string;
          shipping_cost: number | null;
          status: Database['public']['Enums']['order_status'];
          total_amount: number;
          tracking_number: string | null;
        };
        Insert: {
          buyer_id: string;
          completed_at?: string | null;
          created_at?: string;
          delivered_at?: string | null;
          final_price: number;
          id?: string;
          listing_id: string;
          paid_at?: string | null;
          payment_provider_txn_id?: string | null;
          platform_fee: number;
          seller_id: string;
          shipped_at?: string | null;
          shipping_address: string;
          shipping_cost?: number | null;
          status?: Database['public']['Enums']['order_status'];
          total_amount: number;
          tracking_number?: string | null;
        };
        Update: {
          buyer_id?: string;
          completed_at?: string | null;
          created_at?: string;
          delivered_at?: string | null;
          final_price?: number;
          id?: string;
          listing_id?: string;
          paid_at?: string | null;
          payment_provider_txn_id?: string | null;
          platform_fee?: number;
          seller_id?: string;
          shipped_at?: string | null;
          shipping_address?: string;
          shipping_cost?: number | null;
          status?: Database['public']['Enums']['order_status'];
          total_amount?: number;
          tracking_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_buyer_id_fkey';
            columns: ['buyer_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_listing_id_fkey';
            columns: ['listing_id'];
            isOneToOne: true;
            referencedRelation: 'listings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_seller_id_fkey';
            columns: ['seller_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          comment: string | null;
          created_at: string;
          id: string;
          order_id: string;
          rating: number;
          reviewee_id: string;
          reviewer_id: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          order_id: string;
          rating: number;
          reviewee_id: string;
          reviewer_id: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          order_id?: string;
          rating?: number;
          reviewee_id?: string;
          reviewer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: true;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_reviewee_id_fkey';
            columns: ['reviewee_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_reviewer_id_fkey';
            columns: ['reviewer_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          id: string;
          id_document_url: string | null;
          id_verification_status: Database['public']['Enums']['id_verification_status'];
          phone_number: string | null;
          tier: Database['public']['Enums']['user_tier'];
          updated_at: string;
          username: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          id_document_url?: string | null;
          id_verification_status?: Database['public']['Enums']['id_verification_status'];
          phone_number?: string | null;
          tier?: Database['public']['Enums']['user_tier'];
          updated_at?: string;
          username: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          id_document_url?: string | null;
          id_verification_status?: Database['public']['Enums']['id_verification_status'];
          phone_number?: string | null;
          tier?: Database['public']['Enums']['user_tier'];
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_new_bid: {
        Args: {
          p_auction_listing_id: string;
          p_bidder_id: string;
          p_bid_amount: number;
        };
        Returns: {
          success: boolean;
          message: string;
        }[];
      };
      upsert_cards: {
        Args: {
          card_title: string;
          card_image_url: string;
          card_sales_data: Json;
        };
        Returns: {
          id: string;
          title: string;
          image_url: string;
          sold_cards: Json;
          created_at: string;
          updated_at: string;
        }[];
      };
    };
    Enums: {
      card_source: 'user_posted' | 'scraped_ebay';
      id_verification_status: 'pending' | 'approved' | 'rejected';
      listing_status: 'active' | 'sold' | 'expired' | 'delisted';
      listing_type: 'fixed_price' | 'auction';
      order_status:
        | 'pending_payment'
        | 'payment_secured'
        | 'shipped'
        | 'delivered'
        | 'completed'
        | 'refund_requested'
        | 'refunded'
        | 'cancelled';
      user_tier: 'free' | 'gold';
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
    Enums: {
      card_source: ['user_posted', 'scraped_ebay'],
      id_verification_status: ['pending', 'approved', 'rejected'],
      listing_status: ['active', 'sold', 'expired', 'delisted'],
      listing_type: ['fixed_price', 'auction'],
      order_status: [
        'pending_payment',
        'payment_secured',
        'shipped',
        'delivered',
        'completed',
        'refund_requested',
        'refunded',
        'cancelled',
      ],
      user_tier: ['free', 'gold'],
    },
  },
} as const;
