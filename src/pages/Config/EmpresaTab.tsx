import { useCallback, useState } from "react";
import {
  Building2,
  User,
  FileText,
  Hash,
  Image as ImageIcon,
  MessageCircle,
  Mail,
  Phone,
  Smartphone,
  MapPin,
} from "lucide-react";

import useEnterprise from "../../store/EnterpriseStore/useEnterprise";
import { onlyDigits } from "../../utils/format";
import Field from "../../components/Input/Field";

import { SettingsCard, SaveRow, SelectField, useSaver, maskCpfCnpj, maskCep, maskPhone, UFS } from "./ui";

const EmpresaTab = () => {
  const { enterprise } = useEnterprise();
  const e = (enterprise ?? {}) as Record<string, any>;

  const idSaver = useSaver();
  const contatoSaver = useSaver();
  const endSaver = useSaver();

  const [form, setForm] = useState({
    nomeFantasia: e.nomeFantasia ?? e.name ?? "",
    nomeRepresentante: e.nomeRepresentante ?? "",
    cpfCnpj: maskCpfCnpj(e.cpfCnpj ?? ""),
    inscMunicipal: e.inscMunicipal ?? "",
    urlLogo: e.urlLogo ?? "",
    urlImagem: e.urlImagem ?? "",
    email: e.contato?.email ?? "",
    celular: maskPhone(e.contato?.celular ?? ""),
    telefone: maskPhone(String(e.contato?.telefone ?? "")),
    whatsapp: maskPhone(e.contato?.whatsapp ?? ""),
    cep: maskCep(e.endereco?.cep ?? ""),
    logradouro: e.endereco?.logradouro ?? "",
    numero: e.endereco?.numero ?? "",
    complemento: e.endereco?.complemento ?? "",
    bairro: e.endereco?.bairro ?? "",
    cidade: e.endereco?.cidade ?? "",
    uf: e.endereco?.uf ?? "",
  });

  const set = useCallback((k: string, v: string) => setForm((f) => ({ ...f, [k]: v })), []);

  const buscarCep = useCallback(async () => {
    const cep = onlyDigits(form.cep);
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setForm((f) => ({
        ...f,
        logradouro: data.logradouro ?? f.logradouro,
        bairro: data.bairro ?? f.bairro,
        cidade: data.localidade ?? f.cidade,
        uf: data.uf ?? f.uf,
      }));
    } catch {
      /* silencioso */
    }
  }, [form.cep]);

  return (
    <div className="flex flex-col gap-5">
      <SettingsCard
        icon={<Building2 className="h-4 w-4" />}
        title="Identificação"
        desc="Dados principais da empresa."
        footer={<SaveRow {...idSaver} onSave={idSaver.save} savedLabel="Identificação atualizada" />}
      >
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field
            label="Nome fantasia"
            icon={<Building2 size={15} />}
            value={form.nomeFantasia}
            onChange={(ev) => set("nomeFantasia", ev.target.value)}
            placeholder="Nome da empresa"
          />
          <Field
            label="Representante"
            icon={<User size={15} />}
            value={form.nomeRepresentante}
            onChange={(ev) => set("nomeRepresentante", ev.target.value)}
            placeholder="Nome do responsável"
          />
          <Field
            label="CPF ou CNPJ"
            icon={<FileText size={15} />}
            value={form.cpfCnpj}
            hint="Não editável"
            disabled
            readOnly
          />
          <Field
            label="Inscrição municipal"
            icon={<Hash size={15} />}
            value={form.inscMunicipal}
            onChange={(ev) => set("inscMunicipal", ev.target.value)}
            placeholder="Opcional"
          />
          <Field
            label="URL do logo"
            icon={<ImageIcon size={15} />}
            value={form.urlLogo}
            onChange={(ev) => set("urlLogo", ev.target.value)}
            placeholder="https://..."
          />
          <Field
            label="URL da imagem"
            icon={<ImageIcon size={15} />}
            value={form.urlImagem}
            onChange={(ev) => set("urlImagem", ev.target.value)}
            placeholder="https://..."
          />
        </div>
      </SettingsCard>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <SettingsCard
          icon={<MessageCircle className="h-4 w-4" />}
          title="Contato"
          desc="Como seus clientes falam com você."
          footer={<SaveRow {...contatoSaver} onSave={contatoSaver.save} savedLabel="Contato atualizado" />}
        >
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <Field
              label="E-mail"
              icon={<Mail size={15} />}
              value={form.email}
              onChange={(ev) => set("email", ev.target.value)}
              type="email"
              placeholder="empresa@email.com"
            />
            <Field
              label="Celular"
              icon={<Smartphone size={15} />}
              value={form.celular}
              onChange={(ev) => set("celular", maskPhone(ev.target.value))}
              placeholder="(00) 00000-0000"
            />
            <Field
              label="Telefone"
              icon={<Phone size={15} />}
              value={form.telefone}
              onChange={(ev) => set("telefone", maskPhone(ev.target.value))}
              placeholder="(00) 0000-0000"
            />
            <Field
              label="WhatsApp"
              icon={<MessageCircle size={15} />}
              value={form.whatsapp}
              onChange={(ev) => set("whatsapp", maskPhone(ev.target.value))}
              placeholder="(00) 00000-0000"
            />
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<MapPin className="h-4 w-4" />}
          title="Endereço"
          desc="Onde a empresa está localizada."
          footer={<SaveRow {...endSaver} onSave={endSaver.save} savedLabel="Endereço atualizado" />}
        >
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <Field
              label="CEP"
              icon={<MapPin size={15} />}
              value={form.cep}
              onChange={(ev) => set("cep", maskCep(ev.target.value))}
              onBlur={buscarCep}
              placeholder="00000-000"
            />
            <Field
              label="Número"
              icon={<Hash size={15} />}
              value={form.numero}
              onChange={(ev) => set("numero", ev.target.value)}
              placeholder="123"
            />
            <div className="sm:col-span-2">
              <Field
                label="Logradouro"
                icon={<MapPin size={15} />}
                value={form.logradouro}
                onChange={(ev) => set("logradouro", ev.target.value)}
                placeholder="Rua, avenida..."
              />
            </div>
            <Field
              label="Bairro"
              icon={<MapPin size={15} />}
              value={form.bairro}
              onChange={(ev) => set("bairro", ev.target.value)}
              placeholder="Bairro"
            />
            <Field
              label="Complemento"
              icon={<Hash size={15} />}
              value={form.complemento}
              onChange={(ev) => set("complemento", ev.target.value)}
              placeholder="Opcional"
            />
            <Field
              label="Cidade"
              icon={<Building2 size={15} />}
              value={form.cidade}
              onChange={(ev) => set("cidade", ev.target.value)}
              placeholder="Cidade"
            />
            <SelectField label="UF" icon={<MapPin size={15} />} value={form.uf} onChange={(v) => set("uf", v)}>
              <option value="">—</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </SelectField>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default EmpresaTab;
