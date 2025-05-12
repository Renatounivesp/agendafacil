/*
  # Criação do schema inicial

  1. Novas Tabelas
     - `perfis`: Armazena informações dos perfis de usuários
     - `disponibilidade`: Armazena os horários disponíveis para cada usuário
     - `agendamentos`: Armazena os agendamentos realizados

  2. Segurança
     - Habilitação de RLS em todas as tabelas
     - Políticas de acesso para usuários autenticados
*/

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de disponibilidade
CREATE TABLE IF NOT EXISTS disponibilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL, -- 0 = Domingo, 1 = Segunda, etc.
  hora_inicio TEXT NOT NULL,   -- Formato "HH:MM"
  hora_fim TEXT NOT NULL,      -- Formato "HH:MM"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  nome_cliente TEXT NOT NULL,
  email_cliente TEXT NOT NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON perfis
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON perfis
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem ver usernames de outros perfis"
  ON perfis
  FOR SELECT
  USING (true);

-- Políticas para disponibilidade
CREATE POLICY "Usuários podem ver sua própria disponibilidade"
  ON disponibilidade
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem gerenciar sua própria disponibilidade"
  ON disponibilidade
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Qualquer pessoa pode ver disponibilidade de qualquer usuário"
  ON disponibilidade
  FOR SELECT
  USING (true);

-- Políticas para agendamentos
CREATE POLICY "Usuários podem ver seus próprios agendamentos"
  ON agendamentos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios agendamentos"
  ON agendamentos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Qualquer pessoa pode criar agendamentos"
  ON agendamentos
  FOR INSERT
  WITH CHECK (true);