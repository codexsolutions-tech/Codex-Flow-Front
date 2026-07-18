import { useState } from "react";
import { Palette, Moon, Sun } from "lucide-react";

import { SettingsCard } from "./ui";

const OPTIONS = [
  { id: "escuro", label: "Escuro", icon: <Moon size={15} /> },
  { id: "claro", label: "Claro", icon: <Sun size={15} /> },
];

const AparenciaTab = () => {
  const [theme, setTheme] = useState("escuro");

  return (
    <div className="max-w-2xl">
      <SettingsCard
        icon={<Palette className="h-4 w-4" />}
        title="Tema"
        desc="Escolha como prefere ver o sistema. A alteração é aplicada na hora."
      >
        <div className="grid max-w-md grid-cols-2 gap-3">
          {OPTIONS.map((o) => {
            const active = o.id === theme;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setTheme(o.id)}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-medium transition-all ${
                  active
                    ? "border-[#7c6ef5]/60 bg-[#7c6ef5]/[0.15] text-[#c4baff]"
                    : "border-white/[0.08] text-[#8a86b0] hover:border-white/[0.14] hover:bg-white/[0.03]"
                }`}
              >
                {o.icon}
                {o.label}
              </button>
            );
          })}
        </div>
      </SettingsCard>
    </div>
  );
};

export default AparenciaTab;
