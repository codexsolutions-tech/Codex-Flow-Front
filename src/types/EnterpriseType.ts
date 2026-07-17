interface EnterpriseType {
  codigoEmpresa: string;
  nomeRepresentante: string;
  nomeFantasia: string;
  cpfCnpj: string;
  inscMunicipal?: string;
  urlLogo?: string;
  urlImagem?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  contato?: {
    telefone?: number;
    celular?: string;
    whatsapp?: string;
    email?: string;
  };
}

export default EnterpriseType;
