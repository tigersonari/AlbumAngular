export interface UsuarioLogado {
  telefone: string;
  email: string;
  id: number;
  nome: string;
  login: string;
  perfil: 'ADM' | 'USER';
  token: string;
}