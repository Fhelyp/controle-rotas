-- ================================================================
-- SEED — Cadastros iniciais (motoristas, ajudantes, veículos, rotas)
-- Rode no SQL Editor do Supabase. É anti-duplicado: só insere o que
-- ainda não existe (comparação ignora maiúsculas/minúsculas).
-- Pode rodar várias vezes sem criar repetidos.
-- ================================================================

-- ── Motoristas ──
insert into motoristas (nome)
select v.nome from (values
  ('Thiago'), ('Edinaldo'), ('Carlos'), ('Jhon'),
  ('Ricardo'), ('Aryadni'), ('Luis')
) as v(nome)
where not exists (select 1 from motoristas m where lower(m.nome) = lower(v.nome));

-- ── Ajudantes ──
insert into ajudantes (nome)
select v.nome from (values
  ('Carlos'), ('Ubiraci'), ('Walisson'),
  ('Messias'), ('Cayque'), ('Alexandre')
) as v(nome)
where not exists (select 1 from ajudantes a where lower(a.nome) = lower(v.nome));

-- ── Veículos (caminhões) ──
insert into veiculos (nome)
select v.nome from (values
  ('Big'), ('Esquentadinho'), ('Azul'), ('Fofo'),
  ('Mini'), ('Grandão'), ('Novinho')
) as v(nome)
where not exists (select 1 from veiculos ve where lower(ve.nome) = lower(v.nome));

-- ── Rotas ──
insert into rotas (nome)
select v.nome from (values
  ('JFC - 01'), ('JFC - 02'), ('JFC - Arapiraca'), ('JFC - Extra'),
  ('LUZ - Urbana'), ('LUZ - Coruripe'), ('LUZ - Sertão'),
  ('LUZ - Agreste'), ('LUZ - Maragogi')
) as v(nome)
where not exists (select 1 from rotas r where lower(r.nome) = lower(v.nome));
