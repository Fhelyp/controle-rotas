import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Spinner } from '../components/Spinner'
import { Registro } from '../types'
import { CalendarDays, Users, Route, Truck } from 'lucide-react'

type FilterPreset = 'semana_atual' | 'semana_passada' | 'mes_atual' | 'mes_passado' | 'personalizado'

function getRange(preset: FilterPreset, from: string, to: string): { start: string; end: string } {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  if (preset === 'semana_atual') {
    const day = now.getDay()
    const mon = new Date(now); mon.setDate(now.getDate() - ((day + 6) % 7))
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
    return { start: iso(mon), end: iso(sun) }
  }
  if (preset === 'semana_passada') {
    const day = now.getDay()
    const mon = new Date(now); mon.setDate(now.getDate() - ((day + 6) % 7) - 7)
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
    return { start: iso(mon), end: iso(sun) }
  }
  if (preset === 'mes_atual') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { start: iso(start), end: iso(end) }
  }
  if (preset === 'mes_passado') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    return { start: iso(start), end: iso(end) }
  }
  return { start: from, end: to }
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function groupByDate(registros: Registro[]) {
  const map: Record<string, Registro[]> = {}
  for (const r of registros) {
    if (!map[r.data]) map[r.data] = []
    map[r.data].push(r)
  }
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
}

function top(arr: (string | undefined)[]) {
  const freq: Record<string, number> = {}
  for (const v of arr) if (v) freq[v] = (freq[v] || 0) + 1
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
}

export function PageRelatorio() {
  const today = new Date().toISOString().split('T')[0]
  const [preset, setPreset] = useState<FilterPreset>('semana_atual')
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)
  const [registros, setRegistros] = useState<Registro[]>([])
  const [loading, setLoading] = useState(false)

  const { start, end } = getRange(preset, from, to)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('registros')
      .select('*, motoristas(nome), veiculos(nome), rotas(nome)')
      .gte('data', start)
      .lte('data', end)
      .order('data', { ascending: false })
    if (data) setRegistros(data as Registro[])
    setLoading(false)
  }, [start, end])

  useEffect(() => { load() }, [load])

  const presets: { id: FilterPreset; label: string }[] = [
    { id: 'semana_atual', label: 'Sem. atual' },
    { id: 'semana_passada', label: 'Sem. passada' },
    { id: 'mes_atual', label: 'Mês atual' },
    { id: 'mes_passado', label: 'Mês passado' },
    { id: 'personalizado', label: 'Personalizado' },
  ]

  const motoristasUnicos = new Set(registros.map(r => r.motorista_id)).size
  const rotaMaisFeita = top(registros.map(r => r.rotas?.nome))
  const veiculoMaisUsado = top(registros.map(r => r.veiculos?.nome))

  const grouped = groupByDate(registros)

  const inputCls = 'flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500 transition-colors'

  return (
    <div className="px-4 pt-6 pb-28 max-w-lg mx-auto">
      <div className="mb-5">
        <p className="text-xs text-brand-500 font-semibold uppercase tracking-widest mb-1">Histórico</p>
        <h1 className="text-2xl font-bold text-white">Relatório</h1>
      </div>

      {/* Filtros */}
      <div className="mb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                preset === p.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {preset === 'personalizado' && (
          <div className="flex gap-2 mt-3">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1 ml-1">De</label>
              <input type="date" value={from} max={to} onChange={e => setFrom(e.target.value)} className={inputCls} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1 ml-1">Até</label>
              <input type="date" value={to} min={from} max={today} onChange={e => setTo(e.target.value)} className={inputCls} />
            </div>
          </div>
        )}

        <p className="text-xs text-slate-600 mt-2 ml-0.5">
          {formatDate(start)} → {formatDate(end)}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-4">
          <CalendarDays size={18} className="text-brand-500 mb-2" />
          <p className="text-2xl font-bold text-white">{registros.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total de registros</p>
        </div>
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-4">
          <Users size={18} className="text-brand-500 mb-2" />
          <p className="text-2xl font-bold text-white">{motoristasUnicos}</p>
          <p className="text-xs text-slate-500 mt-0.5">Motoristas únicos</p>
        </div>
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-4">
          <Route size={18} className="text-brand-500 mb-2" />
          <p className="text-base font-bold text-white leading-tight mt-1">{rotaMaisFeita}</p>
          <p className="text-xs text-slate-500 mt-0.5">Rota mais feita</p>
        </div>
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-4">
          <Truck size={18} className="text-brand-500 mb-2" />
          <p className="text-base font-bold text-white leading-tight mt-1">{veiculoMaisUsado}</p>
          <p className="text-xs text-slate-500 mt-0.5">Veículo mais usado</p>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : registros.length === 0 ? (
        <div className="text-center py-12 text-slate-600">
          <p className="text-sm">Nenhum registro encontrado no período.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                {formatDate(date)}
              </p>
              <div className="space-y-2">
                {items.map(r => (
                  <div key={r.id} className="bg-slate-800 border border-slate-700/60 rounded-xl p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-white">{r.motoristas?.nome}</p>
                        <p className="text-xs text-brand-400 mt-0.5">{r.rotas?.nome}</p>
                        <p className="text-xs text-slate-400">{r.veiculos?.nome}</p>
                        {r.observacoes && (
                          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{r.observacoes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
