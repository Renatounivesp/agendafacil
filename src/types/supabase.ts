export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          created_at?: string
        }
      }
      disponibilidade: {
        Row: {
          id: string
          user_id: string
          dia_semana: number
          hora_inicio: string
          hora_fim: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dia_semana: number
          hora_inicio: string
          hora_fim: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dia_semana?: number
          hora_inicio?: string
          hora_fim?: string
          created_at?: string
        }
      }
      agendamentos: {
        Row: {
          id: string
          user_id: string
          nome_cliente: string
          email_cliente: string
          data_hora: string
          status: 'agendado' | 'cancelado'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome_cliente: string
          email_cliente: string
          data_hora: string
          status?: 'agendado' | 'cancelado'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome_cliente?: string
          email_cliente?: string
          data_hora?: string
          status?: 'agendado' | 'cancelado'
          created_at?: string
        }
      }
    }
  }
}