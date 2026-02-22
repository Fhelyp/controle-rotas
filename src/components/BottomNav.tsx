import { ClipboardList, BarChart2, Settings, type LucideIcon } from 'lucide-react'
import type { Page } from '../types'

interface Props {
  current: Page
  onChange: (p: Page) => void
}

const tabs: { id: Page; label: string; Icon: LucideIcon }[] = [
  { id: 'registro', label: 'Registro', Icon: ClipboardList },
  { id: 'relatorio', label: 'Relatório', Icon: BarChart2 },
  { id: 'configuracoes', label: 'Config.', Icon: Settings },
]

export function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700/60 safe-bottom z-50">
      <div className="flex max-w-lg mx-auto">
        {tabs.map(({ id, label, Icon }) => {
          const active = current === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                active ? 'text-brand-500' : 'text-slate-500'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[11px] font-${active ? '600' : '400'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
