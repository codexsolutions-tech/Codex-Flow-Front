import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Package,
  Users,
  DollarSign,
  Settings,
  LogOut,
  ShoppingCart,
  BarChart3,
  Bot,
  IdCard,
  Menu,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "../store/auth.store";
import useEnterprise from "../store/enterprise.store";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { enterprise } = useEnterprise();

  const [open, setOpen] = useState(false);

  const userInitials = useMemo(
    () =>
      user?.nome
        ?.split(" ")
        .slice(0, 2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase() ?? "U",
    [user?.nome],
  );

  const companyInitial = (enterprise?.nomeFantasia || "E").trim().charAt(0).toUpperCase();
  const companyImage = enterprise?.urlLogo || enterprise?.urlImagem || "";

  const isActive = (route: string) => {
    if (route === "") {
      return pathname === "/";
    }

    return pathname === `/${route}` || pathname.startsWith(`/${route}/`);
  };

  const goto = (route: string) => {
    setOpen(false);
    navigate(route);
  };

  const handleLogout = () => {
    Promise.resolve(logout()).catch(() => {});
  };

  const item = (route: string, icon: ReactNode, label: string, disabled = false) => {
    if (disabled) {
      return (
        <div className="mb-1 flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 opacity-45">
          <span className="text-[#6b6890]">{icon}</span>
          <span className="flex-1 text-sm text-[#8a86b0]">{label}</span>
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[9px] uppercase tracking-wide text-[#6b6890]">
            Em breve
          </span>
        </div>
      );
    }
    const active = isActive(route);
    return (
      <button
        type="button"
        onClick={() => goto(route)}
        className={`relative mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
          active
            ? "bg-[#7c6ef5]/[0.14] font-medium text-[#c4baff]"
            : "text-[#8a86b0] hover:bg-white/[0.05] hover:text-[#c9c5e8]"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#7c6ef5]" />
        )}
        <span className={active ? "text-[#a99cf8]" : "text-[#6b6890]"}>{icon}</span>
        {label}
      </button>
    );
  };

  const cat = (label: string) => (
    <p className="px-3 pb-2 pt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#4e4a6e] first:pt-1">
      {label}
    </p>
  );

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="fixed left-4 bottom-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#15132a] text-[#c4baff] md:hidden"
        >
          <Menu size={18} />
        </button>
      )}

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 md:hidden" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-shrink-0 flex-col border-r border-white/[0.08] bg-[#15132a] transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Marca da empresa */}
        <div className="flex items-center gap-3.5 border-b border-white/[0.07] px-5 py-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.1] bg-[#1c1a33]">
            {companyImage ? (
              <img
                src={companyImage}
                alt={enterprise?.nomeFantasia || "Logo"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-base font-semibold text-[#c4baff]">{companyInitial}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-[#f1eeff]">
              {enterprise?.nomeFantasia || "Sua Empresa"}
            </p>
            <p className="truncate text-xs text-[#6f6a93]">Painel de gestão</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[#6b6890] hover:bg-white/[0.06] md:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-color:rgba(124,110,245,0.25)_transparent] [scrollbar-width:thin]">
          {cat("Operação")}
          {item("", <ShoppingCart size={17} />, "PDV")}

          {cat("Gerenciamento")}
          {item("estoque", <Package size={17} />, "Estoque")}
          {item("clientes", <Users size={17} />, "Clientes")}
          {item("funcionarios", <IdCard size={17} />, "Funcionários", true)}

          {cat("Financeiro")}
          {item("vendas", <DollarSign size={17} />, "Vendas")}
          {item("relatorios", <BarChart3 size={17} />, "Relatórios", true)}

          {cat("Ferramentas")}
          {item("chatbot", <Bot size={17} />, "Chatbot", true)}
        </nav>

        {/* Usuário */}
        <div className="flex items-center gap-3 border-t border-white/[0.07] px-4 py-3">
          {user?.image ? (
            <img src={user.image} alt="Avatar" className="h-9 w-9 flex-shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#7c6ef5] text-xs text-white">
              {userInitials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-[#e8e4ff]">{user?.nome || "Usuário"}</p>
            <p className="truncate text-[11px] text-[#6f6a93]">{user?.cargo || "Conectado"}</p>
          </div>

          <button
            type="button"
            onClick={() => goto("/configuracoes")}
            aria-label="Configurações"
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06] ${
              isActive("configuracoes") ? "text-[#a99cf8]" : "text-[#6b6890] hover:text-[#a99cf8]"
            }`}
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5">
          <span className="truncate text-[11px] text-[#5a5676]">CodEx Solutions</span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[12px] text-[#8a86b0] transition-colors hover:text-[#f09595]"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
