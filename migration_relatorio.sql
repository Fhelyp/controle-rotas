-- ================================================================
-- MIGRAÇÃO — Relatório completo (PIN admin) + rota "# BASE"
-- Rode UMA vez no SQL Editor do Supabase. Aditivo e idempotente.
-- ================================================================

-- 1) Tabela de configurações (guarda o HASH do PIN de admin)
create table if not exists config (
  chave text primary key,
  valor text
);

-- 2) PIN de administrador do relatório completo.
--    Guardamos só o hash SHA-256 (o PIN em si NÃO fica no banco).
--    Hash abaixo corresponde ao PIN: 1762
--    Para trocar o PIN, gere o novo hash (ex.: echo -n 'NOVOPIN' | sha256sum)
--    e atualize o valor desta linha.
insert into config (chave, valor) values
  ('admin_senha_hash', 'a4fd40788cd53f2f10dc480f6b73edc91a399144f79598869160dcdcb2a1ef58')
on conflict (chave) do update set valor = excluded.valor;

-- 3) Rota especial "# BASE" (motorista ficou na base, sem rota/veículo)
insert into rotas (nome)
select '# BASE'
where not exists (select 1 from rotas r where lower(r.nome) = lower('# BASE'));
