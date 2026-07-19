import { z } from "zod";
import { onlyDigits } from "../../../utils/format";

/* Helpers -------------------------------------------------------------- */

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), "URL inválida");

const optionalPhone = z.string().refine((v) => {
  const d = onlyDigits(v);
  return d === "" || d.length === 10 || d.length === 11;
}, "Número inválido");

const cepField = z.string().refine((v) => {
  const d = onlyDigits(v);
  return d === "" || d.length === 8;
}, "CEP inválido");

/* Schema único da empresa --------------------------------------------- */

export const empresaSchema = z.object({
  // Identificação
  nomeFantasia: z.string().min(1, "Nome fantasia obrigatório"),
  nomeRepresentante: z.string().optional().default(""),
  cpfCnpj: z.string().optional().default(""), // somente leitura
  inscMunicipal: z.string().optional().default(""),
  urlLogo: optionalUrl,
  urlImagem: optionalUrl,

  // Contato
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  celular: optionalPhone,
  telefone: optionalPhone,
  whatsapp: optionalPhone,

  // Endereço
  cep: cepField,
  logradouro: z.string().optional().default(""),
  numero: z.string().optional().default(""),
  complemento: z.string().optional().default(""),
  bairro: z.string().optional().default(""),
  cidade: z.string().optional().default(""),
  uf: z.string().optional().default(""),
});

export type EmpresaData = z.infer<typeof empresaSchema>;
