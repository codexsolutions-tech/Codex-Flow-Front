export default interface UserType {
  id: string;
  email: string;
  cargo: string;
  permissao: string;
  codigoEmpresa: string;

  nome?: string;
  phone?: string;
  image?: string;
}
