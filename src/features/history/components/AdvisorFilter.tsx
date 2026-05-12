import { ChevronDown } from "lucide-react";

interface AdvisorFilterProps {
  value: string;
  onChange: (v: string) => void;
  advisors: string[];
}

function AdvisorFilter({ value, onChange, advisors }: AdvisorFilterProps) {
  return (
    <div className="relative w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border border-border bg-surface text-text-secondary hover:bg-bg-dark cursor-pointer transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        <option value="">Todos los asesores</option>
        {advisors.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
    </div>
  );
}

export { AdvisorFilter };
