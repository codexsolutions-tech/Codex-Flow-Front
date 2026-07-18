import { useCallback, useMemo, useRef, useState } from "react";
import { User, Mail, Phone, Briefcase, Camera, Trash2, Lock, Shield } from "lucide-react";

import useAuth from "../../store/AuthStore/useAuth";
import Field from "../../components/Input/Field";

import { SettingsCard, SaveRow, PasswordField, useSaver, maskPhone } from "./ui";

const PerfilTab = () => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const profileSaver = useSaver(/* async () => UserService.update(...) */);
  const pwdSaver = useSaver();

  const [photo, setPhoto] = useState<string | null>(user?.image ?? null);
  const [form, setForm] = useState({
    name: user?.nome ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    role: user?.cargo ?? "",
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
  const setP = useCallback((k: string, v: string) => setPwd((p) => ({ ...p, [k]: v })), []);
  const togglePwd = useCallback(() => setShowPwd((v) => !v), []);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // 2MB
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const pwdError = pwd.confirm && pwd.confirm !== pwd.next ? "As senhas não coincidem" : undefined;
  const canUpdatePwd = Boolean(pwd.current && pwd.next && pwd.next === pwd.confirm);

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
      <SettingsCard
        icon={<User className="h-4 w-4" />}
        title="Meu perfil"
        desc="Foto e informações pessoais."
        footer={<SaveRow {...profileSaver} onSave={profileSaver.save} />}
      >
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {photo ? (
            <img src={photo} alt="Foto" className="h-20 w-20 rounded-2xl border border-[#7c6ef5]/40 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#7c6ef5]/40 bg-gradient-to-br from-[#534AB7] to-[#a78bfa] text-2xl font-semibold text-white">
              {initials}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.06] px-4 py-2 text-[13px] text-[#c4baff] transition-all hover:bg-white/[0.12]"
            >
              <Camera size={15} /> Trocar foto
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e24b4a]/25 bg-[#a22d2d]/20 px-4 py-2 text-[13px] text-[#f09595] transition-all hover:bg-[#a22d2d]/30"
              >
                <Trash2 size={15} /> Remover
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <Field
            label="Nome completo"
            icon={<User size={15} />}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Seu nome"
          />
          <Field
            label="E-mail"
            icon={<Mail size={15} />}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            type="email"
            placeholder="voce@empresa.com"
          />
          <Field
            label="Telefone"
            icon={<Phone size={15} />}
            value={form.phone}
            onChange={(e) => set("phone", maskPhone(e.target.value))}
            placeholder="(00) 00000-0000"
          />
          <Field
            label="Cargo"
            icon={<Briefcase size={15} />}
            value={form.role}
            hint="Definido pela empresa"
            disabled
            readOnly
          />
        </div>
      </SettingsCard>

      <SettingsCard
        icon={<Lock className="h-4 w-4" />}
        title="Alterar senha"
        desc="Use uma senha forte e única."
        footer={
          <SaveRow
            {...pwdSaver}
            onSave={pwdSaver.save}
            label="Atualizar senha"
            savedLabel="Senha atualizada"
            icon={<Shield className="h-4 w-4" />}
            variant="secondary"
            disabled={!canUpdatePwd}
          />
        }
      >
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-3">
          <PasswordField
            label="Senha atual"
            value={pwd.current}
            onChange={(v) => setP("current", v)}
            show={showPwd}
            onToggle={togglePwd}
          />
          <PasswordField
            label="Nova senha"
            value={pwd.next}
            onChange={(v) => setP("next", v)}
            show={showPwd}
            onToggle={togglePwd}
          />
          <PasswordField
            label="Confirmar"
            value={pwd.confirm}
            onChange={(v) => setP("confirm", v)}
            show={showPwd}
            onToggle={togglePwd}
            error={pwdError}
          />
        </div>
      </SettingsCard>
    </div>
  );
};

export default PerfilTab;
