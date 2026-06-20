-- ================================================================
-- MIGRAÇÃO — Ajudantes + controle financeiro (receitas/despesas)
-- Rode UMA vez no SQL Editor do Supabase ANTES de publicar a nova
-- versão do app. É aditivo e idempotente: não apaga nem altera
-- nenhum dado existente, e pode rodar mais de uma vez sem erro.
-- ================================================================

-- 1) Cadastro de ajudantes (igual aos motoristas)
create table if not exists ajudantes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean default true,
  criado_em timestamp with time zone default now()
);

-- 2) Novas colunas no registro: ajudante e valores a pagar
alter table registros add column if not exists ajudante_id uuid references ajudantes(id) on delete set null;
alter table registros add column if not exists valor_motorista numeric(12,2) default 0;
alter table registros add column if not exists valor_ajudante numeric(12,2) default 0;

-- 3) Receitas (várias por registro)
create table if not exists receitas (
  id uuid primary key default gen_random_uuid(),
  registro_id uuid references registros(id) on delete cascade,
  descricao text,
  valor numeric(12,2) not null default 0,
  criado_em timestamp with time zone default now()
);

-- 4) Despesas avulsas (várias por registro)
create table if not exists despesas (
  id uuid primary key default gen_random_uuid(),
  registro_id uuid references registros(id) on delete cascade,
  descricao text,
  valor numeric(12,2) not null default 0,
  criado_em timestamp with time zone default now()
);

-- 5) Índices
create index if not exists idx_registros_ajudante on registros(ajudante_id);
create index if not exists idx_receitas_registro on receitas(registro_id);
create index if not exists idx_despesas_registro on despesas(registro_id);
