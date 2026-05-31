import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          home_city: string | null;
          passport_country: string | null;
          currency: string | null;
          travel_style: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          home_city?: string | null;
          passport_country?: string | null;
          currency?: string | null;
          travel_style?: string | null;
        };
        Update: {
          home_city?: string | null;
          passport_country?: string | null;
          currency?: string | null;
          travel_style?: string | null;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          destination: string;
          dates: string;
          travelers: number;
          budget: number;
          status: 'draft' | 'saved' | 'shared';
          share_token: string | null;
          itinerary_data: unknown;
          created_at: string;
        };
        Insert: {
          user_id: string;
          destination: string;
          dates: string;
          travelers: number;
          budget: number;
          status?: 'draft' | 'saved' | 'shared';
          share_token?: string | null;
          itinerary_data?: unknown;
        };
        Update: {
          status?: 'draft' | 'saved' | 'shared';
          share_token?: string | null;
          itinerary_data?: unknown;
        };
      };
      itinerary_days: {
        Row: {
          id: string;
          trip_id: string;
          day_number: number;
          day_data: unknown;
        };
        Insert: {
          trip_id: string;
          day_number: number;
          day_data: unknown;
        };
        Update: {
          day_data?: unknown;
        };
      };
      planning_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          session_messages: unknown;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          session_messages: unknown;
        };
        Update: {
          session_messages?: unknown;
        };
      };
    };
  };
};
