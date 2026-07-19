import { Receipt, ArrowUpRight, FileText } from "lucide-react";

import useEnterprise from "../../../store/enterprise.store";
import { useAlert } from "../../../components/Alert";
import { formatDocument } from "../../../utils/format";

import EmpresaForm from "../components/Form/Company.Form";

type EnterpriseLike = {
  nomeFantasia?: string;
  name?: string;
  cpfCnpj?: string;
  urlLogo?: string;
};

const EmpresaAside = () => {
  const { enterprise } = useEnterprise();
  const alert = useAlert();
  const ent = (enterprise ?? {}) as EnterpriseLike;

  const nome = ent.nomeFantasia || ent.name || "Sua empresa";
  const doc = ent.cpfCnpj ? formatDocument(ent.cpfCnpj) : "—";

  const initials =
    nome
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "E";

  return (
    <div className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-0">
      {/* Card da logo */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#1b1830] to-[#15132a] p-6">
        {/* brilho decorativo */}
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#7c6ef5]/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-[#7c6ef5]/25 blur-lg" />
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-[#7c6ef5]/40 bg-[#0e0d1a] shadow-[0_12px_40px_-16px_rgba(124,110,245,0.7)]">
              {ent.urlLogo ? (
                <img src={ent.urlLogo} alt={nome} className="h-full w-full object-cover" />
              ) : (
                <span className="bg-gradient-to-br from-[#7c6ef5] to-[#a78bfa] bg-clip-text text-4xl font-bold text-transparent">
                  {initials}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#f1eeff]">{nome}</p>
            <p className="mt-0.5 flex items-center justify-center gap-1.5 text-[12px] text-[#8a86b0]">
              <FileText size={12} className="text-[#6b66a0]" />
              {doc}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0f6e56]/25 px-3 py-1 text-[11px] font-medium text-[#5dcaa5] ring-1 ring-[#5dcaa5]/25">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5dcaa5]" /> Conta ativa
          </span>

          {!ent.urlLogo && (
            <p className="text-[11px] leading-relaxed text-[#6b66a0]">
              Adicione a <span className="text-[#8a86b0]">URL do logo</span> na Identificação para exibi-lo aqui.
            </p>
          )}
        </div>
      </div>

      {/* Faturas */}
      <button
        type="button"
        onClick={() => alert.info("Faturas", "O histórico de faturas ainda será integrado.")}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#15132a] p-4 text-left transition-colors hover:bg-white/[0.03]"
      >
        <span className="flex items-center gap-2.5 text-[13px] text-[#e8e4ff]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c6ef5]/[0.15]">
            <Receipt size={16} className="text-[#9b8ff5]" />
          </span>
          Ver faturas
        </span>
        <ArrowUpRight size={16} className="text-[#6b66a0]" />
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Tab                                                               */
/* ------------------------------------------------------------------ */

const EmpresaPage = () => {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto xl:grid-cols-3">
        {/* Formulário único */}
        <div className="min-w-0 xl:col-span-2">
          <EmpresaForm />
        </div>

        {/* Logo + faturas */}
        <aside className="min-w-0">
          <EmpresaAside />
        </aside>
      </div>
    </div>
  );
};

export default EmpresaPage;
