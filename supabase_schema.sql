-- ================================================================
-- CONTROLE DE ROTAS — Script de criação de tabelas no Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- ================================================================

create table if not exists motoristas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean default true,
  criado_em timestamp with time zone default now()
);

create table if not exists veiculos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean default true,
  criado_em timestamp with time zone default now()
);

create table if not exists rotas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean default true,
  criado_em timestamp with time zone default now()
);

-- Para projetos existentes criados antes da coluna `ativo` ser adicionada:
-- alter table motoristas add column if not exists ativo boolean default true;
-- alter table rotas      add column if not exists ativo boolean default true;
-- alter table veiculos   add column if not exists ativo boolean default true;

create table if not exists registros (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  motorista_id uuid references motoristas(id) on delete set null,
  veiculo_id uuid references veiculos(id) on delete set null,
  rota_id uuid references rotas(id) on delete set null,
  observacoes text,
  criado_em timestamp with time zone default now()
);

-- Índices para melhorar performance nas consultas por data
create index if not exists idx_registros_data on registros(data);
create index if not exists idx_registros_motorista on registros(motorista_id);

-- RLS (Row Level Security) — descomente se quiser usar autenticação no futuro
-- alter table motoristas enable row level security;
-- alter table veiculos enable row level security;
-- alter table rotas enable row level security;
-- alter table registros enable row level security;
