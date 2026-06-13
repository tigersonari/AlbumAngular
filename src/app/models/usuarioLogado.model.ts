export interface UsuarioLogado {
  id: number;
  nome: string;
  login: string;
  email?: string;
  telefone?: string;
  perfil: 'ADM' | 'USER';
  token: string;
}