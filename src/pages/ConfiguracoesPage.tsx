import { memo, useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Camera,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Save,
  CircleCheck,
  Building2,
  FileText,
  Hash,
  MapPin,
  Smartphone,
  MessageCircle,
  Image as ImageIcon,
  Palette,
  Moon,
  Sun,
} from "lucide-react";

import useAuth from "../store/AuthStore/useAuth";
import useEnterprise from "../store/EnterpriseStore/useEnterprise";

import { onlyDigits } from "../utils/format";


const maskCpfCnpj = (v: string) => {
  const d = onlyDigits(v).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

const maskCep = (v: string) =>
  onlyDigits(v)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");

const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

/* ------------------------------- Constantes ------------------------------- */

const TABS = [
  { id: "perfil", label: "Perfil", icon: <User size={16} /> },
  { id: "empresa", label: "Empresa", icon: <Building2 size={16} /> },
  { id: "aparencia", label: "Aparência", icon: <Palette size={16} /> },
];

/* --------------------------- Componentes reutilizáveis --------------------------- */

const Card = memo(({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-[#15132a] p-5">
    <div className="mb-4">
      <p className="text-sm text-[#e8e4ff]">{title}</p>
      {desc && <p className="mt-0.5 text-xs text-[#6b6890]">{desc}</p>}
    </div>
    {children}
  </div>
));

type FieldProps = {
  label: string;
  icon: ReactNode;
  value: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
};

/**
 * Field com espaço reservado para o erro — nunca causa "salto"
 * no layout quando a mensagem aparece.
 */
const Field = memo(
  ({ label, icon, value, onChange, onBlur, placeholder, type = "text", disabled, error }: FieldProps) => (
    <div className="flex flex-col">
      <label className="mb-1.5 text-[11px] uppercase tracking-wider text-[#4e4a72]">{label}</label>
      <div
        className={`flex items-center gap-2.5 rounded-xl border px-3.5 transition-all ${
          disabled
            ? "border-white/[0.08] bg-white/[0.02] opacity-60"
            : error
              ? "border-[#f05050]/60 bg-white/[0.04] focus-within:ring-[3px] focus-within:ring-[#f05050]/15"
              : "border-white/[0.08] bg-white/[0.04] focus-within:border-[#7c6ef5]/50 focus-within:ring-[3px] focus-within:ring-[#7c6ef5]/12"
        }`}
      >
        <span className="shrink-0 text-[#5e5a82]">{icon}</span>
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent py-3 text-sm text-[#e8e4ff] outline-none placeholder:text-[#6f6a93] disabled:cursor-not-allowed"
        />
      </div>
      <p
        role={error ? "alert" : undefined}
        className={`mt-1 min-h-[14px] text-[10px] leading-[14px] ${error ? "text-[#f09595]" : "invisible"}`}
      >
        {error || " "}
      </p>
    </div>
  ),
);

const Segmented = memo(
  ({
    value,
    options,
    onChange,
  }: {
    value: string;
    options: { id: string; label: string; icon?: ReactNode }[];
    onChange: (id: string) => void;
  }) => (
    <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
              active ? "bg-[#7c6ef5]/[0.22] text-[#c4baff]" : "text-[#8a86b0] hover:bg-white/[0.04]"
            }`}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  ),
);

function useSaver() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);
  return { saving, saved, save };
}

const SaveRow = ({
  saving,
  saved,
  onSave,
  savedLabel = "Alterações salvas",
  label = "Salvar",
  icon = <Save size={15} />,
  variant = "primary",
  disabled,
}: {
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  savedLabel?: string;
  label?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) => (
  <div className="flex items-center justify-end gap-3">
    {saved && !saving && (
      <span className="flex items-center gap-1.5 text-xs text-[#5dcaa5]">
        <CircleCheck size={14} /> {savedLabel}
      </span>
    )}
    <button
      type="button"
      onClick={onSave}
      disabled={saving || disabled}
      className={
        variant === "primary"
          ? "inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#7c6ef5] to-[#a78bfa] px-5 py-2.5 text-sm text-white shadow-[0_0_16px_rgba(124,110,245,0.45)] transition-all hover:shadow-[0_0_24px_rgba(124,110,245,0.7)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          : "inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.06] px-5 py-2.5 text-sm text-[#c4baff] transition-all hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {icon}
      {saving ? "Salvando…" : label}
    </button>
  </div>
);

/* ---------------------------------- Perfil ---------------------------------- */

const PerfilTab = () => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const profileSaver = useSaver();
  const pwdSaver = useSaver();

  const [photo, setPhoto] = useState<string | null>(user?.image ?? null);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  const initials = useMemo(
    () =>
      form.name
        ?.split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "U",
    [form.name],
  );

  const set = useCallback((k: string, v: string) => setForm((f) => ({ ...f, [k]: v })), []);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // 2MB
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const pwdError = pwd.confirm && pwd.confirm !== pwd.next ? "Senhas diferentes" : undefined;
  const canUpdatePwd = Boolean(pwd.current && pwd.next && pwd.next === pwd.confirm);

  return (
    <div className="flex flex-col gap-5">
      <Card title="Meu perfil" desc="Foto e informações pessoais.">
        {/* Foto */}
        <div className="mb-5 flex flex-wrap items-center gap-4">
          {photo ? (
            <img src={photo} alt="Foto" className="h-20 w-20 rounded-2xl border border-[#7c6ef5]/40 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#7c6ef5]/40 bg-gradient-to-br from-[#534AB7] to-[#a78bfa] text-2xl text-white">
              {initials}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.06] px-4 py-2 text-sm text-[#c4baff] transition-all hover:bg-white/[0.12]"
            >
              <Camera size={15} /> Trocar foto
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#e24b4a]/25 bg-[#a22d2d]/20 px-4 py-2 text-sm text-[#f09595] transition-all hover:bg-[#a22d2d]/30"
              >
                <Trash2 size={15} /> Remover
              </button>
            )}
          </div>
        </div>

        {/* Dados */}
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field
            label="Nome completo"
            icon={<User size={15} />}
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="Seu nome"
          />
          <Field
            label="E-mail"
            icon={<Mail size={15} />}
            value={form.email}
            onChange={(v) => set("email", v)}
            type="email"
            placeholder="voce@empresa.com"
          />
          <Field
            label="Telefone"
            icon={<Phone size={15} />}
            value={form.phone}
            onChange={(v) => set("phone", maskPhone(v))}
            placeholder="(00) 00000-0000"
          />
          <Field label="Cargo" icon={<Briefcase size={15} />} value={form.role} disabled />
        </div>

        <SaveRow {...profileSaver} onSave={profileSaver.save} />
      </Card>

      <Card title="Alterar senha" desc="Use uma senha forte e única.">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          {/* Senha atual — precisa do botão show/hide então não usa o Field */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-[11px] uppercase tracking-wider text-[#4e4a72]">Senha atual</label>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 transition-all focus-within:border-[#7c6ef5]/50 focus-within:ring-[3px] focus-within:ring-[#7c6ef5]/12">
              <Lock size={15} className="shrink-0 text-[#5e5a82]" />
              <input
                type={showPwd ? "text" : "password"}
                value={pwd.current}
                onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                placeholder="••••••••"
                className="w-full min-w-0 bg-transparent py-3 text-sm text-[#e8e4ff] outline-none placeholder:text-[#6f6a93]"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="shrink-0 text-[#5e5a82] transition-colors hover:text-[#a99ff0]"
                aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="invisible mt-1 min-h-[14px] text-[10px] leading-[14px]">.</p>
          </div>

          <Field
            label="Nova senha"
            icon={<Lock size={15} />}
            value={pwd.next}
            onChange={(v) => setPwd((p) => ({ ...p, next: v }))}
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
          />
          <Field
            label="Confirmar"
            icon={<Lock size={15} />}
            value={pwd.confirm}
            onChange={(v) => setPwd((p) => ({ ...p, confirm: v }))}
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            error={pwdError}
          />
        </div>

        <SaveRow
          {...pwdSaver}
          onSave={pwdSaver.save}
          label="Atualizar senha"
          savedLabel="Senha atualizada"
          icon={<Shield size={15} />}
          variant="secondary"
          disabled={!canUpdatePwd}
        />
      </Card>
    </div>
  );
};

/* --------------------------------- Empresa --------------------------------- */

const EmpresaTab = () => {
  const { enterprise } = useEnterprise();
  const saver = useSaver();

  // Fallback defensivo enquanto a store não tem tipagem forte
  const e = (enterprise ?? {}) as Record<string, any>;

  const [form, setForm] = useState({
    nomeFantasia: e.nomeFantasia ?? e.name ?? "",
    nomeRepresentante: e.nomeRepresentante ?? "",
    cpfCnpj: maskCpfCnpj(e.cpfCnpj ?? ""),
    inscMunicipal: e.inscMunicipal ?? "",
    urlLogo: e.urlLogo ?? "",
    urlImagem: e.urlImagem ?? "",
    email: e.contato?.email ?? "",
    celular: maskPhone(e.contato?.celular ?? ""),
    telefone: maskPhone(e.contato?.telefone ?? ""),
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
      /* silencioso — quem tá vendo é o campo, sem toast */
    }
  }, [form.cep]);

  return (
    <div className="flex flex-col gap-5">
      <Card title="Identificação" desc="Dados principais da empresa.">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field
            label="Nome fantasia"
            icon={<Building2 size={15} />}
            value={form.nomeFantasia}
            onChange={(v) => set("nomeFantasia", v)}
            placeholder="Nome da empresa"
          />
          <Field
            label="Representante"
            icon={<User size={15} />}
            value={form.nomeRepresentante}
            onChange={(v) => set("nomeRepresentante", v)}
            placeholder="Nome do responsável"
          />
          <Field label="CPF ou CNPJ" icon={<FileText size={15} />} value={form.cpfCnpj} disabled />
          <Field
            label="Inscrição municipal"
            icon={<Hash size={15} />}
            value={form.inscMunicipal}
            onChange={(v) => set("inscMunicipal", v)}
            placeholder="Opcional"
          />
          <Field
            label="URL do logo"
            icon={<ImageIcon size={15} />}
            value={form.urlLogo}
            onChange={(v) => set("urlLogo", v)}
            placeholder="https://..."
          />
          <Field
            label="URL da imagem"
            icon={<ImageIcon size={15} />}
            value={form.urlImagem}
            onChange={(v) => set("urlImagem", v)}
            placeholder="https://..."
          />
        </div>
      </Card>

      <Card title="Contato" desc="Como seus clientes falam com você.">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field
            label="E-mail"
            icon={<Mail size={15} />}
            value={form.email}
            onChange={(v) => set("email", v)}
            type="email"
            placeholder="empresa@email.com"
          />
          <Field
            label="Celular"
            icon={<Smartphone size={15} />}
            value={form.celular}
            onChange={(v) => set("celular", maskPhone(v))}
            placeholder="(00) 00000-0000"
          />
          <Field
            label="Telefone"
            icon={<Phone size={15} />}
            value={form.telefone}
            onChange={(v) => set("telefone", maskPhone(v))}
            placeholder="(00) 0000-0000"
          />
          <Field
            label="WhatsApp"
            icon={<MessageCircle size={15} />}
            value={form.whatsapp}
            onChange={(v) => set("whatsapp", maskPhone(v))}
            placeholder="(00) 00000-0000"
          />
        </div>
      </Card>

      <Card title="Endereço" desc="Onde a empresa está localizada.">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          <Field
            label="CEP"
            icon={<MapPin size={15} />}
            value={form.cep}
            onChange={(v) => set("cep", maskCep(v))}
            onBlur={buscarCep}
            placeholder="00000-000"
          />
          <div className="sm:col-span-2">
            <Field
              label="Logradouro"
              icon={<MapPin size={15} />}
              value={form.logradouro}
              onChange={(v) => set("logradouro", v)}
              placeholder="Rua, avenida..."
            />
          </div>
          <Field
            label="Número"
            icon={<Hash size={15} />}
            value={form.numero}
            onChange={(v) => set("numero", v)}
            placeholder="123"
          />
          <Field
            label="Complemento"
            icon={<Hash size={15} />}
            value={form.complemento}
            onChange={(v) => set("complemento", v)}
            placeholder="Opcional"
          />
          <Field
            label="Bairro"
            icon={<MapPin size={15} />}
            value={form.bairro}
            onChange={(v) => set("bairro", v)}
            placeholder="Bairro"
          />
          <div className="sm:col-span-2">
            <Field
              label="Cidade"
              icon={<Building2 size={15} />}
              value={form.cidade}
              onChange={(v) => set("cidade", v)}
              placeholder="Cidade"
            />
          </div>

          {/* UF (select) */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-[11px] uppercase tracking-wider text-[#4e4a72]">UF</label>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 transition-all focus-within:border-[#7c6ef5]/50 focus-within:ring-[3px] focus-within:ring-[#7c6ef5]/12">
              <MapPin size={15} className="shrink-0 text-[#5e5a82]" />
              <select
                value={form.uf}
                onChange={(ev) => set("uf", ev.target.value)}
                className="w-full min-w-0 appearance-none bg-transparent py-3 text-sm text-[#e8e4ff] outline-none [&>option]:bg-[#15132a]"
              >
                <option value="">Selecione</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <p className="invisible mt-1 min-h-[14px] text-[10px] leading-[14px]">.</p>
          </div>
        </div>
      </Card>

      <SaveRow {...saver} onSave={saver.save} savedLabel="Empresa atualizada" />
    </div>
  );
};

/* -------------------------------- Aparência ------------------------------- */

const AparenciaTab = () => {
  // TODO: conectar a um ThemeContext / localStorage para persistir
  const [theme, setTheme] = useState("escuro");

  return (
    <div className="flex flex-col gap-5">
      <Card title="Tema" desc="Escolha como prefere ver o sistema. A alteração é aplicada na hora.">
        <Segmented
          value={theme}
          onChange={setTheme}
          options={[
            { id: "escuro", label: "Escuro", icon: <Moon size={15} /> },
            { id: "claro", label: "Claro", icon: <Sun size={15} /> },
          ]}
        />
      </Card>
    </div>
  );
};

/* ----------------------------------- Page ---------------------------------- */

const ConfiguracoesPage = () => {
  const [tab, setTab] = useState("perfil");

  const content = useMemo(() => {
    switch (tab) {
      case "empresa":
        return <EmpresaTab />;
      case "aparencia":
        return <AparenciaTab />;
      default:
        return <PerfilTab />;
    }
  }, [tab]);

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#0e0d1a] text-[#e8e4ff]">
      <div className="pointer-events-none absolute -right-28 -top-32 z-0 h-80 w-80 rounded-full bg-[#7c6ef5] opacity-[0.1] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 z-0 h-72 w-72 rounded-full bg-[#a78bfa] opacity-[0.07] blur-[120px]" />

      <div className="relative z-10 flex w-full flex-col gap-6 p-4 md:p-6">
        <header className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6ef5] to-[#a78bfa] shadow-[0_0_14px_rgba(124,110,245,0.45)]">
            <Palette size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl text-[#e8e4ff]">Configurações</h1>
            <p className="text-xs text-[#6b6890]">Perfil, empresa e aparência</p>
          </div>
        </header>

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <nav className="flex gap-1.5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#15132a] p-1.5 md:w-52 md:flex-shrink-0 md:flex-col md:overflow-visible">
            {TABS.map((t) => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex flex-shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#7c6ef5]/[0.22] to-[#7c6ef5]/[0.04] text-[#c4baff]"
                      : "text-[#8a86b0] hover:bg-white/[0.05]"
                  }`}
                >
                  <span className={active ? "text-[#a78bfa]" : "text-[#6b6890]"}>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div className="min-w-0 flex-1">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
