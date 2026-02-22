export interface Motorista {
  id: string
  nome: string
  criado_em: string
}

export interface Veiculo {
  id: string
  nome: string
  criado_em: string
}

export interface Rota {
  id: string
  nome: string
  criado_em: string
}

export interface Registro {
  id: string
  data: string
  motorista_id: string
  veiculo_id: string
  rota_id: string
  observacoes: string | null
  criado_em: string
  motoristas?: { nome: string }
  veiculos?: { nome: string }
  rotas?: { nome: string }
}

export type Page = 'registro' | 'relatorio' | 'configuracoes'
