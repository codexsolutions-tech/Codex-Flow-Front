import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, FileText } from "lucide-react";

import Field from "../../../../components/Input/Field";
import AuthFormInputs, { authSchema } from "../Schema/auth.schema";
import { formatDocument } from "../../../../utils/format";

type AuthFormProps = {
  onSubmit: (data: AuthFormInputs) => Promise<void>;
  isLoading: boolean;
  loginError: boolean;
};

const AuthForm = ({ onSubmit, isLoading, loginError }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AuthFormInputs>({
    resolver: zodResolver(authSchema),
  });

  const regCpfCnpj = register("cpfCnpjEmpresa");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1.5 sm:gap-2">
      {loginError && (
        <div className="mb-3 rounded-lg border border-[#f05050]/[0.22] bg-[#f05050]/10 px-3 py-2">
          <p className="text-xs leading-[1.4] text-[#f09595]">Dados de acesso incorretos.</p>
        </div>
      )}

      {/* CPF / CNPJ */}
      <Field
        label="CPF ou CNPJ da empresa"
        icon={<FileText size={14} />}
        placeholder="00.000.000/0000-00"
        inputMode="numeric"
        error={errors.cpfCnpjEmpresa?.message}
        {...regCpfCnpj}
        onChange={(e) => {
          const formatted = formatDocument(e.target.value);
          e.target.value = formatted;
          setValue("cpfCnpjEmpresa", formatted, { shouldValidate: true });
        }}
      />

      {/* Email */}
      <Field
        label="Email"
        icon={<Mail size={14} />}
        type="email"
        placeholder="seu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Senha */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] uppercase tracking-[0.7px] text-[#6b6790]">Senha</label>
          <button type="button" className="text-[10px] text-[#8b7bf0] transition-colors hover:text-[#a99ff0]">
            Esqueceu a senha?
          </button>
        </div>

        <div className="relative">
          <Field
            label="" // label já está acima
            icon={<Lock size={14} />}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.senha?.message}
            className="pr-10"
            {...register("senha")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e5a82] hover:text-[#a99ff0] transition-colors"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative mt-1 w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#7c5cff] via-[#6c5ce7] to-[#3b6ef5] py-2.5 text-xs sm:text-sm font-medium text-white shadow-[0_10px_25px_-8px_rgba(108,92,231,0.7)] transition-all duration-200 hover:shadow-[0_14px_35px_-8px_rgba(59,110,245,0.65)] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative">{isLoading ? "Entrando..." : "Entrar"}</span>
      </button>
    </form>
  );
};

export default AuthForm;
