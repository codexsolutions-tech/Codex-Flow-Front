import { useMemo, useState } from "react";
import { User, Building2, Palette } from "lucide-react";

import PerfilTab from "./PerfilTab";
import EmpresaTab from "./EmpresaTab";
import AparenciaTab from "./AparenciaTab";

type TabId = "perfil" | "empresa" | "aparencia";

const TABS: { id: TabId; label: string; icon: JSX.Element }[] = [
  { id: "perfil", label: "Perfil", icon: <User size={15} /> },
  { id: "empresa", label: "Empresa", icon: <Building2 size={15} /> },
  { id: "aparencia", label: "Aparência", icon: <Palette size={15} /> },
];

const ConfiguracoesPage = () => {
  const [tab, setTab] = useState<TabId>("perfil");

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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0e0d1a] text-[#e8e4ff]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(124,110,245,0.16),transparent_70%)]" />

      <header className="relative z-20 shrink-0 border-b border-white/[0.07] bg-[#0e0d1a]/80 backdrop-blur-xl">
        <div className="px-5 pt-4 lg:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#7c6ef5]/25 bg-gradient-to-br from-[#7c6ef5]/25 to-[#a78bfa]/10">
              <Palette className="h-5 w-5 text-[#b7aef9]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold tracking-tight text-[#f1eeff]">Configurações</h1>
              <p className="text-xs text-[#6f6a93]">Perfil, empresa e aparência</p>
            </div>
          </div>

          <nav className="mt-4 flex gap-6 overflow-x-auto">
            {TABS.map((t) => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative flex shrink-0 cursor-pointer items-center gap-2 pb-3 text-[13px] font-medium transition-colors ${
                    active ? "text-[#c4baff]" : "text-[#8a85b4] hover:text-[#e8e4ff]"
                  }`}
                >
                  <span className={active ? "text-[#a78bfa]" : "text-[#6f6a93]"}>{t.icon}</span>
                  {t.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-[#7c6ef5] to-[#a78bfa]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="w-full px-5 py-6 lg:px-8">{content}</div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
