// ================================
// PLOUNIX SUPABASE TYPE DEFINITIONS
// ================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
        transactions: {
          Row: {
            id: number;
            amount: number;
            merchant: string;
            category: string;
            date: string;
            payment_method: string;
            notes: string | null;
            created_at: string;
          };
          Insert: {
            amount: number;
            merchant: string;
            category: string;
            date: string;
            payment_method: string;
            notes?: string | null;
            created_at?: string;
          };
          Update: {
            id?: number;
            amount?: number;
            merchant?: string;
            category?: string;
            date?: string;
            payment_method?: string;
            notes?: string | null;
            created_at?: string;
          };
        },
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          user_id: string
          financial_data: any // JSONB
          preferences: any // JSONB
          ai_insights: any // JSONB
          persona_data: any // JSONB
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          financial_data?: any
          preferences?: any
          ai_insights?: any
          persona_data?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          financial_data?: any
          preferences?: any
          ai_insights?: any
          persona_data?: any
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          session_id: string
          message_type: 'human' | 'ai'
          content: string
          metadata: any // JSONB
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          message_type: 'human' | 'ai'
          content: string
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          message_type?: 'human' | 'ai'
          content?: string
          metadata?: any
          created_at?: string
        }
      }
      financial_memories: {
        Row: {
          id: string
          user_id: string
          content: string
          metadata: any // JSONB
          embedding: number[] | null // vector
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          metadata?: any
          embedding?: number[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          metadata?: any
          embedding?: number[] | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          description: string | null
          category: string | null
          date: string
          created_at: string
        }
        Insert: {
          user_id: string
          amount: number
          description?: string | null
          category?: string | null
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          description?: string | null
          category?: string | null
          date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_financial_memories: {
        Args: {
          query_embedding: number[]
          match_user_id: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          content: string
          metadata: any
          similarity: number
        }[]
      }
      clear_user_memory: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ================================
// HELPER TYPES FOR TYPE SAFETY
// ================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type ChatMessage = Database['public']['Tables']['chat_history']['Row']
export type FinancialMemory = Database['public']['Tables']['financial_memories']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type ChatMessageInsert = Database['public']['Tables']['chat_history']['Insert']
export type FinancialMemoryInsert = Database['public']['Tables']['financial_memories']['Insert']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type ChatMessageUpdate = Database['public']['Tables']['chat_history']['Update']
export type FinancialMemoryUpdate = Database['public']['Tables']['financial_memories']['Update']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

// ================================
// AUTHENTICATION TYPES
// ================================

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: AuthUser
}

export interface AuthResponse {
  user: AuthUser | null
  session: AuthSession | null
  error: Error | null
}

// ================================
// FINANCIAL DATA TYPES
// ================================

export interface FinancialData {
  income?: number
  expenses?: {
    housing?: number
    food?: number
    transportation?: number
    utilities?: number
    entertainment?: number
    savings?: number
    other?: number
  }
  assets?: {
    cash?: number
    savings?: number
    investments?: number
    real_estate?: number
  }
  liabilities?: {
    credit_cards?: number
    loans?: number
    mortgages?: number
  }
  goals?: {
    emergency_fund?: number
    retirement?: number
    education?: number
    travel?: number
    custom?: Array<{
      name: string
      amount: number
      deadline: string
    }>
  }
}

export interface UserPreferences {
  theme?: 'light' | 'dark'
  currency?: 'PHP' | 'USD'
  risk_tolerance?: 'conservative' | 'moderate' | 'aggressive'
  notification_settings?: {
    email?: boolean
    push?: boolean
    budget_alerts?: boolean
    goal_reminders?: boolean
  }
  privacy_settings?: {
    data_sharing?: boolean
    analytics?: boolean
    personalized_ads?: boolean
  }
}

export interface AIInsights {
  financial_health_score?: number
  spending_patterns?: {
    top_categories?: string[]
    trends?: Array<{
      category: string
      change: number
      period: string
    }>
  }
  recommendations?: Array<{
    type: 'budget' | 'save' | 'invest' | 'debt'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    created_at: string
  }>
  learning_progress?: {
    completed_modules?: string[]
    current_level?: string
    badges_earned?: string[]
  }
}

export interface PersonaData {
  financial_persona?: 'saver' | 'spender' | 'investor' | 'beginner'
  life_stage?: 'student' | 'young_professional' | 'family' | 'pre_retirement' | 'retired'
  primary_goals?: string[]
  knowledge_level?: 'beginner' | 'intermediate' | 'advanced'
  interaction_style?: 'casual' | 'professional' | 'educational'
  preferred_learning_method?: 'visual' | 'reading' | 'interactive' | 'video'
}

// ================================
// VECTOR SEARCH TYPES
// ================================

export interface MemorySearchResult {
  id: string
  content: string
  metadata: any
  similarity: number
}

export interface MemorySearchParams {
  query: string
  userId: string
  threshold?: number
  limit?: number
}

// ================================
// API RESPONSE TYPES
// ================================

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: 'success' | 'error'
}

export interface AuthApiResponse {
  user?: AuthUser
  session?: AuthSession
  error?: string
  message?: string
}

export interface MemoryApiResponse {
  memories?: MemorySearchResult[]
  context?: string
  error?: string
  message?: string
}

// ================================
// EXPORT SUPABASE CLIENT TYPE
// ================================

import { createClient } from '@supabase/supabase-js'

export type SupabaseClient = ReturnType<typeof createClient<Database>>

// ================================
// UTILITY FUNCTIONS FOR TYPE GUARDS
// ================================

export function isValidProfile(data: any): data is Profile {
  return data && typeof data.id === 'string' && typeof data.email === 'string'
}

export function isValidAuthUser(data: any): data is AuthUser {
  return data && typeof data.id === 'string' && typeof data.email === 'string'
}

export function isValidFinancialData(data: any): data is FinancialData {
  return data && typeof data === 'object'
}

// ================================
// CONSTANTS
// ================================

export const CHAT_MESSAGE_TYPES = ['human', 'ai'] as const
export const FINANCIAL_PERSONAS = ['saver', 'spender', 'investor', 'beginner'] as const
export const LIFE_STAGES = ['student', 'young_professional', 'family', 'pre_retirement', 'retired'] as const
export const RISK_TOLERANCES = ['conservative', 'moderate', 'aggressive'] as const
export const KNOWLEDGE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

// Default values
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'light',
  currency: 'PHP',
  risk_tolerance: 'moderate',
  notification_settings: {
    email: true,
    push: true,
    budget_alerts: true,
    goal_reminders: true
  },
  privacy_settings: {
    data_sharing: false,
    analytics: true,
    personalized_ads: false
  }
}

export const DEFAULT_FINANCIAL_DATA: FinancialData = {
  income: 0,
  expenses: {
    housing: 0,
    food: 0,
    transportation: 0,
    utilities: 0,
    entertainment: 0,
    savings: 0,
    other: 0
  },
  assets: {
    cash: 0,
    savings: 0,
    investments: 0,
    real_estate: 0
  },
  liabilities: {
    credit_cards: 0,
    loans: 0,
    mortgages: 0
  },
  goals: {
    emergency_fund: 0,
    retirement: 0,
    education: 0,
    travel: 0,
    custom: []
  }
}
