import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { Plus, Pencil, Trash2 } from 'lucide-react'

type Item = { id: string; nome: string }
type TableName = 'motoristas' | 'veiculos' | 'rotas'

interface SectionProps {
  title: string
  emoji: string
  table: TableName
}

function Section({ title, emoji, table }: SectionProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Item | null>(null)
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from(table).select('id, nome').order('nome')
    if (data) setItems(data)
    setLoading(false)
  }, [table])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setNome(''); setError(''); setModal('add') }
  const openEdit = (item: Item) => { setEditing(item); setNome(item.nome); setError(''); setModal('edit') }

  const handleSave = async () => {
    if (!nome.trim()) { setError('Nome não pode ser vazio.'); return }
    setSaving(true)
    setError('')
    if (modal === 'add') {
      const { error: err } = await supabase.from(table).insert({ nome: nome.trim() })
      if (err) { setError('Erro ao salvar.'); setSaving(false); return }
    } else if (editing) {
      const { error: err } = await supabase.from(table).update({ nome: nome.trim() }).eq('id', editing.id)
      if (err) { setError('Erro ao salvar.'); setSaving(false); return }
    }
    setSaving(false)
    setModal(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este item?')) return
    await supabase.from(table).delete().eq('id', id)
    load()
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-300">
          <span className="mr-1.5">{emoji}</span>{title}
          <span className="ml-2 text-xs text-slate-600 font-normal">({items.length})</span>
        </h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-400 transition-colors"
        >
          <Plus size={14} />
          Adicionar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4"><Spinner /></div>
      ) : items.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-5 text-center">
          <p className="text-xs text-slate-600">Nenhum {title.toLowerCase().slice(0, -1)} cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-3">
              <span className="text-sm text-slate-200">{item.nome}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => openEdit(item)} className="text-slate-500 hover:text-brand-400 transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'add' ? `Novo ${title.toLowerCase().slice(0, -1)}` : `Editar ${title.toLowerCase().slice(0, -1)}`}
          onClose={() => setModal(null)}
        >
          <div className="space-y-3">
            {error && <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{error}</p>}
            <input
              autoFocus
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder={`Nome do ${title.toLowerCase().slice(0, -1)}...`}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Spinner size={16} /> : null}
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export function PageConfiguracoes() {
  return (
    <div className="px-4 pt-6 pb-28 max-w-lg mx-auto">
      <div className="mb-6">
        <p className="text-xs text-brand-500 font-semibold uppercase tracking-widest mb-1">Cadastros</p>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
      </div>

      <Section title="Motoristas" emoji="👤" table="motoristas" />
      <Section title="Veículos" emoji="🚛" table="veiculos" />
      <Section title="Rotas" emoji="📍" table="rotas" />
    </div>
  )
}
