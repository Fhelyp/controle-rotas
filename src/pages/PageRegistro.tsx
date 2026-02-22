import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Spinner } from '../components/Spinner'
import { Trash2, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Motorista, Veiculo, Rota, Registro } from '../types'

function today() {
  return new Date().toISOString().split('T')[0]
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function PageRegistro() {
  const [data, setData] = useState(today())
  const [motoristaId, setMotoristaId] = useState('')
  const [veiculoId, setVeiculoId] = useState('')
  const [rotaId, setRotaId] = useState('')
  const [obs, setObs] = useState('')

  const [motoristas, setMotoristas] = useState<Motorista[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [rotas, setRotas] = useState<Rota[]>([])
  const [registros, setRegistros] = useState<Registro[]>([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const loadOptions = useCallback(async () => {
    const [m, v, r] = await Promise.all([
      supabase.from('motoristas').select('*').order('nome'),
      supabase.from('veiculos').select('*').order('nome'),
      supabase.from('rotas').select('*').order('nome'),
    ])
    if (m.data) setMotoristas(m.data)
    if (v.data) setVeiculos(v.data)
    if (r.data) setRotas(r.data)
  }, [])

  const loadRegistros = useCallback(async () => {
    setLoading(true)
    const { data: rows } = await supabase
      .from('registros')
      .select('*, motoristas(nome), veiculos(nome), rotas(nome)')
      .eq('data', data)
      .order('criado_em', { ascending: false })
    if (rows) setRegistros(rows as Registro[])
    setLoading(false)
  }, [data])

  useEffect(() => { loadOptions() }, [loadOptions])
  useEffect(() => { loadRegistros() }, [loadRegistros])

  const handleSave = async () => {
    setError('')
    if (!motoristaId || !veiculoId || !rotaId) {
      setError('Selecione motorista, veículo e rota antes de salvar.')
      return
    }
    setSaving(true)
    const { error: err } = await supabase.from('registros').insert({
      data,
      motorista_id: motoristaId,
      veiculo_id: veiculoId,
      rota_id: rotaId,
      observacoes: obs || null,
    })
    setSaving(false)
    if (err) {
      setError('Erro ao salvar registro. Tente novamente.')
      return
    }
    setMotoristaId('')
    setVeiculoId('')
    setRotaId('')
    setObs('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
    loadRegistros()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este registro?')) return
    await supabase.from('registros').delete().eq('id', id)
    loadRegistros()
  }

  const selectCls = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 appearance-none focus:outline-none focus:border-brand-500 transition-colors'

  return (
    <div className="px-4 pt-6 pb-28 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-brand-500 font-semibold uppercase tracking-widest mb-1">Nova entrada</p>
        <h1 className="text-2xl font-bold text-white">Registro de Rota</h1>
      </div>

      {/* Feedback */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-xl px-4 py-3 text-sm text-green-300">
          <CheckCircle2 size={16} className="shrink-0" />
          Registro salvo com sucesso!
        </div>
      )}

      {/* Form */}
      <div className="space-y-3">
        {/* Data */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 ml-1">Data</label>
          <input
            type="date"
            value={data}
            max={today()}
            onChange={e => setData(e.target.value)}
            className={selectCls}
          />
        </div>

        {/* Motorista */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 ml-1">Motorista</label>
          <div className="relative">
            <select value={motoristaId} onChange={e => setMotoristaId(e.target.value)} className={selectCls}>
              <option value="">Selecione um motorista...</option>
              {motoristas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {motoristas.length === 0 && (
            <p className="text-xs text-slate-500 mt-1 ml-1">Nenhum motorista cadastrado. Acesse Configurações.</p>
          )}
        </div>

        {/* Rota */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 ml-1">Rota</label>
          <div className="relative">
            <select value={rotaId} onChange={e => setRotaId(e.target.value)} className={selectCls}>
              <option value="">Selecione uma rota...</option>
              {rotas.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Veículo */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 ml-1">Veículo</label>
          <div className="relative">
            <select value={veiculoId} onChange={e => setVeiculoId(e.target.value)} className={selectCls}>
              <option value="">Selecione um veículo...</option>
              {veiculos.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 ml-1">Observações <span className="text-slate-600">(opcional)</span></label>
          <textarea
            value={obs}
            onChange={e => setObs(e.target.value)}
            rows={3}
            placeholder="Algum comentário sobre esta rota..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? <Spinner size={18} /> : null}
          {saving ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </div>

      {/* Lista do dia */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300">
            Registros — <span className="text-brand-400">{formatDate(data)}</span>
          </h2>
          <span className="text-xs text-slate-500">{registros.length} entrada{registros.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : registros.length === 0 ? (
          <div className="text-center py-10 text-slate-600">
            <p className="text-sm">Nenhum registro nesta data.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {registros.map(r => (
              <div key={r.id} className="bg-slate-800 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-white truncate">{r.motoristas?.nome}</p>
                    <p className="text-xs text-brand-400 mt-0.5">{r.rotas?.nome}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.veiculos?.nome}</p>
                    {r.observacoes && (
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{r.observacoes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="shrink-0 text-slate-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
