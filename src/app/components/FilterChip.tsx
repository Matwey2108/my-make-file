interface FilterChipProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, icon, active = false, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200
        flex items-center gap-2
        ${
          active
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
            : 'bg-white border border-border text-foreground hover:border-primary/30 hover:shadow-sm'
        }
      `}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
