interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const HeaderPage = ({ title, subtitle, icon, actions }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600">
            {icon}
          </div>
        )}

        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl text-gray-900">{title}</h1>

          {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        </div>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default HeaderPage;
