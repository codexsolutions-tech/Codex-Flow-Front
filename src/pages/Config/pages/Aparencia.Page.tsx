import { useState } from "react";
import { Palette, Moon, Sun, Monitor, Check, LayoutGrid, Rows3 } from "lucide-react";

import { SettingsCard } from "../ui";
import { useAlert } from "../../../components/Alert";

type ThemeId = "escuro" | "claro" | "sistema";

const THEMES: { id: ThemeId; label: string; icon: React.ReactNode }[] = [
  { id: "escuro", label: "Escuro", icon: <Moon size={14} /> },
  { id: "claro", label: "Claro", icon: <Sun size={14} /> },
  { id: "sistema", label: "Sistema", icon: <Monitor size={14} /> },
];

const ACCENTS = [
  { id: "roxo", label: "Roxo", color: "#7c6ef5" },
  { id: "azul", label: "Azul", color: "#4aa8ff" },
  { id: "verde", label: "Verde", color: "#3ecf8e" },
  { id: "rosa", label: "Rosa", color: "#f062a0" },
  { id: "laranja", label: "Laranja", color: "#f5a623" },
];

const DENSITIES = [
  { id: "confortavel", label: "Confortável", desc: "Mais espaçamento", icon: <Rows3 size={15} /> },
  { id: "compacto", label: "Compacto", desc: "Mais conteúdo por tela", icon: <LayoutGrid size={15} /> },
];

const ThemePreview = ({ id, accent }: { id: ThemeId; accent: string }) => {
  const light = id === "claro";
  const bg = light ? "#f4f3fb" : "#12111d";
  const panel = light ? "#ffffff" : "#1c1a2b";
  const line = light ? "#dcdae8" : "#2a2740";
  const soft = light ? "#e7e5f2" : "#26233a";

  return (
    <div
      className="relative mb-3 h-20 w-full overflow-hidden rounded-lg border border-white/[0.08]"
      style={{ background: bg }}
    >
      {/* faixa "sistema": metade clara / metade escura */}
      {id === "sistema" && (
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #12111d 50%, #f4f3fb 50%)" }} />
      )}
      <div className="relative flex h-full gap-1.5 p-1.5">
        <div className="flex w-1/4 flex-col gap-1 rounded-md p-1" style={{ background: panel }}>
          <div className="h-1.5 w-full rounded-full" style={{ background: accent }} />
          <div className="h-1 w-3/4 rounded-full" style={{ background: soft }} />
          <div className="h-1 w-2/3 rounded-full" style={{ background: soft }} />
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-md p-1.5" style={{ background: panel }}>
          <div className="h-1.5 w-1/2 rounded-full" style={{ background: line }} />
          <div className="mt-0.5 h-1 w-full rounded-full" style={{ background: soft }} />
          <div className="h-1 w-5/6 rounded-full" style={{ background: soft }} />
          <div className="mt-auto h-2.5 w-1/3 self-end rounded" style={{ background: accent }} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Tab                                                               */
/* ------------------------------------------------------------------ */

const AparenciaTab = () => {
  const alert = useAlert();
  const [theme, setTheme] = useState<ThemeId>("escuro");
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [density, setDensity] = useState("confortavel");

  const notify = (msg: string) => alert.toast("success", msg, undefined, { position: "bottom-right", timer: 1800 });

  const trocarTema = (id: ThemeId) => {
    if (id === theme) return;
    setTheme(id);
    notify(`Tema ${THEMES.find((t) => t.id === id)?.label.toLowerCase()} aplicado`);
  };

  const trocarAccent = (a: (typeof ACCENTS)[number]) => {
    if (a.id === accent.id) return;
    setAccent(a);
    notify(`Cor ${a.label.toLowerCase()} aplicada`);
  };

  const trocarDensidade = (id: string) => {
    if (id === density) return;
    setDensity(id);
    notify(`Modo ${DENSITIES.find((d) => d.id === id)?.label.toLowerCase()} aplicado`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto lg:grid-cols-2">
        {/* Tema */}
        <SettingsCard
          icon={<Palette className="h-4 w-4" />}
          title="Tema"
          desc="Escolha como prefere ver o sistema. A alteração é aplicada na hora."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {THEMES.map((t) => {
              const active = t.id === theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => trocarTema(t.id)}
                  className={`group cursor-pointer rounded-xl border p-2.5 text-left transition-all ${
                    active
                      ? "border-[#7c6ef5]/60 bg-[#7c6ef5]/[0.1] ring-1 ring-[#7c6ef5]/40"
                      : "border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02]"
                  }`}
                >
                  <ThemePreview id={t.id} accent={accent.color} />
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#e8e4ff]">
                      {t.icon}
                      {t.label}
                    </span>
                    {active && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#7c6ef5] text-white">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </SettingsCard>

        {/* Cor de destaque */}
        <SettingsCard
          icon={<Palette className="h-4 w-4" />}
          title="Cor de destaque"
          desc="Usada em botões, links e elementos ativos."
        >
          <div className="flex flex-wrap items-center gap-3">
            {ACCENTS.map((a) => {
              const active = a.id === accent.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => trocarAccent(a)}
                  title={a.label}
                  aria-label={a.label}
                  className={`relative h-10 w-10 cursor-pointer rounded-full transition-transform hover:scale-105 ${
                    active ? "ring-2 ring-white/70 ring-offset-2 ring-offset-[#15132a]" : ""
                  }`}
                  style={{ background: a.color }}
                >
                  {active && (
                    <Check size={16} strokeWidth={3} className="absolute inset-0 m-auto text-white drop-shadow" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Preview do botão com a cor escolhida */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="text-[12px] text-[#8a86b0]">Prévia:</span>
            <button
              type="button"
              className="rounded-lg px-3.5 py-1.5 text-[12px] font-medium text-white"
              style={{ background: accent.color }}
            >
              Botão
            </button>
            <span className="text-[12px] font-medium" style={{ color: accent.color }}>
              Link de exemplo
            </span>
          </div>
        </SettingsCard>

        {/* Densidade */}
        <SettingsCard
          icon={<LayoutGrid className="h-4 w-4" />}
          title="Densidade"
          desc="Ajuste o espaçamento geral da interface."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DENSITIES.map((d) => {
              const active = d.id === density;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => trocarDensidade(d.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    active
                      ? "border-[#7c6ef5]/60 bg-[#7c6ef5]/[0.1] ring-1 ring-[#7c6ef5]/40"
                      : "border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      active ? "bg-[#7c6ef5]/20 text-[#c4baff]" : "bg-white/[0.05] text-[#8a86b0]"
                    }`}
                  >
                    {d.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#e8e4ff]">{d.label}</p>
                    <p className="truncate text-[11px] text-[#6f6a93]">{d.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default AparenciaTab;
