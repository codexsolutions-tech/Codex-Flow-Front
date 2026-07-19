import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

export interface HeaderTab {
  label: string;
  path: string;
  icon?: ReactNode;
}

interface HeaderPageProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  tabs?: HeaderTab[];
  actions?: ReactNode;
}

const HeaderPage = ({ title, subtitle, icon, tabs, actions }: HeaderPageProps) => {
  return (
    <header className="relative z-20 shrink-0 border-b border-white/[0.07] bg-[#0e0d1a]/80 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 lg:px-8">
        <div className="flex items-center gap-3.5">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#7c6ef5]/25 bg-gradient-to-br from-[#7c6ef5]/25 to-[#a78bfa]/10 text-[#b7aef9]">
              {icon}
            </div>
          )}

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#f1eeff]">{title}</h1>

            {subtitle && <p className="text-xs text-[#6f6a93]">{subtitle}</p>}
          </div>
        </div>

        {tabs ? (
          <nav className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#2b2348] text-white shadow-lg"
                      : "text-[#8a85b4] hover:bg-[#1b1730] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {tab.icon && <span className={isActive ? "text-[#a78bfa]" : "text-[#6f6a93]"}>{tab.icon}</span>}

                    {tab.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        ) : (
          actions
        )}
      </div>
    </header>
  );
};

export default HeaderPage;
