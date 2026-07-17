import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "../../../store/AuthStore/useAuth";
import AuthFormInputs, { authSchema } from "./AuthSchema";

// ⚠️ Ajuste o path para onde você mantém o onlyDigits
import { onlyDigits } from "../../../utils/format";

const LANDING_ROUTE = "/page";

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

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>({ resolver: zodResolver(authSchema) });

  const onSubmit = async (data: AuthFormInputs) => {
    if (isLoading) return;
    setLoginError(false);
    setIsLoading(true);
    const toastId = toast.loading("Entrando...");
    try {
      await login({
        email: data.email,
        senha: data.senha,
        cpfCnpjEmpresa: onlyDigits(data.cpfCnpjEmpresa),
      });
      toast.update(toastId, {
        render: "Login realizado!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      // redirect é feito pelo AuthGate quando isLogged vira true
    } catch {
      setLoginError(true);
      toast.update(toastId, {
        render: "Erro ao fazer login",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------- Estilos compactos ------------------------- */

  const fieldBox =
    "flex min-w-0 items-center gap-2 px-3 rounded-lg bg-white/[0.035] border border-white/[0.08] transition-all duration-200 " +
    "hover:border-white/[0.14] focus-within:border-[#7c6ef5] focus-within:bg-white/[0.05] focus-within:ring-2 focus-within:ring-[#7c6ef5]/15";
  const labelCls = "block text-[10px] uppercase tracking-[0.7px] text-[#6b6790] mb-1";
  const inputCls =
    "cf-input w-full flex-1 min-w-0 bg-transparent outline-none py-2.5 text-[13px] sm:text-sm text-[#e8e4ff] placeholder:text-[#6f6a93]";
  const errCls = "mt-0.5 min-h-[13px] text-[10px] leading-[13px] text-[#f09595]";

  const regCpfCnpj = register("cpfCnpjEmpresa");

  return (
    <div className="cf-page relative h-[100dvh] w-full flex items-center justify-center px-3 py-3 sm:px-4 sm:py-5 bg-[#0b0913] overflow-hidden">
      <ToastContainer position="top-right" theme="dark" />

      <style>{`
        .cf-input:-webkit-autofill,
        .cf-input:-webkit-autofill:hover,
        .cf-input:-webkit-autofill:focus,
        .cf-input:-webkit-autofill:active {
          -webkit-text-fill-color: #e8e4ff;
          caret-color: #e8e4ff;
          border-radius: 8px;
          -webkit-box-shadow: 0 0 0 1000px #16131f inset;
          box-shadow: 0 0 0 1000px #16131f inset;
          transition: background-color 9999999s ease-in-out 0s;
        }

        @keyframes cf-rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cf-halo {
          0%, 100% { opacity: .5; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: .75; transform: translate(-50%, -50%) scale(1.06); }
        }
        .cf-rise   { animation: cf-rise .5s cubic-bezier(.22,.61,.36,1) both; }
        .cf-rise-2 { animation: cf-rise .5s cubic-bezier(.22,.61,.36,1) .08s both; }
        .cf-halo   { animation: cf-halo 5.5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cf-rise, .cf-rise-2, .cf-halo { animation: none; }
        }
      `}</style>

      {/* Glows de fundo */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#8b5cf6] opacity-[0.15] blur-[130px]" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#3b6ef5] opacity-[0.15] blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#6c5ce7] opacity-[0.09] blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col max-h-full">
        {/* Marca compacta e horizontal */}
        <div className="cf-rise flex items-center justify-center gap-3 mb-3 sm:mb-4">
          <button
            type="button"
            onClick={() => navigate(LANDING_ROUTE)}
            className="group relative inline-flex items-center justify-center transition-transform duration-300 hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c6ef5]/60 rounded-xl"
            aria-label="Ir para a página inicial do Codex Flow"
          >
            <span className="cf-halo pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full bg-[#7c5cff] opacity-50 blur-[36px]" />
            <img
              src="/logo.png"
              alt="Codex Flow"
              width={48}
              height={48}
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-[0_10px_30px_-8px_rgba(108,92,231,0.6)]"
            />
          </button>

          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg font-medium tracking-tight text-[#f0effe]">Codex Flow</span>
            <span className="text-[10px] uppercase tracking-[2px] text-[#6b6790]">Painel da empresa</span>
          </div>
        </div>

        {/* Card */}
        <div className="cf-rise-2 relative rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:p-6 backdrop-blur-xl shadow-[0_25px_70px_-25px_rgba(0,0,0,0.8)]">
          {/* fio superior com o degradê da logo */}
          <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#9b6bff] to-transparent opacity-70" />

          <h1 className="text-base sm:text-lg font-medium text-[#f0effe] mb-0.5">Entrar</h1>
          <p className="text-[11px] text-[#7a769e] mb-3 sm:mb-4">Acesse sua conta para continuar</p>

          {loginError && (
            <div className="mb-3 rounded-lg border border-[#f05050]/[0.22] bg-[#f05050]/10 px-3 py-2">
              <p className="text-xs leading-[1.4] text-[#f09595]">Dados de acesso incorretos.</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1.5 sm:gap-2">
            <div>
              <label className={labelCls}>CPF ou CNPJ da empresa</label>
              <div className={fieldBox}>
                <FileText size={14} className="shrink-0 text-[#5e5a82]" />
                <input
                  {...regCpfCnpj}
                  onChange={(e) => {
                    e.target.value = maskCpfCnpj(e.target.value);
                    regCpfCnpj.onChange(e);
                  }}
                  inputMode="numeric"
                  placeholder="00.000.000/0000-00"
                  className={inputCls}
                />
              </div>
              <p className={errCls}>{errors.cpfCnpjEmpresa?.message}</p>
            </div>

            <div>
              <label className={labelCls}>Email</label>
              <div className={fieldBox}>
                <Mail size={14} className="shrink-0 text-[#5e5a82]" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className={inputCls}
                />
              </div>
              <p className={errCls}>{errors.email?.message}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`${labelCls} mb-0`}>Senha</label>
                <button type="button" className="text-[10px] text-[#8b7bf0] transition-colors hover:text-[#a99ff0]">
                  Esqueceu a senha?
                </button>
              </div>
              <div className={fieldBox}>
                <Lock size={14} className="shrink-0 text-[#5e5a82]" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("senha")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex items-center text-[#5e5a82] transition-colors hover:text-[#a99ff0]"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className={errCls}>{errors.senha?.message}</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-1 w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#7c5cff] via-[#6c5ce7] to-[#3b6ef5] py-2.5 text-xs sm:text-sm font-medium text-white shadow-[0_10px_25px_-8px_rgba(108,92,231,0.7)] transition-all duration-200 hover:shadow-[0_14px_35px_-8px_rgba(59,110,245,0.65)] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{isLoading ? "Entrando..." : "Entrar"}</span>
            </button>
          </form>

          <p className="mt-3 text-center text-[11px] text-[#6b6790]">
            Ainda não tem conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="text-[#8b7bf0] transition-colors hover:text-[#a99ff0]"
            >
              Cadastre sua empresa
            </button>
          </p>
        </div>

        <p className="mt-2 sm:mt-3 text-center text-[10px] text-[#5e5a82]">
          © {new Date().getFullYear()} Codex Flow ·{" "}
          <button
            type="button"
            onClick={() => navigate(LANDING_ROUTE)}
            className="text-[#8b7bf0] transition-colors hover:text-[#a99ff0]"
          >
            Conheça o Codex Flow
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
