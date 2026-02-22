import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { PageRegistro } from './pages/PageRegistro'
import { PageRelatorio } from './pages/PageRelatorio'
import { PageConfiguracoes } from './pages/PageConfiguracoes'
import type { Page } from './types'

export default function App() {
  const [page, setPage] = useState<Page>('registro')

  return (
    <div className="min-h-screen bg-slate-950">
      <main>
        {page === 'registro' && <PageRegistro />}
        {page === 'relatorio' && <PageRelatorio />}
        {page === 'configuracoes' && <PageConfiguracoes />}
      </main>
      <BottomNav current={page} onChange={setPage} />
    </div>
  )
}
