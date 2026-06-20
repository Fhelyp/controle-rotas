-- ================================================================
-- CONTROLE DE ROTAS — Script de criação de tabelas no Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- (Idempotente: pode rodar várias vezes sem quebrar nada)
-- ================================================================

-- ── Cadastros ──────────────────────────────────────────────────
create table if not exists motoristas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean default true,
  criado_em timestamp with time zone default now()
);

create table if not exists ajudantes (
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
alter table motoristas add column if not exists ativo boolean default true;
alter table rotas      add column if not exists ativo boolean default true;
alter table veiculos   add column if not exists ativo boolean default true;

-- ── Registro de execução de rota ───────────────────────────────
create table if not exists registros (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  motorista_id uuid references motoristas(id) on delete set null,
  ajudante_id uuid references ajudantes(id) on delete set null,
  veiculo_id uuid references veiculos(id) on delete set null,
  rota_id uuid references rotas(id) on delete set null,
  valor_motorista numeric(12,2) default 0,
  valor_ajudante numeric(12,2) default 0,
  observacoes text,
  criado_em timestamp with time zone default now()
);

-- Para registros já existentes (adiciona colunas novas se faltarem):
alter table registros add column if not exists ajudante_id uuid references ajudantes(id) on delete set null;
alter table registros add column if not exists valor_motorista numeric(12,2) default 0;
alter table registros add column if not exists valor_ajudante numeric(12,2) default 0;

-- ── Receitas e despesas (várias por registro) ──────────────────
create table if not exists receitas (
  id uuid primary key default gen_random_uuid(),
  registro_id uuid references registros(id) on delete cascade,
  descricao text,
  valor numeric(12,2) not null default 0,
  criado_em timestamp with time zone default now()
);

create table if not exists despesas (
  id uuid primary key default gen_random_uuid(),
  registro_id uuid references registros(id) on delete cascade,
  descricao text,
  valor numeric(12,2) not null default 0,
  criado_em timestamp with time zone default now()
);

-- ── Índices ────────────────────────────────────────────────────
create index if not exists idx_registros_data on registros(data);
create index if not exists idx_registros_motorista on registros(motorista_id);
create index if not exists idx_registros_ajudante on registros(ajudante_id);
create index if not exists idx_receitas_registro on receitas(registro_id);
create index if not exists idx_despesas_registro on despesas(registro_id);

-- RLS (Row Level Security) — descomente se quiser usar autenticação no futuro
-- alter table motoristas enable row level security;
-- alter table ajudantes  enable row level security;
-- alter table veiculos   enable row level security;
-- alter table rotas      enable row level security;
-- alter table registros  enable row level security;
-- alter table receitas   enable row level security;
-- alter table despesas   enable row level security;
